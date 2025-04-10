import { t } from "i18next";
import { convertCanvasToResolution, convertResolutionToCanvas, drawLine, drawSquare } from "./canvas-draw";

interface Point {
  x: number;
  y: number;
  id?: number;
}

// drawZones - vẽ zone sau khi trả về tọa độ các điểm
export const drawZones = (quadPoints, canvasRef) => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.moveTo(quadPoints[0].x, quadPoints[0].y);
  quadPoints.forEach((point) => ctx.lineTo(point.x, point.y));
  ctx.closePath();
  ctx.fillStyle = "rgba(0, 128, 255, 0.3)";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.stroke();

  drawSquare(ctx, { x: quadPoints[0].x, y: quadPoints[0].y });
};

// function handleMouseMovePID - thao tác di chuyển chuột sau khi click
let lastMousePosition: { x: number; y: number } | null = null;
export const handleMouseMovePID = (e, canvasRef, points, zones, isDrawLaneEncroachment, isRawWrongWay) => {
    if (points.length === 0) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (lastMousePosition && lastMousePosition.x === x && lastMousePosition.y === y) {
        return;
    }
    lastMousePosition = { x, y };

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    interface ConvertedZone {
      id: string;
      points: { x: number; y: number }[];
      direction?: number;
    }
    let convertedZones: ConvertedZone[] = [];
    if (zones) {
      if (isDrawLaneEncroachment) {
        zones.forEach((zone) => {
          const convertedZone = zone['lines'].map((z: { x: number; y: number }) =>
            convertResolutionToCanvas(z.x, z.y, canvas.clientWidth, canvas.clientHeight)
          );
          convertedZones.push({
            id: zone['id'],
            points: convertedZone,
            direction: zone['direction']
          });
        });
      } else {
        zones.forEach((zone) => {
          const convertedZone = zone['points'].map((z: { x: number; y: number }) =>
            convertResolutionToCanvas(z.x, z.y, canvas.clientWidth, canvas.clientHeight)
          );
          convertedZones.push({
            id: zone['id'],
            points: convertedZone,
            direction: zone['direction']
          });
        });
      }

      if (convertedZones.length) {
        convertedZones.forEach((zone) => {
          ctx.strokeStyle = 'yellow';
          drawZones(zone.points, canvasRef);
          ctx.fillStyle = "red ";
          ctx.font = "bold 16px Arial";
          if (isRawWrongWay) {
            const { centerX, centerY } = CenterZoneCalculator(zone);
            let directionText = '';
            switch(zone.direction) {
              case 1:
                directionText = 'A\n↓\nB';
                break;
              case -1:
                directionText = 'A\n↑\nB';
                break;
              default:
                directionText = 'A\n↓\nB';
            }
            ctx.fillText(`${zone.id}`, zone.points[0].x + 10, zone.points[0].y + 20);

            const lines = directionText.split('\n');
            const lineHeight = 20;
            const totalHeight = lines.length * lineHeight;
            const startY = centerY - (totalHeight / 2);
            lines.forEach((line, index) => {
              const textWidth = ctx.measureText(line).width;
              const x = centerX - (textWidth / 2);
              const y = startY + (index * lineHeight);
              ctx.fillText(line, x, y);
            });
          } else if (isDrawLaneEncroachment) {
            const { centerX, centerY } = CenterZoneCalculator(zone);
            let directionText = '';
            switch(zone.direction) {
              case 1:
                directionText = '(A → B)';
                break;
              case -1:
                directionText = '(A ← B)';
                break;
              case 0:
                directionText = '(A ↔ B)';
                break;
              default:
                directionText = '(A → B)';
            }
            ctx.fillText(`${zone.id}`, zone.points[0].x + 10, zone.points[0].y + 20);
            ctx.fillText(`${directionText}`, centerX - 20, centerY);
          } else {
            ctx.fillText(`${zone.id}`, zone.points[0].x + 5, zone.points[0].y + 20);
          }
        });
      } 
    }

    // Vẽ lại các điểm đã click
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Vẽ đường tạm thời đến vị trí chuột
    ctx.beginPath();
    ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 3;
    ctx.stroke();
};

