import { useEffect, useRef } from "react";

export function useOnDraw(onDraw) {

  const canvasRef = useRef(null);

  const isDrawingRef = useRef(false);

  const mouseMoveListenerRef = useRef(null);
  const mouseUpListenerRef = useRef(null);
  const mouseDownListenerRef = useRef(null);

  const prevPointRef = useRef(null);

  useEffect(() => {
    return () => {
      if (mouseMoveListenerRef.current) {
        window.removeEventListener("mousemove", mouseUpListenerRef);
      }

      if (mouseUpListenerRef.current) {
        window.removeEventListener("mouseup", mouseMoveListenerRef.current);
      }
    }
  }, [])

  function setCanvasRef(ref) {
    if (!ref) return;
    if (canvasRef.current) canvasRef.current.removeEventListener("mousedown", mouseDownListenerRef);
    canvasRef.current = ref;
    initMouseMoveListener();
    initMouseDownListener();
    initMouseUpListener();
  }

  function initMouseMoveListener() {
    const mouseMoveListener = (e) => {
      if (isDrawingRef.current) {
        const point = pointRelativeToCanvas(e.clientX, e.clientY);
        const context = canvasRef.current.getContext('2d');
        if (onDraw) onDraw(context, point, prevPointRef.current);
        prevPointRef.current = point;
        //console.log(point);
      }
    }
    mouseMoveListenerRef.current = mouseMoveListener;
    window.addEventListener("mousemove", mouseMoveListener);
  }

  function initMouseDownListener() {
    if (!canvasRef.current) return;
    const listener = () => {
      isDrawingRef.current = true;
    }
    mouseDownListenerRef.current = listener;
    canvasRef.current.addEventListener("mousedown", listener)
  }

  function initMouseUpListener() {
    const listener = () => {
      isDrawingRef.current = false;
      prevPointRef.current = null;
    }
    mouseUpListenerRef.current = listener;
    window.addEventListener("mouseup", listener);
  }

  function pointRelativeToCanvas(clientX, clientY) {
    if (canvasRef.current) {
      const bounds = canvasRef.current.getBoundingClientRect();
      const canvasX = clientX - bounds.left;
      const canvasY = clientY - bounds.top;


      const canvasWidth = canvasRef.current.width;
      const canvasHeight = canvasRef.current.height;

      // Adjusting position of x and y depending on canvas size
      return {
        x: (canvasX / bounds.width) * canvasWidth,
        y: (canvasY / bounds.height) * canvasHeight
      }
    }
    return null
  }

  return { setCanvasRef, canvasRef };
}