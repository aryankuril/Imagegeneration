"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageEffects, Filter } from "@/components/ui/image-effects";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Effects() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
const [previewImages, setPreviewImages] = useState<string[]>([]);
const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
const [showThumbnails] = useState(true);
  const [currentEffects, setCurrentEffects] = useState<{
    rotation: number;
    filter: Filter;
    filterValue: number;
  }>({
    rotation: 0,
    filter: "none",
    filterValue: 50,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const dropHandler = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const dragOverHandler = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const applyEffects = async (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d")!;

          // Set canvas size
          canvas.width = img.width;
          canvas.height = img.height;

          // Apply rotation
          if (currentEffects.rotation !== 0) {
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((currentEffects.rotation * Math.PI) / 180);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
          }

          // Draw image
          ctx.drawImage(img, 0, 0);

          // Apply filters
          if (currentEffects.filter !== "none") {
            const value = currentEffects.filterValue / 100;
            switch (currentEffects.filter) {
              case "grayscale":
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                for (let i = 0; i < data.length; i += 4) {
                  const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                  data[i] = data[i + 1] = data[i + 2] = avg;
                }
                ctx.putImageData(imageData, 0, 0);
                break;
              case "sepia":
                ctx.filter = `sepia(${value})`;
                ctx.drawImage(img, 0, 0);
                break;
              case "blur":
                ctx.filter = `blur(${value * 10}px)`;
                ctx.drawImage(img, 0, 0);
                break;
              case "brightness":
                ctx.filter = `brightness(${value * 2})`;
                ctx.drawImage(img, 0, 0);
                break;
              case "contrast":
                ctx.filter = `contrast(${value * 2}%)`;
                ctx.drawImage(img, 0, 0);
                break;
            }
          }

          canvas.toBlob(
            (blob) => {
              resolve(blob as Blob);
            },
            "image/jpeg",
            0.9
          );
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const processImages = async () => {
  if (files.length === 0) return;

  setIsProcessing(true);
  const previews: string[] = [];

  try {
    for (const file of files) {
      const processedBlob = await applyEffects(file);
      const url = URL.createObjectURL(processedBlob);
      previews.push(url);
    }

    setPreviewImages(previews);
    setPreviewOpen(true); // 👈 OPEN POPUP HERE
  } catch (error) {
    console.error("Error processing images:", error);
  } finally {
    setIsProcessing(false);
  }
};


const handleDownload = async () => {
  const zip = new JSZip();
  const folder = zip.folder("effects-applied");

  for (let i = 0; i < files.length; i++) {
    const blob = await applyEffects(files[i]);
    folder?.file(files[i].name, blob);
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "effects-applied.zip");

  setPreviewOpen(false);
};


const handleClosePreview = () => {
  setPreviewOpen(false);
};

  return (
   <div className="min-h-[calc(100vh-160px)] flex justify-center px-6 lg:pt-40  pt-0">
       <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Image Effects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center mb-4"
            onDrop={dropHandler}
            onDragOver={dragOverHandler}
          >
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="cursor-pointer text-primary hover:text-primary/80"
            >
              Click to upload
            </label>{" "}
            or drag and drop your images here
            {files.length > 0 && (
              <p className="mt-2 text-sm text-muted-foreground">
                {files.length} file(s) selected
              </p>
            )}
          </div>

          {files.length > 0 && (
            <div className="space-y-6">
              <ImageEffects
                currentRotation={currentEffects.rotation}
                currentFilter={currentEffects.filter}
                currentFilterValue={currentEffects.filterValue}
                onRotate={(degrees) =>
                  setCurrentEffects((prev) => ({ ...prev, rotation: degrees }))
                }
                onFilterChange={(filter, value) =>
                  setCurrentEffects((prev) => ({
                    ...prev,
                    filter,
                    filterValue: value,
                  }))
                }
              />

              <Button
                className="w-full"
                onClick={processImages}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Apply Effects"}
              </Button>
            </div>
          )}
        </CardContent>

         <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
           <DialogContent
  className="max-w-4xl bg-white"
  onPointerDownOutside={(e) => e.preventDefault()}
  onEscapeKeyDown={(e) => e.preventDefault()} 
>
            <DialogHeader>
  <DialogTitle>Preview Results</DialogTitle>
  <DialogDescription>
    Preview image before downloading.
  </DialogDescription>
</DialogHeader>
              
              <div className="space-y-4">
                <div className="relative aspect-video bg-black rounded-[15px] overflow-hidden">
                  {previewImages.length > 0 && (
                    <Image
                      src={previewImages[currentPreviewIndex]}
                      alt={`Preview ${currentPreviewIndex + 1}`}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  )}
                  
                  {previewImages.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2"
                        onClick={() => setCurrentPreviewIndex((prev) => 
                          prev > 0 ? prev - 1 : previewImages.length - 1
                        )}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setCurrentPreviewIndex((prev) => 
                          prev < previewImages.length - 1 ? prev + 1 : 0
                        )}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
    
                {showThumbnails && previewImages.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {previewImages.map((preview, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPreviewIndex(index)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                          index === currentPreviewIndex ? "ring-2 ring-primary" : ""
                        }`}
                      >
                        <Image
                          src={preview}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </button>
                    ))}
                  </div>
                )}
    
                <div className="text-center text-sm text-muted-foreground">
                  {previewImages.length > 1 && (
                    <p>Image {currentPreviewIndex + 1} of {Math.min(files.length, 5)}</p>
                  )}
                  {files.length > 5 && (
                    <p className="mt-1">Showing first 5 images of {files.length} total</p>
                  )}
                </div>
              </div>
    
              <DialogFooter className="flex justify-between ">
                <div className="flex items-center space-x-2  ">
                 <Button 
  type="button"
  variant="outline" 
  onClick={handleClosePreview}
>
  Cancel
</Button>

{/* <Button
  type="button"
  variant="outline"
  size="icon"
  onClick={handleRotate}
  title="Rotate Image"
>
  <RotateCw className="h-4 w-4" />
</Button> */}

      </div>
                <Button
  type="button"
  onClick={handleDownload}
>
  Download 
</Button>
           
              </DialogFooter>
            </DialogContent>
          </Dialog>
      </Card>
    </div>
  );
} 