const sortPoints = (points: { x: number; y: number }[]) => {
  if (points.length !== 4) return points;
  
  const sortedByY = [...points].sort((a, b) => a.y - b.y);
  
  const topPoints = sortedByY.slice(0, 2);
  const bottomPoints = sortedByY.slice(2);
  
  const sortedTopPoints = topPoints.sort((a, b) => a.x - b.x);
  const sortedBottomPoints = bottomPoints.sort((a, b) => a.x - b.x);
  
  return [
    sortedBottomPoints[0],
    sortedTopPoints[0],
    sortedTopPoints[1],
    sortedBottomPoints[1]
  ];
};

// function handleCanvasClick - xử lý sau mỗi lần click
export const handleCanvasClick = (e, canvasRef, setPoints, onZonesChange, zones, setSelectedZoneIndex, 
  MAX_ZONE, currentOrder, MAX_POINTS, isDrawLaneEncroachment, currentDirection) => {

  if (zones.length > MAX_ZONE) return;
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = 'yellow';
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  let selectedIndex = null;
  zones.forEach((zone) => {
    if (isDrawLaneEncroachment) {
      if (!zone.lines) return;
      const zoneStart = convertResolutionToCanvas(zone.lines[0].x, zone.lines[0].y, canvas.clientWidth, canvas.clientHeight);
      if (
      Math.abs(zoneStart.x - x) < 10 &&
      Math.abs(zoneStart.y - y) < 10
    ) {
        selectedIndex = zone.id;
      }
    } else {
      if (!zone.points) return;
      const zoneStart = convertResolutionToCanvas(zone.points[0].x, zone.points[0].y, canvas.clientWidth, canvas.clientHeight);
      if (
        Math.abs(zoneStart.x - x) < 10 &&
        Math.abs(zoneStart.y - y) < 10
      ) {
        selectedIndex = zone.id;
      }
    }
  });
  
  if (selectedIndex !== null) {
    setSelectedZoneIndex(selectedIndex);
  } else {
    if (zones.length === MAX_ZONE) return;

    // Kiểm tra xem số thứ tự đã tồn tại chưa
    const orderExists = zones.some(zone => zone.id === Number(currentOrder));
    if (orderExists) {
      return;
    }

    setPoints((prevPoints) => {
      const totalPoints = [...prevPoints, { x, y }];
  
      // Check if the last point is close to the first point
      if (totalPoints.length > 3 && totalPoints.length < MAX_POINTS) {
        const firstPoint = totalPoints[0];
        const distance = Math.sqrt(
          Math.pow(firstPoint.x - x, 2) + Math.pow(firstPoint.y - y, 2)
        );
  
        if (distance < 10) { // If the points are close enough
          const finalPoints = [...prevPoints, firstPoint];
          drawZones(finalPoints, canvasRef);
          // convert point to resolution
          const convertedPoints = finalPoints.map((point) =>
            convertCanvasToResolution(point.x, point.y, canvas.clientWidth, canvas.clientHeight)
          );
  
          const newZone = {
            id: Number(currentOrder),
            points: convertedPoints,
            direction: Number(currentDirection)
          };

          onZonesChange(prevZones => {
            const isDuplicate = prevZones.some(zone => 
              JSON.stringify(zone.points) === JSON.stringify(convertedPoints)
            );
            return isDuplicate ? prevZones : [...prevZones, newZone];
          });
  
          return [];
        }
      }
  
      if (totalPoints.length === MAX_POINTS) {
        drawZones(totalPoints, canvasRef);
        // convert point to resolution
        const convertedPoints = totalPoints.map((point) =>
          convertCanvasToResolution(point.x, point.y, canvas.clientWidth, canvas.clientHeight)
        );

        if (isDrawLaneEncroachment) {
          const sortedPoints = sortPoints(convertedPoints);
          const newZone = {
            id: Number(currentOrder),
            lines: sortedPoints,
            direction: Number(currentDirection)
          };
  
          onZonesChange(prevZones => {
            const isDuplicate = prevZones.some(zone => 
              JSON.stringify(zone.lines) === JSON.stringify(sortedPoints)
            );
            return isDuplicate ? prevZones : [...prevZones, newZone];
          });
        } else {
          const newZone = {
            id: Number(currentOrder),
            points: convertedPoints, 
            direction: Number(currentDirection)
          };
  
          onZonesChange(prevZones => {
            const isDuplicate = prevZones.some(zone => 
              JSON.stringify(zone.points) === JSON.stringify(convertedPoints)
            );
            return isDuplicate ? prevZones : [...prevZones, newZone];
          });
        }
      }
      return totalPoints.length === MAX_POINTS ? [] : totalPoints;
    });
  }
};

