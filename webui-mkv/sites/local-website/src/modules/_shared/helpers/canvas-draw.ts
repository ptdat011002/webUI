// function drawLine - vẽ đường line quy định hàng rào
export const drawLine = (ctx, startX, startY, x, y) => {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(x, y);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
};

// function drawDirection - vẽ mũi tên quy định hướng xâm nhập
export const drawDirection = (ctx, arrowStartX, arrowStartY, arrowEndX, arrowEndY) => {
    // Vẽ đoạn thẳng
    ctx.beginPath();
    ctx.moveTo(arrowStartX, arrowStartY);
    ctx.lineTo(arrowEndX, arrowEndY);
    ctx.strokeStyle = '#1b937d';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Vẽ mũi tên
    const arrowAngle = Math.PI / 6;
    const arrowLength = 10;
    const angle = Math.atan2(arrowEndY - arrowStartY, arrowEndX - arrowStartX);

    ctx.beginPath();
    ctx.moveTo(arrowEndX, arrowEndY);
    ctx.lineTo(
    arrowEndX - arrowLength * Math.cos(angle - arrowAngle),
    arrowEndY - arrowLength * Math.sin(angle - arrowAngle)
    );
    ctx.moveTo(arrowEndX, arrowEndY);
    ctx.lineTo(
    arrowEndX - arrowLength * Math.cos(angle + arrowAngle),
    arrowEndY - arrowLength * Math.sin(angle + arrowAngle)
    );
    ctx.strokeStyle = '#1b937d';
    ctx.lineWidth = 3;
    ctx.stroke();
}

// function drawSquare - vẽ hình vuông đánh dấu điểm đầu tiên
export const drawSquare = (ctx, lineStart) => {
    ctx.beginPath();
    ctx.rect(lineStart.x - 5, lineStart.y - 5, 10, 10);                 
    ctx.fillStyle = '#1b937d';
    ctx.fill();
    ctx.closePath();
}

// function drawFromAToB - vẽ 2 điểm A và B thể hiện hướng di chuyển của đối tượng
export const drawFromAToB = (ctx, midX, midY, perpX, perpY, lengthPx, arrowEndX, arrowEndY) => {
    const oppositeEndX = midX - perpX * lengthPx;
    const oppositeEndY = midY - perpY * lengthPx;
    ctx.font = '16px Arial';
    ctx.fillStyle = 'yellow';
    ctx.fillText('A', oppositeEndX - 10, oppositeEndY - 10);
    ctx.fillText('B', arrowEndX + 5, arrowEndY - 5);
}

// function calMiddle - tính trung điểm của đoạn thẳng để vẽ mũi tên vuông góc
export const calMiddle = (midX, midY, perp, lengthPx) => {
    // Tính tọa độ điểm cuối của đoạn vuông góc
    const arrowEndX = midX + perp.perpX * lengthPx;
    const arrowEndY = midY + perp.perpY * lengthPx;

    return {
        arrowEndX: arrowEndX,
        arrowEndY: arrowEndY
    };
}

// function directionOfArrow - xác định hướng của mũi tên
export const directionOfArrow = (lineStartX, lineStartY, lineEndX, lineEndY) => {
    let perpX = 0;
    let perpY = 0;
    const dx = lineEndX - lineStartX;
    const dy = lineEndY - lineStartY;
    const magnitude = Math.sqrt(dx * dx + dy * dy);
    if (lineStartX <= lineEndX) {
        perpX = dy / magnitude;
        perpY = -dx / magnitude;
    } else {
        perpX = -dy / magnitude;
        perpY = dx / magnitude;
    }

    return { perpX: perpX, perpY: perpY };
}

// function handleMouseDown - thao tác click chuột tại điểm bắt đầu
export const handleMouseDown = (e, lines, canvasRef, setStartPos, MAX_LINES, 
    startPos, onLinesChange, onDirectionsChange, isDrawing, setIsDrawing, tempLineRef) => {
    if (lines.length >= MAX_LINES) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (startPos && isDrawing) {
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        const perp = directionOfArrow(startPos.x, startPos.y, x, y);
        const midX = (startPos.x + x) / 2;
        const midY = (startPos.y + y) / 2;

        const middle = calMiddle(midX, midY, perp, 30);

        const { lineStart, lineEnd, arrowStart, arrowEnd } = getLineAndArrowPoints(
        startPos.x, startPos.y,
        x, y,
        midX, midY,
        middle.arrowEndX, middle.arrowEndY,
        canvasRef
        );

        if (Math.abs(lineStart.x - lineEnd.x) >= 20 || Math.abs(lineStart.y - lineEnd.y) >= 20) {
            onLinesChange(prevLines => [...prevLines, [lineStart, lineEnd]]);
            onDirectionsChange(prevDirecs => [...prevDirecs, [arrowStart, arrowEnd]]);
            tempLineRef.current = null;
        }
        setStartPos(null)
        setIsDrawing(false);
    } else {
        setStartPos({ x, y });
        setIsDrawing(true);
    }
};

