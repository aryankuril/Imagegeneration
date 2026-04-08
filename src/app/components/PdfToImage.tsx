"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";


// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface ConversionOptions {
  format: "png" | "jpeg";
  quality: number;
  dpi: number;
}

export default function PdfToImage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
const [previewImages, setPreviewImages] = useState<string[]>([]);
const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
const [showThumbnails] = useState(true);
  const [options, setOptions] = useState<ConversionOptions>({
    format: "png",
    quality: 0.8,
    dpi: 300,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const pdfFiles = Array.from(e.target.files).filter(file => 
        file.type === "application/pdf"
      );
      setFiles(pdfFiles);
    }
  };

  const dropHandler = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const pdfFiles = Array.from(e.dataTransfer.files).filter(file => 
        file.type === "application/pdf"
      );
      setFiles(pdfFiles);
    }
  };

  const dragOverHandler = (e: React.DragEvent) => {
    e.preventDefault();
  };

const convertPdfToImages = async () => {
  if (files.length === 0) return;

  setIsProcessing(true);
  setProgress(0);

  const previews: string[] = [];

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const arrayBuffer = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
        cMapUrl: "https://unpkg.com/pdfjs-dist@3.11.174/cmaps/",
        cMapPacked: true
      }).promise;

      for (let j = 1; j <= pdf.numPages; j++) {
        const page = await pdf.getPage(j);
        const viewport = page.getViewport({ scale: options.dpi / 72 });

        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext("2d")!;

        await page.render({
          canvasContext: ctx,
          viewport: viewport,
        }).promise;

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error("Blob failed"));
            },
            `image/${options.format}`,
            options.quality
          );
        });

        const url = URL.createObjectURL(blob);
        previews.push(url);
      }

      setProgress(((i + 1) / files.length) * 100);
    }

    setPreviewImages(previews);
    setPreviewOpen(true); // 👈 OPEN POPUP
  } catch (error) {
    alert(`Error: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    setIsProcessing(false);
    setProgress(0);
  }
};


const handleDownload = async () => {
  const zip = new JSZip();
  const folder = zip.folder("pdf-images");

  let index = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    for (let j = 1; j <= pdf.numPages; j++) {
      const page = await pdf.getPage(j);
      const viewport = page.getViewport({ scale: options.dpi / 72 });

      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const ctx = canvas.getContext("2d")!;

      await page.render({ canvasContext: ctx, viewport }).promise;

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b as Blob), `image/${options.format}`, options.quality);
      });

      const name = `${file.name.replace(".pdf", "")}_page${j}.${options.format}`;
      folder?.file(name, blob);

      index++;
    }
  }

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "pdf-images.zip");

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
            PDF to Image Converter
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
              accept=".pdf"
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
            or drag and drop your PDF files here
            {files.length > 0 && (
              <p className="mt-2 text-sm text-muted-foreground">
                {files.length} PDF file(s) selected
              </p>
            )}
          </div>

          {files.length > 0 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Output Format</Label>
                  <div className="flex space-x-4">
                    <Button
                      variant={options.format === "jpeg" ? "default" : "outline"}
                      onClick={() => setOptions(prev => ({ ...prev, format: "jpeg" }))}
                    >
                      JPEG
                    </Button>
                    <Button
                      variant={options.format === "png" ? "default" : "outline"}
                      onClick={() => setOptions(prev => ({ ...prev, format: "png" }))}
                    >
                      PNG
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Quality ({Math.round(options.quality * 100)}%)</Label>
                  <Slider
                    value={[options.quality]}
                    min={0}
                    max={1}
                    step={0.1}
                    onValueChange={([value]) =>
                      setOptions(prev => ({ ...prev, quality: value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>DPI (Resolution)</Label>
                  <div className="flex space-x-4">
                    {[72, 150, 300, 600].map(dpi => (
                      <Button
                        key={dpi}
                        variant={options.dpi === dpi ? "default" : "outline"}
                        onClick={() => setOptions(prev => ({ ...prev, dpi }))}
                      >
                        {dpi}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={convertPdfToImages}
                disabled={isProcessing}
              >
                {isProcessing ? `Converting... ${Math.round(progress)}%` : "Convert to Images"}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                Note: Each page of the PDF will be converted to a separate image file.
              </p>
            </div>
          )}
        </CardContent>


        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
  <DialogContent className="max-w-4xl bg-white">
    <DialogHeader>
      <DialogTitle>Preview Results</DialogTitle>
      <DialogDescription>
        Preview converted images before downloading.
      </DialogDescription>
    </DialogHeader>

    <div className="space-y-4">
      <div className="relative aspect-video bg-black rounded-[15px] overflow-hidden">
        {previewImages.length > 0 && (
          <img
            src={previewImages[currentPreviewIndex]}
            className="object-contain w-full h-full"
          />
        )}

        {previewImages.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2"
              onClick={() =>
                setCurrentPreviewIndex((prev) =>
                  prev > 0 ? prev - 1 : previewImages.length - 1
                )
              }
            >
              ‹
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() =>
                setCurrentPreviewIndex((prev) =>
                  prev < previewImages.length - 1 ? prev + 1 : 0
                )
              }
            >
              ›
            </Button>
          </>
        )}
      </div>

      <DialogFooter className="flex justify-between">
        <Button variant="outline" onClick={handleClosePreview}>
          Cancel
        </Button>

        <Button onClick={handleDownload}>
          Download All
        </Button>
      </DialogFooter>
    </div>
  </DialogContent>
</Dialog>
      </Card>
    </div>
  );
} 