export const startDrawing = (e, canvasRef, shapes, setStartPos, setShapes, MAX_SHAPES,
    startPos, onZonesChange, isDrawing, setIsDrawing, currentOrder) => {
    const filteredShapes = shapes.filter(shape => !isNaN(shape.width) && shape.width !== 0);
    if (filteredShapes.length >= MAX_SHAPES) return;

    const orderExists = filteredShapes.some(shape => shape.number === Number(currentOrder));
    if (orderExists) {
        return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (startPos && isDrawing) {
        const newZone =  [
            convertCanvasToResolution(startPos?.x, startPos?.y, canvasRef.current.clientWidth, canvasRef.current.clientHeight),
            convertCanvasToResolution(x, y, canvasRef.current.clientWidth, canvasRef.current.clientHeight),
        ];
        onZonesChange(prevZones => [...prevZones, newZone]);
        setStartPos(null)
        setIsDrawing(false);
    } else {
        setStartPos({ x, y });
        setShapes([...filteredShapes, { x, y, width: 0, height: 0, number: Number(currentOrder), startX: x, startY: y }]);
        setIsDrawing(true);
    }
};

export const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>, canvasRef, shapes, setStartPos, setShapes, 
    MAX_SHAPES, startPos, onZonesChange, isDrawing, setIsDrawing) => {
    const filteredShapes = shapes.filter(shape => !isNaN(shape.width) && shape.width !== 0);
    if (filteredShapes.length >= MAX_SHAPES) return;
    const rect = canvasRef.current.getBoundingClientRect();
    if (e.touches.length > 0) {
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        if (startPos && isDrawing) {
            const newZone =  [
                convertCanvasToResolution(startPos?.x, startPos?.y, canvasRef.current.clientWidth, canvasRef.current.clientHeight),
                convertCanvasToResolution(x, y, canvasRef.current.clientWidth, canvasRef.current.clientHeight),
            ];
            onZonesChange(prevZones => [...prevZones, newZone]);
            setStartPos(null)
            setIsDrawing(false);
        } else {
            setStartPos({ x, y });
            setShapes([...filteredShapes, { x, y, width: 0, height: 0, number: filteredShapes.length + 1, startX: x, startY: y }]);
            setIsDrawing(true);
        }
    } 
};

export const updateShapeSize = (e, canvasRef, shapes, setShapes, startPos) => {
    if (!startPos || shapes.length === 0) return;    
    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    const width = Math.abs(currentX - startPos.x);
    const height = Math.abs(currentY - startPos.y);
    const x = Math.min(currentX, startPos.x);
    const y = Math.min(currentY, startPos.y);
    
    const updatedShapes = [...shapes];
    updatedShapes[updatedShapes.length - 1] = { ...updatedShapes[updatedShapes.length - 1], x, y, width, height };
    if (width > 0) {
        setShapes(updatedShapes);
    }
};

export const updateShapeSizeMobile = (e: React.TouchEvent<HTMLCanvasElement>, canvasRef, shapes, setShapes, startPos) => {
    if (!startPos || shapes.length === 0) return;    
    const rect = canvasRef.current.getBoundingClientRect();
    if (e.touches.length > 0) {
        const currentX = e.touches[0].clientX - rect.left;
        const currentY = e.touches[0].clientY - rect.top;
        
        const width = Math.abs(currentX - startPos.x);
        const height = Math.abs(currentY - startPos.y);
        const x = Math.min(currentX, startPos.x);
        const y = Math.min(currentY, startPos.y);
        
        const updatedShapes = [...shapes];
        updatedShapes[updatedShapes.length - 1] = { ...updatedShapes[updatedShapes.length - 1], x, y, width, height };
        if (width > 0) {
            setShapes(updatedShapes);
        }
    } 
};

