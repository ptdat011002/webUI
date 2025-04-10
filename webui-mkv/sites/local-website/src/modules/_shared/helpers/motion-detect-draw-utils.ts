import { convertCanvasToResolution } from "./canvas-draw";

export const startDrawing = (e, canvasRef, shapes, setStartPos, setShapes, MAX_SHAPES,
    startPos, onZonesChange, isDrawing, setIsDrawing) => {
    const filteredShapes = shapes.filter(shape => !isNaN(shape.width) && shape.width !== 0);
    if (filteredShapes.length >= MAX_SHAPES) return;
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
        setShapes([...filteredShapes, { x, y, width: 0, height: 0, number: filteredShapes.length + 1, startX: x, startY: y }]);
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
  PADDING, onZonesChange, setStartPos) => {
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
    
    shapeList.forEach((shape, index) => {
        ctx.beginPath();
        ctx.rect(shape.x, shape.y, shape.width, shape.height);
        ctx.strokeStyle = index === selectedZoneIndex ? 'red' : 'yellow';
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
