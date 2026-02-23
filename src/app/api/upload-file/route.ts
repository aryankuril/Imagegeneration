import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const productId = formData.get("productId") as string;
    const imageFile = formData.get("file") as File;
    const variantName = formData.get("variantName") as string | null;
    const imagePosition = formData.get("imagePosition") as string | null;
    const shopifyURL = formData.get("shopifyURL") as string;
    const apiKey = formData.get("apiKey") as string;

    if (!productId || !imageFile || !shopifyURL || !apiKey) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Convert image to Base64
    const imageBase64 = await convertToBase64(imageFile);
    console.log("Image converted to Base64");

    // Upload the image to Shopify once
    const uploadedImage = await uploadImageToShopify({
      shopifyURL,
      productId,
      apiKey,
      imageBase64,
      imagePosition,
    });
    console.log("Image uploaded successfully to Shopify");

    // If variantName is provided, associate the uploaded image with the matching variants
    if (variantName) {
      const variants = await fetchVariants(shopifyURL, productId, apiKey);
      const matchingVariants = variants.filter((v) =>
        v.title.toLowerCase().includes(variantName.toLowerCase())
      );

      if (matchingVariants.length === 0) {
        return NextResponse.json({
          message: `No variants found for "${variantName}"`,
          image: uploadedImage,
        });
      }

      // Associate the single uploaded image with the matching variants
      const associationMessages = await Promise.all(
        matchingVariants.map((variant) =>
          associateImageWithVariant(
            shopifyURL,
            apiKey,
            productId,
            variant.id,
            uploadedImage.id
          )
        )
      );

      associationMessages.forEach((message) => console.log(message));

      return NextResponse.json({
        message: `Image uploaded and associated with ${matchingVariants.length} variants.`,
        image: uploadedImage,
      });
    }

    return NextResponse.json({
      message: "Image uploaded successfully",
      image: uploadedImage,
    });
  } catch (err) {
    const error = err as Error;
    console.error("Error uploading image:", error.message);
    return NextResponse.json({
      error: "Failed to upload image",
      details: error.message,
    });
  }
}

interface Variant {
  id: string;
  title: string;
}

async function fetchVariants(
  shopifyURL: string,
  productId: string,
  apiKey: string
): Promise<Variant[]> {
  const url = `${shopifyURL}/admin/api/2023-01/products/${productId}/variants.json`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-Shopify-Access-Token": apiKey,
    },
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error(`Error fetching variants: ${errorData}`);
    throw new Error(`Failed to fetch variants: ${errorData}`);
  }

  const variantsData = await response.json();
  if (!variantsData || !variantsData.variants) {
    throw new Error("No variants data returned from Shopify API.");
  }

  return variantsData.variants;
}

async function uploadImageToShopify({
  shopifyURL,
  productId,
  apiKey,
  imageBase64,
  imagePosition,
}: {
  shopifyURL: string;
  productId: string;
  apiKey: string;
  imageBase64: string;
  imagePosition: string | null;
}) {
  const shopifyPayload = {
    image: {
      attachment: imageBase64,
      ...(imagePosition && { position: parseInt(imagePosition, 10) }),
    },
  };

  const url = `${shopifyURL}/admin/api/2023-01/products/${productId}/images.json`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "X-Shopify-Access-Token": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(shopifyPayload),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error(`Error uploading image: ${errorData}`);
    throw new Error(`Failed to upload image: ${errorData}`);
  }

  const data = await response.json();
  return data.image;
}

async function associateImageWithVariant(
  shopifyURL: string,
  apiKey: string,
  productId: string,
  variantId: string,
  imageId: string
) {
  const url = `${shopifyURL}/admin/api/2023-01/variants/${variantId}.json`;

  const payload = {
    variant: {
      id: variantId,
      image_id: imageId, // Correctly set the image_id for the variant
    },
  };

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error(
      `Failed to associate image with variant ${variantId}: ${response.status} ${response.statusText}. Error: ${errorData}`
    );
    throw new Error(`Failed to associate image with variant ${variantId}`);
  }

  const data = await response.json();
  console.log(`Image successfully associated with variant ${variantId}:`, data);
  return `Image associated with variant ${variantId} successfully.`;
}

async function convertToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  return Buffer.from(buffer).toString("base64");
}
