"use client";

import { useState } from "react";
import Button from "./Button";

export default function Chat() {
  const [description, setDescription] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [aspectRatio, setAspectRatio] = useState("auto");
  const [variation, setVariation] = useState(1);
  const [loading, setLoading] = useState(false);

  // ✅ NEW (same as bulk)
  const [showPopup, setShowPopup] = useState(false);

  const CHAT_API_URL =
    "https://imggenerationn.app.n8n.cloud/webhook-test/c554ca4f-1160-467a-aad4-2a2638f646f2";

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
      formData.append("variation", String(variation));

      if (referenceImage) {
        formData.append("ReferenceImage", referenceImage);
      }

      const res = await fetch(CHAT_API_URL, {
        method: "POST",
        body: formData,
      });

      // ❌ ERROR CHECK (you didn’t have this)
      if (!res.ok) {
        throw new Error("Request failed");
      }

      await res.json();

      // ✅ SHOW POPUP (same as bulk)
      setShowPopup(true);

      // ✅ REDIRECT AFTER 3 SECONDS
      setTimeout(() => {
        window.location.href =
          process.env.NEXT_PUBLIC_REDIRECT_DRIVE_URL as string;
      }, 3000);
    } catch (error) {
      console.error(error);
      alert("Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  const increase = () => setVariation((prev) => Math.min(prev + 1, 10));
  const decrease = () => setVariation((prev) => Math.max(prev - 1, 1));

  return (
    <div className="p-5 min-h-screen text-white flex items-center justify-center relative">
      <div className="bg-[#1D1D1D] rounded-[20px] relative overflow-hidden w-full max-w-lg">
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-2xl shadow-lg w-full max-w-lg space-y-4"
        >
           <h3 className="font-bold mb-6 text-white">
            Image Generator
          </h3>

          <div>
            <label className="block text-sm font-medium mb-1 text-white">
              Edit Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description..."
              className="w-full p-3 mb-4 rounded-lg bg-zinc-800 border border-zinc-700 outline-none"
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium mb-1 text-white">
              Aspect Ratio
            </label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg bg-zinc-800 border border-zinc-700 outline-none px-3 py-2 text-white"
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

          <div className="flex items-center">
            <Button
              type="submit"
              disabled={loading}
              text={loading ? "Generating..." : "Generate Images"}
              className="text-white"
            />
          </div>
        </form>

        <div className="absolute right-0 top-0 h-full w-3 candy-border"></div>
      </div>

      {/* ✅ POPUP (same as bulk) */}
      {showPopup && (
        <div className="p-5 fixed inset-0 bg-black/60 flex items-center justify-center z-[200]">
          <div className="bg-[#1D1D1D] rounded-[20px] relative overflow-hidden max-w-lg w-full">
            <div className="relative z-10 py-10 p-7">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 leading-snug">
                ✅ Request Sent Successfully
              </h3>
              <p className="text-sm">
                Wait few minutes till the image is rendered.
              </p>

              <div className="absolute right-0 top-0 h-full w-3 candy-border"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}