export const endDrawing = (e, isDrawing, canvasRef, MAX_SHAPES, shapes, startPos, CANVAS_WIDTH, CANVAS_HEIGHT, 
  PADDING, onZonesChange, setStartPos, currentOrder) => {
    let filteredShapes = shapes.filter(shape => !isNaN(shape.width) && shape.width !== 0);
    if (filteredShapes.length >= MAX_SHAPES) {
        const shapesToDraw = filteredShapes.filter((_, index) => index < 4);
        filteredShapes = shapesToDraw;
    }

    if (!isDrawing || filteredShapes.length > MAX_SHAPES) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x2 = e.clientX - rect.left;
    const y2 = e.clientY - rect.top;

    let x1 = startPos?.x;
    let y1 = startPos?.y;

    let left = Math.min(x1, x2);
    let top = Math.min(y1, y2);
    let right = Math.max(x1, x2);
    let bottom = Math.max(y1, y2);

    // Áp dụng padding
    if (left < PADDING) left = PADDING;
    if (top < PADDING) top = PADDING;
    if (right > CANVAS_WIDTH - PADDING) right = CANVAS_WIDTH - PADDING;
    if (bottom > CANVAS_HEIGHT - PADDING) bottom = CANVAS_HEIGHT - PADDING;

    if (shapes.length > MAX_SHAPES) return;
    if (x1 !== x2 && y1 !== y2) {
        const points = [
            { x: left, y: bottom },
            { x: left, y: top },
            { x: right, y: top },
            { x: right, y: bottom },
        ];
        const convertedPoints = points.map(point => 
            convertCanvasToResolution(
                point.x, 
                point.y, 
                canvasRef.current.clientWidth, 
                canvasRef.current.clientHeight
            )
        );
        const newZone = {
            id: Number(currentOrder),
            lines: convertedPoints
        };
        onZonesChange(prevZones => [...prevZones, newZone]);
    }
    setStartPos(null);
};

export const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>, isDrawing, canvasRef, MAX_SHAPES, shapes, startPos, 
    CANVAS_WIDTH, CANVAS_HEIGHT, PADDING, onZonesChange, setStartPos) => {
      let filteredShapes = shapes.filter(shape => !isNaN(shape.width) && shape.width !== 0);
      if (filteredShapes.length >= MAX_SHAPES) {
          const shapesToDraw = filteredShapes.filter((_, index) => index < 4);
          filteredShapes = shapesToDraw;
      }
  
      if (!isDrawing || filteredShapes.length > MAX_SHAPES) return;
      const rect = canvasRef.current.getBoundingClientRect();
      if (e.changedTouches.length > 0) {
        const x2 = e.changedTouches[0].clientX - rect.left;
        const y2 = e.changedTouches[0].clientY - rect.top;
    
        let x1 = startPos?.x;
        let y1 = startPos?.y;
        let width = Math.abs(x2 - x1);
        let height = Math.abs(y2 - y1);
    
        let left = Math.min(x1, x2);
        let top = Math.min(y1, y2);
    
        if (left < PADDING) left = PADDING;
        if (top < PADDING) top = PADDING;
        if (left + width > CANVAS_WIDTH - PADDING) width = CANVAS_WIDTH - left - PADDING;
        if (top + height > CANVAS_HEIGHT - PADDING) height = CANVAS_HEIGHT - top - PADDING;
    
        if (shapes.length > MAX_SHAPES) return;
        if (x1 !== x2 && y1 !== y2) {
            const newZone =  [ 
                convertCanvasToResolution(startPos?.x, startPos?.y, canvasRef.current.clientWidth, canvasRef.current.clientHeight),
                convertCanvasToResolution(x2, y2, canvasRef.current.clientWidth, canvasRef.current.clientHeight),
            ];
            onZonesChange(prevZones => [...prevZones, newZone]);
        }
        setStartPos(null)
      }
  };

export const drawShapes = (shapeList, canvasRef, CANVAS_WIDTH, CANVAS_HEIGHT, selectedZoneIndex) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    shapeList.forEach((shape) => {
        ctx.beginPath();
        ctx.rect(shape.x, shape.y, shape.width, shape.height);
        ctx.strokeStyle = shape.number === selectedZoneIndex ? 'red' : 'yellow';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();
        
        if (shape.width > 0) {
            ctx.beginPath();
            ctx.arc(shape.startX, shape.startY, 5, 0, Math.PI * 2);
            ctx.fillStyle = "#1b937d";
            ctx.fill();
            ctx.closePath();
            
            ctx.font = "16px Arial";
            ctx.fillStyle = "blue";
            ctx.fillText(shape.number, shape.x + 5, shape.y + 20);
        }
    });
};