export const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>, lines, canvasRef, 
    setStartPos, MAX_LINES, startPos, onLinesChange, onDirectionsChange, isDrawing, setIsDrawing, tempLineRef) => {
    if (lines.length >= MAX_LINES) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (e.touches.length > 0) {
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;
        if (startPos && isDrawing) {
            const ctx = canvas?.getContext('2d');
            if (!ctx || !canvas) return;
    
            const perp = directionOfArrow(startPos.x, startPos.y, x, y);
            const midX = (startPos.x + x) / 2;
            const midY = (startPos.y + y) / 2;
    
            const middle = calMiddle(midX, midY, perp, 30);
    
            const { lineStart, lineEnd, arrowStart, arrowEnd } = getLineAndArrowPoints(
            startPos.x, startPos.y,
            x, y,
            midX, midY,
            middle.arrowEndX, middle.arrowEndY,
            canvasRef
            );
    
            if (Math.abs(lineStart.x - lineEnd.x) >= 20 || Math.abs(lineStart.y - lineEnd.y) >= 20) {
                onLinesChange(prevLines => [...prevLines, [lineStart, lineEnd]]);
                onDirectionsChange(prevDirecs => [...prevDirecs, [arrowStart, arrowEnd]]);
                tempLineRef.current = null;
            }
            setStartPos(null)
            setIsDrawing(false);
        } else {
            setStartPos({ x, y });
            setIsDrawing(true);
        }
    }
};

// function handleMouseMoveLCD - thao tác di chuyển chuột sau khi click lần đầu
export const handleMouseMoveLCD = (e, isDrawing, canvasRef, startPos, lines, tempLineRef, directions) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    tempLineRef.current = [{ x: startPos.x, y: startPos.y }, { x: x, y: y }];
    ctx.strokeStyle = 'yellow';
    redrawCanvas(canvas, lines, tempLineRef.current, directions, canvasRef);
};

export const handleTouchMoveLCD = (e: React.TouchEvent<HTMLCanvasElement>, isDrawing, canvasRef, startPos, lines, tempLineRef, directions) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    if (e.touches.length > 0) {
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;

        tempLineRef.current = [{ x: startPos.x, y: startPos.y }, { x: x, y: y }];
        ctx.strokeStyle = 'yellow';
        redrawCanvas(canvas, lines, tempLineRef.current, directions, canvasRef);
    }
};

// function handleMouseUp - thao tác nhả chuột kết thúc đường line
export const handleMouseUp = (e, lines, startPos, canvasRef, onDirectionsChange, onLinesChange, 
    MAX_LINES, tempLineRef, setStartPos, isDrawing) => {
    if (!isDrawing || lines.length >= MAX_LINES) {
        return;
    }

    const endX = e.clientX;
    const endY = e.clientY;
    const canvas = canvasRef.current;
    if (canvas) {
        const rect = canvas.getBoundingClientRect();
        // Chuyển đổi tọa độ chuột sang tọa độ canvas
        const canvasEndX = endX - rect.left;
        const canvasEndY = endY - rect.top;

        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        const perp = directionOfArrow(startPos.x, startPos.y, canvasEndX, canvasEndY);
            
        // Quy đổi 1 cm sang pixel (giả định DPI = 96)
        const lengthPx = 30;

        // Tính trung điểm
        const midX = (startPos.x + canvasEndX) / 2;
        const midY = (startPos.y + canvasEndY) / 2;

        const middle = calMiddle(midX, midY, perp, lengthPx);

        const { lineStart, lineEnd, arrowStart, arrowEnd } = getLineAndArrowPoints(
        startPos.x, startPos.y,
        canvasEndX, canvasEndY,
        midX, midY,
        middle.arrowEndX, middle.arrowEndY,
        canvasRef
        );

        if (Math.abs(lineStart.x - lineEnd.x) >= 20 || Math.abs(lineStart.y - lineEnd.y) >= 20) {
            onLinesChange(prevLines => [...prevLines, [lineStart, lineEnd]]);
            onDirectionsChange(prevDirecs => [...prevDirecs, [arrowStart, arrowEnd]]);
            tempLineRef.current = null;
        }
    }
    setStartPos(null)
};

