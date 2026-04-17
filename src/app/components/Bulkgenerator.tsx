"use client";

import { useState } from "react";
import Button from "./Button";

const Bulkgenerator = () => {
  const [sheetUrl, setSheetUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async () => {
  if (!sheetUrl) {
    alert("Enter Google Sheet URL");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_SHEET_API_URL as string,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sheet_url: sheetUrl,
        }),
      }
    );

    await res.text();

    // ✅ SHOW POPUP
    setShowPopup(true);

    // ✅ REDIRECT AFTER 3 SECONDS
    setTimeout(() => {
      window.location.href =
        process.env.NEXT_PUBLIC_REDIRECT_DRIVE_URL as string;
    }, 3000);

  } catch (err) {
    console.error(err);
    alert("Error connecting to n8n");
  }

  setLoading(false);
};

  return (
    <div className="p-5 min-h-screen text-white flex items-center justify-center relative">
      
      <div className="bg-[#1D1D1D] rounded-[20px] relative overflow-hidden max-w-lg w-full">
        <div className="relative z-10 py-10 p-7">
          
          <h3 className="font-bold mb-6">
            AI Image Generator
          </h3>

          <input
            type="text"
            placeholder="Paste Google Sheet URL..."
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
            className="w-full p-3 mb-4 rounded-lg bg-zinc-800 border border-zinc-700 outline-none"
          />

          <div className="flex items-center">
            <Button
              onClick={handleSubmit}
              text={loading ? "Generating..." : "Generate Images"}
              className="text-white"
            />
          </div>

          <div className="absolute right-0 top-0 h-full w-3 candy-border"></div>
        </div>
      </div>


  

      {/* ✅ POPUP */}
    {showPopup && (
         <div className=" p-5 fixed inset-0 bg-black/60 flex items-center justify-center z-[200]">
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
};

export default Bulkgenerator;