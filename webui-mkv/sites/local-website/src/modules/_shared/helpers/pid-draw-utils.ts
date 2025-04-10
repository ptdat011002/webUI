import { calMiddle, convertCanvasToResolution, convertResolutionToCanvas, drawDirection, drawFromAToB, drawSquare } from "./canvas-draw";

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

  // Kiểm tra hướng của zone
  const clockwise = isClockwise(quadPoints);

  // Vẽ mũi tên vuông góc và chữ A, B cho từng cạnh
  for (let i = 0; i < quadPoints.length - 1; i++) {
      drawPerpendicularArrow(ctx, quadPoints[i], quadPoints[i + 1], clockwise);
  }
};

// function handleMouseMovePID - thao tác di chuyển chuột sau khi click
let lastMousePosition: { x: number; y: number } | null = null;
export const handleMouseMovePID = (e, canvasRef, points, zones) => {
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

    let convertedZones: { x: number; y: number }[][] = [];
    if (zones) {
      zones.forEach((zone) => {
        const convertedZone = zone.map((z: { x: number; y: number }) =>
          convertResolutionToCanvas(z.x, z.y, canvas.clientWidth, canvas.clientHeight)
        );
        convertedZones.push(convertedZone);
      });

      if (convertedZones.length) {
        convertedZones.forEach((zone, index) => {
          ctx.strokeStyle = 'yellow';
          drawZones(zone, canvasRef);
          ctx.fillStyle = "#1b937d";
          ctx.font = "bold 16px Arial";
          ctx.fillText(`${index + 1}`, zone[0].x + 5, zone[0].y - 5);
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

// function handleCanvasClick - xử lý sau mỗi lần click
export const handleCanvasClick = (e, canvasRef, setPoints, onZonesChange, zones, setSelectedZoneIndex, MAX_ZONE) => {
  if (zones.length > MAX_ZONE) return;
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  ctx.strokeStyle = 'yellow';
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  let selectedIndex = null;
  zones.forEach((zone, index) => {
    const zoneStart = convertResolutionToCanvas(zone[0].x, zone[0].y, canvas.clientWidth, canvas.clientHeight);
    if (
      Math.abs(zoneStart.x - x) < 10 &&
      Math.abs(zoneStart.y - y) < 10
    ) {
      selectedIndex = index;
    }
  });

  if (selectedIndex !== null) {
    setSelectedZoneIndex(selectedIndex);
  } else {
    if (zones.length === MAX_ZONE) return;
    setPoints((prevPoints) => {
      const totalPoints = [...prevPoints, { x, y }];
  
      // Check if the last point is close to the first point
      if (totalPoints.length > 3 && totalPoints.length < 8) {
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
  
          onZonesChange(prevLines => {
            const isDuplicate = prevLines.some(line => JSON.stringify(line) === JSON.stringify(convertedPoints));
            return isDuplicate ? prevLines : [...prevLines, convertedPoints];
          });
  
          return [];
        }
      }
  
      if (totalPoints.length === 8) {
        drawZones(totalPoints, canvasRef);
        // convert point to resolution
        const convertedPoints = totalPoints.map((point) =>
          convertCanvasToResolution(point.x, point.y, canvas.clientWidth, canvas.clientHeight)
        );
        onZonesChange(prevLines => {
          const isDuplicate = prevLines.some(line => JSON.stringify(line) === JSON.stringify(convertedPoints));
          return isDuplicate ? prevLines : [...prevLines, convertedPoints];
        });
      }
      return totalPoints.length === 8 ? [] : totalPoints;
    });
  } 
};
  
// Hàm vẽ mũi tên vuông góc và các chữ A, B
export const drawPerpendicularArrow = (ctx, start, end, clockwise) => {
  // Tính trung điểm của đoạn thẳng
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;

  // Vector cạnh
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  // Vector pháp tuyến vuông góc
  const magnitude = Math.sqrt(dx * dx + dy * dy);
  let perpX = dy / magnitude;
  let perpY = -dx / magnitude;

  // Nếu thứ tự click ngược chiều kim đồng hồ => đảo chiều mũi tên
  if (clockwise) {
      perpX = -perpX;
      perpY = -perpY;
  }

  // Quy đổi độ dài mũi tên (giả định 50 pixel)
  const arrowLength = 30;

  const middle = calMiddle(midX, midY, {perpX: perpX, perpY: perpY}, arrowLength);

  drawDirection(ctx, midX, midY, middle.arrowEndX, middle.arrowEndY);

  // Vẽ chữ A, B
  drawFromAToB(ctx, midX, midY, perpX, perpY, arrowLength, middle.arrowEndX, middle.arrowEndY);
};
  
// isClockwise - kiểm tra thứ tự click theo hướng kim đồng hồ
export const isClockwise = (points) => {
  let sum = 0;

  for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      sum += (next.x - current.x) * (next.y + current.y);
  }

  const first = points[0];
  const last = points[points.length - 1];
  sum += (first.x - last.x) * (first.y + last.y);

  return sum < 0;
};