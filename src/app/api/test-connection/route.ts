import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { shopifyURL, apiKey } = await req.json();

    if (!shopifyURL || !apiKey) {
      return NextResponse.json(
        { message: "Shopify URL and API key are required." },
        { status: 400 }
      );
    }

    const response = await fetch(`${shopifyURL}/admin/api/2023-01/shop.json`, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": apiKey,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to connect to Shopify. Check credentials." },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ message: "Connection successful.", data });
  } catch (error) {
    console.error("Error testing connection:", error);
    return NextResponse.json(
      { message: "An error occurred while testing connection." },
      { status: 500 }
    );
  }
}