export const startDrawingDelimitationLine = (e, lines, canvasRef, setStartPos, 
  startPos, onLinesChange, isDrawing, setIsDrawing, tempLineRef, isDrawDelimitationLine, isDrawNormalLine) => {
  // Check if delimitation line already exists
  if (isDrawDelimitationLine && lines.some(line => line.id === 0)) {
    return;
  }

  // For normal lines, check if we've reached the limit (3 lines)
  if (isDrawNormalLine && lines.filter(line => line.id > 0).length >= 3) {
    return;
  }

  const canvas = canvasRef.current;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  if (startPos && isDrawing) {
      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas) return;

      const lineStart = convertCanvasToResolution(startPos?.x, startPos?.y, canvasRef.current.clientWidth, canvasRef.current.clientHeight);
      const lineEnd = convertCanvasToResolution(x, y, canvasRef.current.clientWidth, canvasRef.current.clientHeight);

      if (Math.abs(lineStart.x - lineEnd.x) >= 20 || Math.abs(lineStart.y - lineEnd.y) >= 20) {
          // Get next available ID for normal lines
          let nextId = 0;
          if (isDrawNormalLine) {
            const existingIds = lines.filter(line => line.id > 0).map(line => line.id);
            nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
            if (nextId > 3) return; // Limit normal lines to IDs 1-3
          }

          const newLine = {
            id: isDrawDelimitationLine ? 0 : nextId,
            points: [lineStart, lineEnd]
          };
          onLinesChange(prevLines => [...prevLines, newLine]);
          tempLineRef.current = null;
      }
      setStartPos(null);
      setIsDrawing(false);
  } else {
      setStartPos({ x, y });
      setIsDrawing(true);
  }
};

export const handleMouseMoveDelimitationLine = (e, isDrawing, canvasRef, startPos, lines, tempLineRef, 
  isDrawDelimitationLine, isDrawNormalLine, signalLight, MAX_LINES, PADDING, CANVAS_WIDTH, CANVAS_HEIGHT, selectedItemIndex) => {
  if (!isDrawing) return;
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext('2d');
  if (!ctx || !canvas) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  tempLineRef.current = [{ x: startPos.x, y: startPos.y }, { x: x, y: y }];
  ctx.strokeStyle = isDrawDelimitationLine ? 'red' : isDrawNormalLine ? 'green' : 'yellow';
  redrawCanvas(canvas, lines, tempLineRef.current, canvasRef, isDrawDelimitationLine, isDrawNormalLine, selectedItemIndex);
  if (signalLight.length > 0) {
    let newShapes: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
      number: number;
      startX: number;
      startY: number;
    }> = [];
    let allConvertedZones: Array<{x: number; y: number}> = [];

    if (signalLight.length >= MAX_LINES) {
      const zonesToDraw = signalLight.filter((_, index) => index < MAX_LINES);
      signalLight = zonesToDraw;
    }

    signalLight.forEach((light: { x: number; y: number }[], index: number) => {
      const convertedZone: { x: number; y: number }[] = light.map((z: { x: number; y: number }) => convertResolutionToCanvas(z.x, z.y, canvas.clientWidth, canvas.clientHeight));
      allConvertedZones.push(...convertedZone);
      if (convertedZone.length === 2) {
        const x2 = convertedZone[1].x;
        const y2 = convertedZone[1].y;
        let x1 = convertedZone[0].x;
        let y1 = convertedZone[0].y;

        let width = Math.abs(x2 - x1);
        let height = Math.abs(y2 - y1);
        let left = Math.min(x1, x2);
        let top = Math.min(y1, y2);

        if (left < PADDING) left = PADDING;
        if (top < PADDING) top = PADDING;
        if (left + width > CANVAS_WIDTH - PADDING) width = CANVAS_WIDTH - left - PADDING;
        if (top + height > CANVAS_HEIGHT - PADDING) height = CANVAS_HEIGHT - top - PADDING;

        newShapes.push({ 
          x: left, 
          y: top, 
          width, 
          height, 
          number: index + 1, 
          startX: x1 as number, 
          startY: y1 as number
        });
      }
    });

    if (allConvertedZones.length) {
      drawShapeSignalLight(newShapes, canvasRef, null);
    }
  }
};

