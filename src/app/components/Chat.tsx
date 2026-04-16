"use client";

import { useState } from "react";
import Button from "./Button";

export default function Chat() {
  const [description, setDescription] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [aspectRatio, setAspectRatio] = useState("auto");
  const [variation, setVariation] = useState(1); // ✅ NEW
  const [loading, setLoading] = useState(false);

  const CHAT_API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL!;

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productImage) {
      alert("Please upload product image");
      return;
    }

    if (!aspectRatio) {
      alert("Please select aspect ratio");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("Edit_Description", description);
      formData.append("Image", productImage);
      formData.append("Aspect_Ratio", aspectRatio);
      formData.append("variation", String(variation)); // ✅ NEW

      if (referenceImage) {
        formData.append("ReferenceImage", referenceImage);
      }

      const res = await fetch(CHAT_API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Response:", data);

      alert("Submitted successfully!");
    } catch (error) {
      console.error(error);
      alert("Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Variation handlers
  const increase = () => setVariation((prev) => Math.min(prev + 1, 10));
  const decrease = () => setVariation((prev) => Math.max(prev - 1, 1));

  return (
     <div className=" p-5 min-h-screen text-white flex items-center justify-center relative">
      
      <div className="bg-[#1D1D1D] rounded-[20px] relative overflow-hidden w-full max-w-lg">
      <form
        onSubmit={handleSubmit}
        className=" p-6 rounded-2xl shadow-lg w-full max-w-lg space-y-4"
      >
        <h2 className="text-xl font-semibold text-center text-white">
          Edit Image (Nano Banana)
        </h2>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1 text-white">
            Edit_Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description..."
             className="w-full p-3 mb-4 rounded-lg bg-zinc-800 border border-zinc-700 outline-none"
          />
        </div>

        {/* Product Image */}
        <div>
          <label className="block text-sm font-medium mb-1 text-white">
            Product Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setProductImage(e.target.files ? e.target.files[0] : null)
            }
            className="w-full text-white"
          />
        </div>

        {/* Reference Image */}
        <div>
          <label className="block text-sm font-medium mb-1 text-white">
            Reference Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setReferenceImage(e.target.files ? e.target.files[0] : null)
            }
            className="w-full text-white "
          />
        </div>

        {/* Aspect Ratio */}
        <div>
          <label className="block text-sm font-medium mb-1 text-white">
            Aspect Ratio
          </label>
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            
            className="w-full p-3 mb-4 rounded-lg bg-zinc-800 border border-zinc-700 outline-none  px-3 py-2 focus:outline-none text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="auto">Auto</option>
            <option value="1:1">1:1</option>
            <option value="3:4">3:4</option>
            <option value="4:3">4:3</option>
            <option value="2:3">2:3</option>
            <option value="3:2">3:2</option>
            <option value="9:16">9:16</option>
            <option value="16:9">16:9</option>
            <option value="5:4">5:4</option>
            <option value="4:5">4:5</option>
            <option value="21:9">21:9</option>
          </select>
        </div>

        {/* ✅ Variation Selector */}
        <div>
          <label className="block text-sm font-medium mb-1 text-white">
            Variations
          </label>
          <div className="flex items-center justify-between border rounded-lg px-4 py-2">
            <button
              type="button"
              onClick={decrease}
              className="text-lg font-bold px-3 text-white"
            >
              -
            </button>

            <span className="font-medium text-white">{variation}</span>

            <button
              type="button"
              onClick={increase}
              className="text-lg font-bold px-3 text-white"
            >
              +
            </button>
          </div>
        </div>

        {/* Submit */}


          <div className="flex items-center">
            <Button
              type="submit"
          disabled={loading}
              text={loading ? "Processing..." : "Submit"}
              className="text-white"
            />
          </div>
        {/* <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Processing..." : "Submit"}
        </button> */}
      </form>
       <div className="absolute right-0 top-0 h-full w-3 candy-border"></div>
    </div>
    </div>
  );
}