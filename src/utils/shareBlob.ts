export default function shareBlob(blob: Blob, fileName: string) {
  if (navigator.share) {
    const file = new File([blob], fileName, { type: "image/jpeg" });

    navigator
      .share({ files: [file] })
      .then(() => console.log("Image shared successfully"))
      .catch((error) => {
        console.error("Error sharing image:", error);
      });
  } else {
    console.error("Native sharing not supported or no valid Blob provided.");
  }
}
