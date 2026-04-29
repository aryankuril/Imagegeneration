"use client";

import { useState } from "react";
import Button from "./Button";
import { Download } from "lucide-react";


export default function Chat() {
  const [description, setDescription] = useState("");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [aspectRatio, setAspectRatio] = useState("auto");
  const [variation, setVariation] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [copyMode, setCopyMode] = useState<"none" | "default" | "custom">("none");
  
const [customCopy, setCustomCopy] = useState({
  title: "",
  description: "",
  price: "",
  cta: "",
});

const [showCopyPopup, setShowCopyPopup] = useState(false);

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

      formData.append("copyMode", copyMode);

if (copyMode === "custom") {
  formData.append("title", customCopy.title);
  formData.append("descriptionCopy", customCopy.description);
  formData.append("price", customCopy.price);
  formData.append("cta", customCopy.cta);
}

      const res = await fetch(CHAT_API_URL, {
        method: "POST",
        body: formData,
      });

      // ❌ ERROR CHECK (you didn’t have this)
      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();

console.log(data); // check first

      // ✅ SHOW POPUP (same as bulk)

      if (Array.isArray(data)) {
  const imgs = data.map((item) => item.image);
  setGeneratedImages((prev) => [...imgs, ...prev]); // 🔥 new first
} else if (data.images) {
  setGeneratedImages((prev) => [...data.images, ...prev]); // 🔥 new first
} else if (data.image) {
  setGeneratedImages((prev) => [data.image, ...prev]); // 🔥 new first
}
      setShowPopup(true);

      // ✅ REDIRECT AFTER 3 SECONDS
      // setTimeout(() => {
      //   window.location.href =
      //     process.env.NEXT_PUBLIC_REDIRECT_DRIVE_URL as string;
      // }, 3000);
    } catch (error) {
      console.error(error);
      alert("Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  const increase = () => setVariation((prev) => Math.min(prev + 1, 4));
  const decrease = () => setVariation((prev) => Math.max(prev - 1, 1));

  

  return (
<div className="min-h-screen text-white relative overflow-hidden pb-40">

{generatedImages.length > 0 || loading ? (

  /* 🔥 IMAGE + SKELETON STATE */
  <div className="container w-full min-h-[60vh] px-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
 {/* 🔥 SKELETON FOR NEW IMAGES */}
      {loading &&
        Array.from({ length: variation }).map((_, i) => (
          <div
            key={`skeleton-${i}`}
            className="w-full aspect-square rounded-xl 
                       bg-gray-200/60 animate-pulse"
          />
        ))}
      {/* 🔥 EXISTING IMAGES */}
      {generatedImages.map((img, i) => (
        <div key={i} className="relative group">

          <img
            src={`data:image/png;base64,${img}`}
            className="w-full h-auto object-cover rounded-xl"
          />

          {/* DOWNLOAD ICON */}
          <a
            href={`data:image/png;base64,${img}`}
            download={`image-${i}.png`}
            className="absolute top-3 right-3 
                       opacity-0 group-hover:opacity-100 
                       transition duration-300"
          >
            <div className="w-10 h-10 flex items-center justify-center 
                            rounded-full 
                            bg-black/50 backdrop-blur-md 
                            border border-white/20 
                            hover:bg-[#fab31e] hover:text-black 
                            transition shadow-lg">

              <Download size={18} />

            </div>
          </a>

        </div>
      ))}

     

    </div>
  </div>

) : (

  /* 🔥 HERO DEFAULT */
  <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center relative z-10">

    <div className="flex items-center justify-center gap-4 mb-6 relative">
      <img src="/images/brandimg1.png" className="w-28 h-28 object-cover rounded-xl rotate-[-10deg] opacity-80 border border-white/10" />
      <img src="/images/brandimg2.png" className="w-28 h-28 object-cover rounded-xl z-10 border border-white/20" />
      <img src="/images/brandimg3.png" className="w-28 h-28 object-cover rounded-xl rotate-[10deg] opacity-80 border border-white/10" />
    </div>

    <h1 className="text-4xl md:text-6xl font-bold leading-tight text-black">
      START CREATING WITH <br />
      <span className="text-highlight">BOMBAY BLOKES</span>
    </h1>

    <p className="text-black mt-2 max-w-xl">
      Describe a scene, character, mood, or style and watch it come to life
    </p>

  </div>

)}





  {/* 🔥 FLOATING INPUT BAR */}
  <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 z-50">

    <div className="bg-[#1D1D1D]/80 backdrop-blur-xl border border-white/10 rounded-[20px] w-full p-4 flex items-center gap-4 shadow-2xl">

      {/* 🔹 IMAGE UPLOADS */}
      <div className="flex gap-4">

  {/* PRODUCT IMAGE */}
  <div className="flex flex-col items-center gap-1">
    <span className="text-[10px] text-gray-400">Product</span>

    <label className="relative w-14 h-14 bg-black/40 rounded-xl flex items-center justify-center cursor-pointer overflow-visible">

      {productImage ? (
        <>
          <img
            src={URL.createObjectURL(productImage)}
            className="w-full h-full object-cover rounded-xl"
          />

          {/* ❌ HALF OUTSIDE BUTTON */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setProductImage(null);
            }}
            className="absolute -top-1 -right-1 bg-black border border-white/20 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] hover:bg-red-500 z-10"
          >
            ✕
          </button>
        </>
      ) : (
        <span className="text-lg text-white">+</span>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setProductImage(e.target.files ? e.target.files[0] : null)
        }
        className="hidden"
      />
    </label>
  </div>

  {/* REFERENCE IMAGE */}
  <div className="flex flex-col items-center gap-1">
    <span className="text-[10px] text-gray-400">Reference</span>

    <label className="relative w-14 h-14 bg-black/40 rounded-xl flex items-center justify-center cursor-pointer overflow-visible">

      {referenceImage ? (
        <>
          <img
            src={URL.createObjectURL(referenceImage)}
            className="w-full h-full object-cover rounded-xl"
          />

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setReferenceImage(null);
            }}
            className="absolute -top-1 -right-1 bg-black border border-white/20 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] hover:bg-red-500 z-10"
          >
            ✕
          </button>
        </>
      ) : (
        <span className="text-lg text-white">+</span>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setReferenceImage(e.target.files ? e.target.files[0] : null)
        }
        className="hidden"
      />
    </label>
  </div>

</div>
    {/* 🔹 INPUT + CONTROLS */}
    <div className="flex-1">

      {/* PROMPT */}
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the scene you imagine"
        className="w-full bg-transparent outline-none text-sm  text-white mb-3 placeholder-grey-400"
      />

      {/* CONTROLS */}
      <div className="flex items-center gap-3 flex-wrap">

        {/* MODEL */}
        <div className="bg-black/40 px-4 py-2 text-white rounded-xl text-sm flex items-center gap-1">
          <span className="text-highlight font-bold text-sm">G</span>
          Nano Banana Pro
        </div>

        {/* ASPECT DROPDOWN */}
        <select
          value={aspectRatio}
          onChange={(e) => setAspectRatio(e.target.value)}
          className="bg-black/40 px-3 py-2 rounded-xl text-white text-sm outline-none"
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
 

        {/* VARIATIONS */}
        <div className="bg-black/40 px-4 py-2 text-white rounded-xl text-sm flex items-center gap-3">
          <button onClick={decrease}>-</button>
          <span>{variation}</span>
          <button onClick={increase}>+</button>
        </div>


        <button
  onClick={() => setShowCopyPopup(true)}
  className="bg-black/40 px-4 py-2 rounded-xl text-sm"
>
  Copy
</button>

      </div>
    </div>

    {/* 🔹 GENERATE BUTTON */}
    {/* <button
      onClick={handleSubmit}
      disabled={loading}
      className="bg-lime-400 text-black font-semibold px-6 py-4 rounded-xl hover:opacity-90 transition"
    >
      {loading ? "Generating..." : `Generate ✨ ${variation}`}
    </button> */}

    <div className="flex items-center">
       <Button
        onClick={() => handleSubmit(new Event("submit") as any)}
        disabled={loading} 
        text={loading ? "Generating..." : "Generate Images"} 
        className="text-white" 
        /> 
       </div>
  </div>

  {/* POPUP SAME */}
  {/* {showPopup && (
    <div className="p-5 fixed inset-0 bg-black/60 flex items-center justify-center z-[200]">
      <div className="bg-[#1D1D1D] rounded-[20px] max-w-lg w-full p-7">
        <h3 className="text-xl font-semibold mb-2">
          ✅ Request Sent Successfully
        </h3>
        <p className="text-sm">
          Wait few minutes till the image is rendered.
        </p>
      </div>
    </div>
  )} */}
  </div>
  {showCopyPopup && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-[#1D1D1D] rounded-[20px] relative overflow-hidden p-6 w-[400px]">

      <h2 className="text-lg mb-4">Select Copy Mode</h2>

<div className="flex flex-col gap-3 mt-2">

  {/* NONE */}
  <button
    onClick={() => {
      setCopyMode("none");
      setShowCopyPopup(false);
    }}
    className={`text-left px-4 py-3 rounded-xl transition 
      border border-transparent
      ${copyMode === "none" 
        ? "bg-white/10 border-[#fab31e] text-white" 
        : "text-gray-300 hover:bg-white/5 hover:text-white"}
    `}
  >
    Do Not Add Copy
    <span className="block text-xs text-gray-400">
      (No Copy)
    </span>
  </button>

  {/* DEFAULT */}
  <button
    onClick={() => {
      setCopyMode("default");
      setShowCopyPopup(false);
    }}
    className={`text-left px-4 py-3 rounded-xl transition 
      border border-transparent
      ${copyMode === "default" 
        ? "bg-white/10 border-[#fab31e] text-white" 
        : "text-gray-300 hover:bg-white/5 hover:text-white"}
    `}
  >
    Default Copy
    <span className="block text-xs text-gray-400">
      (From Reference Image)
    </span>
  </button>

  {/* CUSTOM */}
  <button
    onClick={() => setCopyMode("custom")}
    className={`text-left px-4 py-3 rounded-xl transition 
      border border-transparent
      ${copyMode === "custom" 
        ? "bg-white/10 border-[#fab31e] text-white" 
        : "text-gray-300 hover:bg-white/5 hover:text-white"}
    `}
  >
    Custom Copy
    <span className="block text-xs text-gray-400">
      Add your own text
    </span>
  </button>

</div>

      {/* CUSTOM FORM */}
     {copyMode === "custom" && (
  <div className="mt-5 flex flex-col gap-3">


    

    {/* TITLE */}
    <input
      placeholder="Title (required)"
      value={customCopy.title}
      onChange={(e) =>
        setCustomCopy({ ...customCopy, title: e.target.value })
      }
      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-400 outline-none focus:border-[#fab31e]"
    />

    {/* DESCRIPTION */}
    <input
      placeholder="Description (optional)"
      value={customCopy.description}
      onChange={(e) =>
        setCustomCopy({ ...customCopy, description: e.target.value })
      }
      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-400 outline-none focus:border-[#fab31e]"
    />

    {/* PRICE + CTA ROW */}
    <div className="flex gap-2">
      <input
        placeholder="Price"
        value={customCopy.price}
        onChange={(e) =>
          setCustomCopy({ ...customCopy, price: e.target.value })
        }
        className="w-1/2 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-400 outline-none focus:border-[#fab31e]"
      />

      <input
        placeholder="CTA (e.g. Buy Now)"
        value={customCopy.cta}
        onChange={(e) =>
          setCustomCopy({ ...customCopy, cta: e.target.value })
        }
        className="w-1/2 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-400 outline-none focus:border-[#fab31e]"
      />
    </div>

    {/* SAVE BUTTON */}
    {/* <button
      onClick={() => setShowCopyPopup(false)}
      className="mt-2 bg-[#fab31e] hover:opacity-90 text-black font-semibold py-2 rounded-xl transition"
    >
      Save Copy
    </button> */}


    <div className="flex items-center">
       <Button
         onClick={() => setShowCopyPopup(false)}
        text="Save Copy"
        className="text-white" 
        /> 
       </div>

  </div>
)}

       <div className="absolute right-0 top-0 h-full w-3 sm:w-5 md:w-5  candy-border"></div>

    </div>
  </div>
)}
</div>
  );
}



// add firebase

// "use client";

// import { useState ,useEffect } from "react";
// import Button from "./Button";
// import { Download } from "lucide-react";
// import { ref, uploadString, getDownloadURL ,listAll} from "firebase/storage";
// import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
// import { storage, db } from "@/lib/firebase";

// export const uploadBase64Image = async (base64: string) => {
//   try {
//     const fileName = `images/${Date.now()}.png`;

//     const imageRef = ref(storage, fileName);

//     // upload
//     await uploadString(imageRef, base64, "base64");

//     // get URL
//     const url = await getDownloadURL(imageRef);

//     return url;
//   } catch (err) {
//     console.error("Upload error", err);
//     throw err;
//   }
// };

// export default function Chat() {
//   const [description, setDescription] = useState("");
//   const [productImage, setProductImage] = useState<File | null>(null);
//   const [referenceImage, setReferenceImage] = useState<File | null>(null);
//   const [aspectRatio, setAspectRatio] = useState("auto");
//   const [variation, setVariation] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [generatedImages, setGeneratedImages] = useState<string[]>([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const [copyMode, setCopyMode] = useState<"none" | "default" | "custom">("none");
  
// const [customCopy, setCustomCopy] = useState({
//   title: "",
//   description: "",
//   price: "",
//   cta: "",
// });

// const [showCopyPopup, setShowCopyPopup] = useState(false);

//   const CHAT_API_URL =
//     "https://imggenerationn.app.n8n.cloud/webhook-test/c554ca4f-1160-467a-aad4-2a2638f646f2";


// // after n8n response
// const handleImages = async (images: string[]) => {
//   const uploadedUrls = [];

//   for (const img of images) {
//     const url = await uploadBase64Image(img);
//     uploadedUrls.push(url);
//   }

//   // newest first
//   setGeneratedImages((prev) => [...uploadedUrls, ...prev]);
// };



// useEffect(() => {
//   const fetchImages = async () => {
//     try {
//       const listRef = ref(storage, "images/");
//       const res = await listAll(listRef);

//       const urls = await Promise.all(
//         res.items.map((item) => getDownloadURL(item))
//       );

//       // latest first
//       setGeneratedImages(urls.reverse());
//     } catch (err) {
//       console.error("Fetch error", err);
//     }
//   };

//   fetchImages();
// }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

// console.log("BUCKET:", storage.app.options.storageBucket);

//     if (!productImage) {
//       alert("Please upload product image");
//       return;
//     }

//     if (!aspectRatio) {
//       alert("Please select aspect ratio");
//       return;
//     }

//     setLoading(true);

//     try {
//       const formData = new FormData();
//       formData.append("Edit_Description", description);
//       formData.append("Image", productImage);
//       formData.append("Aspect_Ratio", aspectRatio);
//       formData.append("variation", String(variation));

//       if (referenceImage) {
//         formData.append("ReferenceImage", referenceImage);
//       }

//       formData.append("copyMode", copyMode);

// if (copyMode === "custom") {
//   formData.append("title", customCopy.title);
//   formData.append("descriptionCopy", customCopy.description);
//   formData.append("price", customCopy.price);
//   formData.append("cta", customCopy.cta);
// }

//       const res = await fetch(CHAT_API_URL, {
//         method: "POST",
//         body: formData,
//       });

//       // ❌ ERROR CHECK (you didn’t have this)
//       if (!res.ok) {
//         throw new Error("Request failed");
//       }

//       const data = await res.json();

// console.log(data); // check first
// // const url = await getDownloadURL(ref(storage, filePath));
//       // ✅ SHOW POPUP (same as bulk)

//      if (Array.isArray(data)) {
//   const urls = await Promise.all(
//     data.map(async (item) => {
//       return await saveImageToFirebase(item.image);
//     })
//   );

//   setGeneratedImages((prev) => [...urls, ...prev]);
// }
//       setShowPopup(true);

//       // ✅ REDIRECT AFTER 3 SECONDS
//       // setTimeout(() => {
//       //   window.location.href =
//       //     process.env.NEXT_PUBLIC_REDIRECT_DRIVE_URL as string;
//       // }, 3000);
//     } catch (error) {
//       console.error(error);
//       alert("Error submitting form");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const increase = () => setVariation((prev) => Math.min(prev + 1, 4));
//   const decrease = () => setVariation((prev) => Math.max(prev - 1, 1));


//   const saveImageToFirebase = async (base64: string) => {
//   try {
//     const id = Date.now().toString();

//     const storageRef = ref(storage, `images/${id}.png`);

//     // upload base64
//     await uploadString(storageRef, base64, "base64");

//     // get URL
//     const url = await getDownloadURL(storageRef);

//     // save in firestore
//     await addDoc(collection(db, "images"), {
//       url,
//       createdAt: Date.now(),
//     });

//     return url;
//   } catch (err) {
//     console.error("Firebase save error", err);
//   }
// };

//   return (
// <div className="min-h-screen text-white relative overflow-hidden pb-40">

// {generatedImages.length > 0 || loading ? (

//   /* 🔥 IMAGE + SKELETON STATE */
//   <div className="container w-full min-h-[60vh] px-6">
//     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//  {/* 🔥 SKELETON FOR NEW IMAGES */}
//       {loading &&
//         Array.from({ length: variation }).map((_, i) => (
//           <div
//             key={`skeleton-${i}`}
//             className="w-full aspect-square rounded-xl 
//                        bg-gray-200/60 animate-pulse"
//           />
//         ))}
//       {/* 🔥 EXISTING IMAGES */}
//       {generatedImages.map((img, i) => (
//         <div key={i} className="relative group">

//             <img
//     src={img}
//     className="w-full h-auto object-cover rounded-xl"
//   />

//           {/* DOWNLOAD ICON */}
//           <a
          
//   href={img}
//   download={`image-${i}.png`}

//             className="absolute top-3 right-3 
//                        opacity-0 group-hover:opacity-100 
//                        transition duration-300"
//           >
//             <div className="w-10 h-10 flex items-center justify-center 
//                             rounded-full 
//                             bg-black/50 backdrop-blur-md 
//                             border border-white/20 
//                             hover:bg-[#fab31e] hover:text-black 
//                             transition shadow-lg">

//               <Download size={18} />

//             </div>
//           </a>

//         </div>
//       ))}

     

//     </div>
//   </div>

// ) : (

//   /* 🔥 HERO DEFAULT */
//   <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center relative z-10">

//     <div className="flex items-center justify-center gap-4 mb-6 relative">
//       <img src="/images/brandimg1.png" className="w-28 h-28 object-cover rounded-xl rotate-[-10deg] opacity-80 border border-white/10" />
//       <img src="/images/brandimg2.png" className="w-28 h-28 object-cover rounded-xl z-10 border border-white/20" />
//       <img src="/images/brandimg3.png" className="w-28 h-28 object-cover rounded-xl rotate-[10deg] opacity-80 border border-white/10" />
//     </div>

//     <h1 className="text-4xl md:text-6xl font-bold leading-tight text-black">
//       START CREATING WITH <br />
//       <span className="text-highlight">BOMBAY BLOKES</span>
//     </h1>

//     <p className="text-black mt-2 max-w-xl">
//       Describe a scene, character, mood, or style and watch it come to life
//     </p>

//   </div>

// )}





//   {/* 🔥 FLOATING INPUT BAR */}
//   <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 z-50">

//     <div className="bg-[#1D1D1D]/80 backdrop-blur-xl border border-white/10 rounded-[20px] w-full p-4 flex items-center gap-4 shadow-2xl">

//       {/* 🔹 IMAGE UPLOADS */}
//       <div className="flex gap-4">

//   {/* PRODUCT IMAGE */}
//   <div className="flex flex-col items-center gap-1">
//     <span className="text-[10px] text-gray-400">Product</span>

//     <label className="relative w-14 h-14 bg-black/40 rounded-xl flex items-center justify-center cursor-pointer overflow-visible">

//       {productImage ? (
//         <>
//           <img
//             src={URL.createObjectURL(productImage)}
//             className="w-full h-full object-cover rounded-xl"
//           />

//           {/* ❌ HALF OUTSIDE BUTTON */}
//           <button
//             type="button"
//             onClick={(e) => {
//               e.preventDefault();
//               setProductImage(null);
//             }}
//             className="absolute -top-1 -right-1 bg-black border border-white/20 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] hover:bg-red-500 z-10"
//           >
//             ✕
//           </button>
//         </>
//       ) : (
//         <span className="text-lg text-white">+</span>
//       )}

//       <input
//         type="file"
//         accept="image/*"
//         onChange={(e) =>
//           setProductImage(e.target.files ? e.target.files[0] : null)
//         }
//         className="hidden"
//       />
//     </label>
//   </div>

//   {/* REFERENCE IMAGE */}
//   <div className="flex flex-col items-center gap-1">
//     <span className="text-[10px] text-gray-400">Reference</span>

//     <label className="relative w-14 h-14 bg-black/40 rounded-xl flex items-center justify-center cursor-pointer overflow-visible">

//       {referenceImage ? (
//         <>
//           <img
//             src={URL.createObjectURL(referenceImage)}
//             className="w-full h-full object-cover rounded-xl"
//           />

//           <button
//             type="button"
//             onClick={(e) => {
//               e.preventDefault();
//               setReferenceImage(null);
//             }}
//             className="absolute -top-1 -right-1 bg-black border border-white/20 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] hover:bg-red-500 z-10"
//           >
//             ✕
//           </button>
//         </>
//       ) : (
//         <span className="text-lg text-white">+</span>
//       )}

//       <input
//         type="file"
//         accept="image/*"
//         onChange={(e) =>
//           setReferenceImage(e.target.files ? e.target.files[0] : null)
//         }
//         className="hidden"
//       />
//     </label>
//   </div>

// </div>
//     {/* 🔹 INPUT + CONTROLS */}
//     <div className="flex-1">

//       {/* PROMPT */}
//       <input
//         type="text"
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//         placeholder="Describe the scene you imagine"
//         className="w-full bg-transparent outline-none text-sm  text-white mb-3 placeholder-grey-400"
//       />

//       {/* CONTROLS */}
//       <div className="flex items-center gap-3 flex-wrap">

//         {/* MODEL */}
//         <div className="bg-black/40 px-4 py-2 text-white rounded-xl text-sm flex items-center gap-1">
//           <span className="text-highlight font-bold text-sm">G</span>
//           Nano Banana Pro
//         </div>

//         {/* ASPECT DROPDOWN */}
//         <select
//           value={aspectRatio}
//           onChange={(e) => setAspectRatio(e.target.value)}
//           className="bg-black/40 px-3 py-2 rounded-xl text-white text-sm outline-none"
//         >
//           <option value="auto">Auto</option>
//           <option value="1:1">1:1</option>
//           <option value="3:4">3:4</option>
//           <option value="4:3">4:3</option>
//           <option value="2:3">2:3</option>
//           <option value="3:2">3:2</option>
//           <option value="9:16">9:16</option>
//           <option value="16:9">16:9</option>
//           <option value="5:4">5:4</option>
//           <option value="4:5">4:5</option>
//           <option value="21:9">21:9</option>
//         </select>
 

//         {/* VARIATIONS */}
//         <div className="bg-black/40 px-4 py-2 text-white rounded-xl text-sm flex items-center gap-3">
//           <button onClick={decrease}>-</button>
//           <span>{variation}</span>
//           <button onClick={increase}>+</button>
//         </div>


//         <button
//   onClick={() => setShowCopyPopup(true)}
//   className="bg-black/40 px-4 py-2 rounded-xl text-sm"
// >
//   Copy
// </button>

//       </div>
//     </div>

//     {/* 🔹 GENERATE BUTTON */}
//     {/* <button
//       onClick={handleSubmit}
//       disabled={loading}
//       className="bg-lime-400 text-black font-semibold px-6 py-4 rounded-xl hover:opacity-90 transition"
//     >
//       {loading ? "Generating..." : `Generate ✨ ${variation}`}
//     </button> */}

//     <div className="flex items-center">
//        <Button
//         onClick={() => handleSubmit(new Event("submit") as any)}
//         disabled={loading} 
//         text={loading ? "Generating..." : "Generate Images"} 
//         className="text-white" 
//         /> 
//        </div>
//   </div>

//   {/* POPUP SAME */}
//   {/* {showPopup && (
//     <div className="p-5 fixed inset-0 bg-black/60 flex items-center justify-center z-[200]">
//       <div className="bg-[#1D1D1D] rounded-[20px] max-w-lg w-full p-7">
//         <h3 className="text-xl font-semibold mb-2">
//           ✅ Request Sent Successfully
//         </h3>
//         <p className="text-sm">
//           Wait few minutes till the image is rendered.
//         </p>
//       </div>
//     </div>
//   )} */}
//   </div>
//   {showCopyPopup && (
//   <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//     <div className="bg-[#1D1D1D] rounded-[20px] relative overflow-hidden p-6 w-[400px]">

//       <h2 className="text-lg mb-4">Select Copy Mode</h2>

// <div className="flex flex-col gap-3 mt-2">

//   {/* NONE */}
//   <button
//     onClick={() => {
//       setCopyMode("none");
//       setShowCopyPopup(false);
//     }}
//     className={`text-left px-4 py-3 rounded-xl transition 
//       border border-transparent
//       ${copyMode === "none" 
//         ? "bg-white/10 border-[#fab31e] text-white" 
//         : "text-gray-300 hover:bg-white/5 hover:text-white"}
//     `}
//   >
//     Do Not Add Copy
//     <span className="block text-xs text-gray-400">
//       (No Copy)
//     </span>
//   </button>

//   {/* DEFAULT */}
//   <button
//     onClick={() => {
//       setCopyMode("default");
//       setShowCopyPopup(false);
//     }}
//     className={`text-left px-4 py-3 rounded-xl transition 
//       border border-transparent
//       ${copyMode === "default" 
//         ? "bg-white/10 border-[#fab31e] text-white" 
//         : "text-gray-300 hover:bg-white/5 hover:text-white"}
//     `}
//   >
//     Default Copy
//     <span className="block text-xs text-gray-400">
//       (From Reference Image)
//     </span>
//   </button>

//   {/* CUSTOM */}
//   <button
//     onClick={() => setCopyMode("custom")}
//     className={`text-left px-4 py-3 rounded-xl transition 
//       border border-transparent
//       ${copyMode === "custom" 
//         ? "bg-white/10 border-[#fab31e] text-white" 
//         : "text-gray-300 hover:bg-white/5 hover:text-white"}
//     `}
//   >
//     Custom Copy
//     <span className="block text-xs text-gray-400">
//       Add your own text
//     </span>
//   </button>

// </div>

//       {/* CUSTOM FORM */}
//      {copyMode === "custom" && (
//   <div className="mt-5 flex flex-col gap-3">

//     {/* TITLE */}
//     <input
//       placeholder="Title (required)"
//       value={customCopy.title}
//       onChange={(e) =>
//         setCustomCopy({ ...customCopy, title: e.target.value })
//       }
//       className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-400 outline-none focus:border-[#fab31e]"
//     />

//     {/* DESCRIPTION */}
//     <input
//       placeholder="Description (optional)"
//       value={customCopy.description}
//       onChange={(e) =>
//         setCustomCopy({ ...customCopy, description: e.target.value })
//       }
//       className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-400 outline-none focus:border-[#fab31e]"
//     />

//     {/* PRICE + CTA ROW */}
//     <div className="flex gap-2">
//       <input
//         placeholder="Price"
//         value={customCopy.price}
//         onChange={(e) =>
//           setCustomCopy({ ...customCopy, price: e.target.value })
//         }
//         className="w-1/2 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-400 outline-none focus:border-[#fab31e]"
//       />

//       <input
//         placeholder="CTA (e.g. Buy Now)"
//         value={customCopy.cta}
//         onChange={(e) =>
//           setCustomCopy({ ...customCopy, cta: e.target.value })
//         }
//         className="w-1/2 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-400 outline-none focus:border-[#fab31e]"
//       />
//     </div>

//     {/* SAVE BUTTON */}
//     {/* <button
//       onClick={() => setShowCopyPopup(false)}
//       className="mt-2 bg-[#fab31e] hover:opacity-90 text-black font-semibold py-2 rounded-xl transition"
//     >
//       Save Copy
//     </button> */}


//     <div className="flex items-center">
//        <Button
//          onClick={() => setShowCopyPopup(false)}
//         text="Save Copy"
//         className="text-white" 
//         /> 
//        </div>

//   </div>
// )}

//        <div className="absolute right-0 top-0 h-full w-3 sm:w-5 md:w-5  candy-border"></div>

//     </div>
//   </div>
// )}
// </div>
//   );
// }