export const endDrawingDelimitationLine = (e, lines, startPos, canvasRef, onLinesChange, tempLineRef, setStartPos, isDrawing, isDrawDelimitationLine, isDrawNormalLine) => {
  // Check if delimitation line already exists
  if (isDrawDelimitationLine && lines.some(line => line.id === 0)) {
    return;
  }

  // For normal lines, check if we've reached the limit (3 lines)
  if (isDrawNormalLine && lines.filter(line => line.id > 0).length >= 3) {
    return;
  }

  if (!isDrawing) {
    return;
  }

  const endX = e.clientX;
  const endY = e.clientY;
  const canvas = canvasRef.current;
  if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = endX - rect.left;
      const y = endY - rect.top;

      const ctx = canvas?.getContext('2d');
      if (!ctx || !canvas) return;

      const lineStart = convertCanvasToResolution(startPos?.x, startPos?.y, canvasRef.current.clientWidth, canvasRef.current.clientHeight);
      const lineEnd = convertCanvasToResolution(x, y, canvasRef.current.clientWidth, canvasRef.current.clientHeight);

      if (Math.abs(lineStart.x - lineEnd.x) >= 20 || Math.abs(lineStart.y - lineEnd.y) >= 20) {
          // Get next available ID for normal lines
          let nextId = 0;
          if (isDrawNormalLine) {
            const existingIds = lines.filter(line => line.id > 0).map(line => line.id);
            nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
            if (nextId > 3) return; // Limit normal lines to IDs 1-3
          }

          const newLine = {
            id: isDrawDelimitationLine ? 0 : nextId,
            line: [lineStart, lineEnd]
          };
          onLinesChange(prevLines => [...prevLines, newLine]);
          tempLineRef.current = null;
      }
  }
  setStartPos(null);
};

export const redrawCanvas = (canvas, lines, tempLine, canvasRef, isDrawDelimitationLine, isDrawNormalLine, selectedItemIndex) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  lines?.forEach((line) => {
      const lineStart = convertResolutionToCanvas(line['line'][0].x, line['line'][0].y, canvasRef.current.clientWidth, canvasRef.current.clientHeight);
      const lineEnd = convertResolutionToCanvas(line['line'][1].x, line['line'][1].y, canvasRef.current.clientWidth, canvasRef.current.clientHeight);
  
      // Set color based on line ID
      ctx.strokeStyle = line.id === 0 ? 'red' : 'green';
      drawLine(ctx, lineStart.x, lineStart.y, lineEnd.x, lineEnd.y);
  
      if (line['line'][0]['x'] == line['line'][1]['x']) {
          return;
      }
      drawSquare(ctx, lineStart);

      const angle = Math.atan2(lineEnd.y - lineStart.y, lineEnd.x - lineStart.x);
      const text = line['id'] === 0 ? t('delimitation_line') : t('line') + ' ' + line['id'];
      
      ctx.save();
      ctx.translate(lineStart.x + 15, lineStart.y - 15);
      ctx.rotate(angle);
      ctx.fillStyle = `line_${line['id']}` === selectedItemIndex ? 'blue' : line['id'] === 0 ? 'red' : 'green';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 10, 0);
      ctx.restore();
  });
  if (tempLine) {
      ctx.strokeStyle = isDrawDelimitationLine ? 'red' : isDrawNormalLine ? 'green' : 'yellow';
      drawLine(ctx, tempLine[0].x, tempLine[0].y, tempLine[1].x, tempLine[1].y);
  }
}

export const startDrawingSignalLight = (e, canvasRef, shapes, setStartPos, setShapes, MAX_SHAPES,
  startPos, onSignalLightChange, isDrawing, setIsDrawing) => {
  const filteredShapes = shapes.filter(shape => !isNaN(shape.width) && shape.width !== 0);
  
  if (filteredShapes.length > MAX_SHAPES) return;
  const rect = canvasRef.current.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (startPos && isDrawing) {
      const newZone =  [
          convertCanvasToResolution(startPos?.x, startPos?.y, canvasRef.current.clientWidth, canvasRef.current.clientHeight),
          convertCanvasToResolution(x, y, canvasRef.current.clientWidth, canvasRef.current.clientHeight),
      ];
      onSignalLightChange(prevZones => [...prevZones, newZone]);
      setStartPos(null)
      setIsDrawing(false);
  } else {
      setStartPos({ x, y });
      setShapes([...filteredShapes, { x, y, width: 0, height: 0, number: filteredShapes.length + 1, startX: x, startY: y }]);
      setIsDrawing(true);
  }
};

export const updateShapeSizeSignalLight = (e, canvasRef, shapes, setShapes, startPos) => {
  if (!startPos || shapes.length === 0) return;
  const rect = canvasRef.current.getBoundingClientRect();
  const currentX = e.clientX - rect.left;
  const currentY = e.clientY - rect.top;
  
  const width = Math.abs(currentX - startPos.x);
  const height = Math.abs(currentY - startPos.y);
  const x = Math.min(currentX, startPos.x);
  const y = Math.min(currentY, startPos.y);
  
  const updatedShapes = [...shapes];
  updatedShapes[updatedShapes.length - 1] = { ...updatedShapes[updatedShapes.length - 1], x, y, width, height };
  if (width > 0) {
    setShapes(updatedShapes);
  }
};

