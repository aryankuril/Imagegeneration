self.onmessage = async (event) => {
  const file = event.data.file;

  // Check if the file is already in WebP format
  const isWebp = file.type === "image/webp";

  if (!isWebp) {
    // Convert to WebP format using createImageBitmap
    const imageBitmap = await loadImage(file);
    const webpBlob = await convertToWebp(imageBitmap);

    // Compress the WebP image if it's larger than 2MB
    const compressedBlob = await compressImage(webpBlob);

    // Send the processed file back to the main thread
    self.postMessage({ file: compressedBlob });
  } else {
    // If the file is already WebP, send it back without conversion
    self.postMessage({ file });
  }
};

// Load the image using createImageBitmap
async function loadImage(file: Blob): Promise<ImageBitmap> {
  return createImageBitmap(file);
}

// Convert image to WebP format using OffscreenCanvas
async function convertToWebp(imageBitmap: ImageBitmap): Promise<Blob> {
  const offscreenCanvas = new OffscreenCanvas(
    imageBitmap.width,
    imageBitmap.height
  );
  const ctx = offscreenCanvas.getContext("2d");
  ctx?.drawImage(imageBitmap, 0, 0);

  return new Promise((resolve) => {
    offscreenCanvas
      .convertToBlob({ type: "image/webp", quality: 0.8 })
      .then((blob) => resolve(blob));
  });
}

// Compress the image if it's larger than 2MB
async function compressImage(blob: Blob): Promise<Blob> {
  const MAX_SIZE = 2 * 1024 * 1024; // 2MB
  if (blob.size <= MAX_SIZE) return blob;

  const imageBitmap = await loadImage(blob as File);
  const offscreenCanvas = new OffscreenCanvas(
    imageBitmap.width,
    imageBitmap.height
  );
  const ctx = offscreenCanvas.getContext("2d");
  ctx?.drawImage(imageBitmap, 0, 0);

  return new Promise((resolve) => {
    offscreenCanvas
      .convertToBlob({ type: "image/webp", quality: 0.6 })
      .then((compressedBlob) => resolve(compressedBlob));
  });
}
