import { NextResponse } from "next/server";

// Simulate a rate-limiting queue to respect Shopify's API limits
let lastRequestTimestamp = 0;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { shopifyURL, apiKey, folderNames } = body;

    if (!shopifyURL || !apiKey || !folderNames) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const productIds: { folderName: string; productId: string }[] = [];

    for (const folderName of folderNames) {
      // Ensure we comply with Shopify's API limits
      const now = Date.now();
      if (now - lastRequestTimestamp < 500) {
        await new Promise((resolve) =>
          setTimeout(resolve, 500 - (now - lastRequestTimestamp))
        );
      }
      lastRequestTimestamp = Date.now();

      const url = `${shopifyURL}/admin/api/2023-01/products.json?title=${encodeURIComponent(
        folderName
      )}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch product ID for folder: ${folderName}`);
      }

      const data = await response.json();
      const product = data.products[0];

      if (product) {
        productIds.push({ folderName, productId: product.id });
      } else {
        console.warn(`No product found for folder: ${folderName}`);
        productIds.push({ folderName, productId: "Not Found" });
      }
    }

    return NextResponse.json(productIds);
  } catch (error) {
    console.error("Error in /api/get-product-ids:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