export const endDrawingSignalLight = (e, isDrawing, canvasRef, MAX_SHAPES, shapes, startPos, CANVAS_WIDTH, CANVAS_HEIGHT, 
  PADDING, onSignalLightChange, setStartPos, signalLight) => {
    let filteredShapes = shapes.filter(shape => !isNaN(shape.width) && shape.width !== 0);
    if (filteredShapes.length > MAX_SHAPES) {
        const shapesToDraw = filteredShapes.filter((_, index) => index < 4);
        filteredShapes = shapesToDraw;
    }

    if (!isDrawing || filteredShapes.length > MAX_SHAPES) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x2 = e.clientX - rect.left;
    const y2 = e.clientY - rect.top;

    let x1 = startPos?.x;
    let y1 = startPos?.y;
    let width = Math.abs(x2 - x1);
    let height = Math.abs(y2 - y1);

    let left = Math.min(x1, x2);
    let top = Math.min(y1, y2);

    if (left < PADDING) left = PADDING;
    if (top < PADDING) top = PADDING;
    if (left + width > CANVAS_WIDTH - PADDING) width = CANVAS_WIDTH - left - PADDING;
    if (top + height > CANVAS_HEIGHT - PADDING) height = CANVAS_HEIGHT - top - PADDING;

    if (shapes.length > MAX_SHAPES) return;
    if (x1 !== x2 && y1 !== y2) {
        const newZone =  [ 
            convertCanvasToResolution(startPos?.x, startPos?.y, canvasRef.current.clientWidth, canvasRef.current.clientHeight),
            convertCanvasToResolution(x2, y2, canvasRef.current.clientWidth, canvasRef.current.clientHeight),
        ] as Point[];
        newZone.forEach(point => {
          point.id = signalLight.length + 1;
        });
        
        onSignalLightChange(prevZones => {
          const updatedZones = [...prevZones, newZone];
          // Draw the new zone immediately
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            const convertedZone = newZone.map(point => 
              convertResolutionToCanvas(point.x, point.y, canvasRef.current.clientWidth, canvasRef.current.clientHeight)
            );
            const shape = {
              x: Math.min(convertedZone[0].x, convertedZone[1].x),
              y: Math.min(convertedZone[0].y, convertedZone[1].y),
              width: Math.abs(convertedZone[1].x - convertedZone[0].x),
              height: Math.abs(convertedZone[1].y - convertedZone[0].y),
              number: updatedZones.length,
              startX: convertedZone[0].x,
              startY: convertedZone[0].y
            };
            drawShapeSignalLight([shape], canvasRef, null);
          }
          return updatedZones;
        });
    }
    setStartPos(null);
};

export const drawShapeSignalLight = (shapes: any[], canvasRef: any, selectedItemIndex: any) => {
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext('2d');
  if (!ctx || !canvas) return;

  shapes.forEach((shape) => {
    ctx.beginPath();
    ctx.strokeStyle = selectedItemIndex === `light_${shape.number}` ? 'yellow' : 'red';
    ctx.lineWidth = 3;
    ctx.rect(shape.x, shape.y, shape.width, shape.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(shape.startX, shape.startY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#1b937d";
    ctx.fill();
    ctx.closePath();

    // Draw the number
    ctx.fillStyle = selectedItemIndex === `light_${shape.number}` ? 'yellow' : 'red';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`${shape.number}`, shape.x + 5, shape.y - 5);
  });
};

export const CenterZoneCalculator = (zone) => {
  let area = 0;
  let cx = 0;
  let cy = 0;
  
  for (let i = 0; i < zone.points.length; i++) {
    const j = (i + 1) % zone.points.length;
    const xi = zone.points[i].x;
    const yi = zone.points[i].y;
    const xj = zone.points[j].x;
    const yj = zone.points[j].y;
    
    const factor = (xi * yj - xj * yi);
    area += factor;
    cx += (xi + xj) * factor;
    cy += (yi + yj) * factor;
  }
  
  area *= 0.5;
  const centerX = cx / (6 * area);
  const centerY = cy / (6 * area);

  return { centerX, centerY };
}