export const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>, lines, startPos, canvasRef, onDirectionsChange, 
    onLinesChange, MAX_LINES, tempLineRef, setStartPos, isDrawing) => {
    if (!isDrawing || lines.length >= MAX_LINES) {
        return;
    }
    if (e.changedTouches.length > 0) {
        let endX = e.changedTouches[0].clientX;
        let endY = e.changedTouches[0].clientY;
        const canvas = canvasRef.current;
        if (canvas) {
            const rect = canvas.getBoundingClientRect();
            // Chuyển đổi tọa độ chuột sang tọa độ canvas
            let canvasEndX = endX - rect.left;
            let canvasEndY = endY - rect.top;
            canvasEndX = Math.max(0, Math.min(canvasEndX, rect.width - 1));
            canvasEndY = Math.max(0, Math.min(canvasEndY, rect.height - 1));

            const ctx = canvas?.getContext('2d');
            if (!ctx || !canvas) return;

            const perp = directionOfArrow(startPos.x, startPos.y, canvasEndX, canvasEndY);
                
            // Quy đổi 1 cm sang pixel (giả định DPI = 96)
            const lengthPx = 30;

            // Tính trung điểm
            const midX = (startPos.x + canvasEndX) / 2;
            const midY = (startPos.y + canvasEndY) / 2;

            const middle = calMiddle(midX, midY, perp, lengthPx);

            const { lineStart, lineEnd, arrowStart, arrowEnd } = getLineAndArrowPoints(
            startPos.x, startPos.y,
            canvasEndX, canvasEndY,
            midX, midY,
            middle.arrowEndX, middle.arrowEndY,
            canvasRef
            );

            if (Math.abs(lineStart.x - lineEnd.x) >= 20 || Math.abs(lineStart.y - lineEnd.y) >= 20) {
                onLinesChange(prevLines => [...prevLines, [lineStart, lineEnd]]);
                onDirectionsChange(prevDirecs => [...prevDirecs, [arrowStart, arrowEnd]]);
                tempLineRef.current = null;
            }
        }
    } 
    setStartPos(null)
};

function redrawCanvas(canvas, lines, tempLine, directions, canvasRef) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let perpX = 0;
    let perpY = 0;
    
    lines?.forEach((line, index) => {
        const lineStart = convertResolutionToCanvas(line[0]['x'], line[0]['y'], canvasRef.current.clientWidth, canvasRef.current.clientHeight);
        const lineEnd = convertResolutionToCanvas(line[1]['x'], line[1]['y'], canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    
        // Tính hướng vuông góc
        const perp = directionOfArrow(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y);
        perpX = perp.perpX;
        perpY = perp.perpY;
    
        drawLine(ctx, lineStart.x, lineStart.y, lineEnd.x, lineEnd.y);
    
        if (line[0]['x'] == line[1]['x']) {
            return
        }
        drawSquare(ctx, lineStart);
        ctx.fillStyle = "#1b937d";
        ctx.font = "bold 16px Arial";
        ctx.fillText(`${index + 1}`, lineStart.x + 5, lineStart.y - 5);
    });

    if (directions) {
        directions?.forEach((direction) => {
        if (direction.length) {
            const arrowStart = convertResolutionToCanvas(direction[0]['x'], direction[0]['y'], canvasRef.current.clientWidth, canvasRef.current.clientHeight);
            const arrowEnd = convertResolutionToCanvas(direction[1]['x'], direction[1]['y'], canvasRef.current.clientWidth, canvasRef.current.clientHeight);
            const lengthPx = 30;
            drawDirection(ctx, arrowStart.x, arrowStart.y, arrowEnd.x, arrowEnd.y);
            drawFromAToB(ctx, arrowStart.x, arrowStart.y, perpX, perpY, lengthPx, arrowEnd.x, arrowEnd.y);
        }        
        });
    }
    if (tempLine) {
        drawLine(ctx, tempLine[0].x, tempLine[0].y, tempLine[1].x, tempLine[1].y);
    }
}

// getLineAndArrowPoints - lấy tọa độ các điểm đường thẳng và mũi tên vuông góc
export const getLineAndArrowPoints = (startX, startY, endX, endY, midX, midY, arrowEndX, arrowEndY, canvasRef) => {
    const lineStart = convertCanvasToResolution(startX, startY, canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    const lineEnd = convertCanvasToResolution(endX, endY, canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    const arrowStart = convertCanvasToResolution(midX, midY, canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    const arrowEnd = convertCanvasToResolution(arrowEndX, arrowEndY, canvasRef.current.clientWidth, canvasRef.current.clientHeight);

    return {
        lineStart: lineStart,
        lineEnd: lineEnd,
        arrowStart: arrowStart,
        arrowEnd: arrowEnd,
    };
};

// convertCanvasToResolution - chuyển đổi từ tọa độ ô khung canvas (640x480) sang độ phân giải video (1280x720)
export const convertCanvasToResolution = (x, y, clientWidth, clientHeight) => {
    // Tính tỷ lệ
    const xScale = 1280 / clientWidth;
    const yScale = 720 / clientHeight;

    // Quy đổi tọa độ
    const newX = x * xScale;
    const newY = y * yScale;

    return { x: Math.floor(newX), y: Math.floor(newY) };
};

// convertResolutionToCanvas - chuyển đổi từ độ phân giải video (1280x720) sang tọa độ ô khung canvas (640x480)
export const convertResolutionToCanvas = (x, y, clientWidth, clientHeight) => {
    // Tính tỷ lệ
    const xScale = clientWidth / 1280;
    const yScale = clientHeight / 720;

    // Quy đổi tọa độ
    const newX = x * xScale;
    const newY = y * yScale;

    return { x: Math.floor(newX), y: Math.floor(newY) };
};
