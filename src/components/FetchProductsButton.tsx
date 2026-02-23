import { useState } from "react";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
import JSZip from "jszip";

interface FetchProductsButtonProps {
  apiKey: string;
  storeLink: string;
}
// 
export default function FetchProductsButton({
  apiKey,
  storeLink,
}: FetchProductsButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [filterZeroMedia, setFilterZeroMedia] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      const response = await fetch("/api/fetch-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          store: storeLink,
          apiKey: apiKey,
          filterZeroMedia,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.products.length === 0) {
        setInfoMessage(
          filterZeroMedia
            ? "There are no products with zero media."
            : "No products found."
        );
        return;
      }

      // Create and download an empty folder structure as a ZIP file
      createEmptyFolders(data.products);
    } catch (err) {
      setError(`Error: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const createEmptyFolders = (products: { title: string; id: string }[]) => {
    const zip = new JSZip(); // Create a new zip instance

    products.forEach((product) => {
      // Create a folder for each product
      const folderName = `${product.title.replace(/[^a-zA-Z0-9]/g, "_")}`;

      // Create an empty text file within each folder to simulate folder creation
      const folder = zip.folder(folderName);
      if (folder) {
        folder.file(
          `${folderName}/README.txt`,
          "This is an empty folder for product."
        );
      }
    });

    // Generate the ZIP file and trigger download
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "products_folders.zip");
    });
  };

  return (
    <div>
      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={filterZeroMedia}
            onChange={(e) => setFilterZeroMedia(e.target.checked)}
            className="form-checkbox"
          />
          <span>Only Products with Zero Media</span>
        </label>
      </div>
      <Button
        onClick={fetchProducts}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        {loading ? "Loading..." : "Fetch Products"}
      </Button>

      {error && (
        <div className="text-red-500 mt-2">
          <p>{error}</p>
        </div>
      )}

      {infoMessage && (
        <div className="text-blue-500 mt-2">
          <p>{infoMessage}</p>
        </div>
      )}
    </div>
  );
}
