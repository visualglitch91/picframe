export default function cropAndPadImage(
  inputImage: HTMLImageElement,
  cropParams: { top: number; left: number; width: number; height: number },
  paddingParams: { top: number; bottom: number; left: number; right: number },
  { minWidth, maxWidth }: { minWidth: number; maxWidth: number }
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    // Crop the image
    canvas.width = cropParams.width + paddingParams.left + paddingParams.right;
    canvas.height =
      cropParams.height + paddingParams.top + paddingParams.bottom;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      inputImage,
      cropParams.left,
      cropParams.top,
      cropParams.width,
      cropParams.height,
      paddingParams.left,
      paddingParams.top,
      cropParams.width,
      cropParams.height
    );

    // Resize the image to final dimensions
    const aspectRatio = canvas.width / canvas.height;
    const finalWidth = Math.min(Math.max(minWidth, canvas.width), maxWidth);
    const finalHeight = Math.round(finalWidth / aspectRatio);

    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = finalWidth;
    finalCanvas.height = finalHeight;

    const finalCtx = finalCanvas.getContext("2d")!;

    finalCtx.drawImage(canvas, 0, 0, finalWidth, finalHeight);

    // Convert the canvas to a JPEG image
    finalCanvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject()),
      "image/jpeg",
      0.8
    );
  });
}
