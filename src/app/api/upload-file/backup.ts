// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   try {
//     // Parse the incoming FormData
//     const formData = await request.formData();

//     // Extract relevant fields from FormData
//     const productId = formData.get("productId") as string;
//     const imageFile = formData.get("file") as File; // The image file
//     const variantName = formData.get("variantName") as string | null; // Optional
//     const imagePosition = formData.get("imagePosition") as string | null; // Optional
//     const shopifyURL = formData.get("shopifyURL") as string;
//     const apiKey = formData.get("apiKey") as string;

//     console.log("Received image upload request:", {
//       productId,
//       imageFile,
//       variantName,
//       imagePosition,
//       shopifyURL,
//       apiKey,
//     });

//     // Validate required fields
//     if (!productId || !imageFile || !shopifyURL || !apiKey) {
//       return NextResponse.json(
//         { error: "Missing required parameters" },
//         { status: 400 }
//       );
//     }

//     // Convert the image file to Base64 with the correct MIME type
//     const imageBase64 = await convertToBase64(imageFile);
//     console.log("Image converted to Base64");

//     // Prepare the payload for Shopify API
//     const shopifyPayload: Record<string, any> = {
//       image: {
//         attachment: imageBase64, // Base64 encoded image
//       },
//     };

//     // Optionally add image position
//     if (imagePosition) {
//       shopifyPayload.image.position = parseInt(imagePosition, 10);
//     }

//     // Shopify API endpoint for uploading an image
//     const url = `${shopifyURL}/admin/api/2023-01/products/${productId}/images.json`;

//     // Make the POST request to Shopify
//     const response = await fetch(url, {
//       method: "POST",
//       headers: {
//         "X-Shopify-Access-Token": apiKey,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(shopifyPayload),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(
//         `Failed to upload image: ${JSON.stringify(errorData.errors)}`
//       );
//     }

//     const data = await response.json();
//     const uploadedImage = data.image;

//     // Log that the image was uploaded to Shopify
//     console.log(
//       `Image uploaded successfully to Shopify at position ${
//         imagePosition || "default"
//       }. Image ID: ${uploadedImage.id}`
//     );

//     // Prepare response for image upload success
//     let uploadResponse: string = "Image uploaded successfully";

//     // Check if image position is provided
//     if (imagePosition) {
//       uploadResponse += ` to position ${imagePosition}`;
//     }

//     // Optionally handle variant association if `variantName` is provided
//     if (variantName) {
//       const variantUrl = `${shopifyURL}/admin/api/2023-01/products/${productId}/variants.json`;
//       const variantsResponse = await fetch(variantUrl, {
//         method: "GET",
//         headers: {
//           "X-Shopify-Access-Token": apiKey,
//         },
//       });

//       const variantsData = await variantsResponse.json();
//       const variant = variantsData.variants.find(
//         (v: any) => v.title === variantName
//       );

//       if (variant) {
//         const imageAssociationUrl = `${shopifyURL}/admin/api/2023-01/products/${productId}/variants/${variant.id}/images.json`;
//         await fetch(imageAssociationUrl, {
//           method: "POST",
//           headers: {
//             "X-Shopify-Access-Token": apiKey,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             image: {
//               src: uploadedImage.src,
//             },
//           }),
//         });

//         console.log(
//           `Image associated successfully with variant "${variantName}".`
//         );
//         uploadResponse = `Image uploaded successfully to variant "${variantName}"`;
//       }
//     }

//     return NextResponse.json({
//       message: uploadResponse,
//       image: uploadedImage,
//     });
//   } catch (err) {
//     const error = err as Error; // Cast 'err' to 'Error'
//     console.error("Error uploading image:", error.message);
//     return NextResponse.json({
//       error: "Failed to upload image",
//       details: error.message,
//     });
//   }
// }

// // Helper function to convert image to Base64 with its MIME type
// async function convertToBase64(file: File): Promise<string> {
//   // Convert the file into a Buffer (if it's not already a Buffer in your environment)
//   const buffer = await file.arrayBuffer();
//   const base64 = Buffer.from(buffer).toString("base64"); // Convert buffer to base64
//   return base64;
// }
