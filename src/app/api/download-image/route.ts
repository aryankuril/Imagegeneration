import { NextRequest, NextResponse } from "next/server";

const FIREBASE_STORAGE_HOST = "firebasestorage.googleapis.com";
const FIREBASE_STORAGE_HOST_SUFFIX = ".firebasestorage.app";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const imageUrl = request.nextUrl.searchParams.get("url");
  const fileName =
    request.nextUrl.searchParams.get("filename") || "generated-image.png";

  if (!imageUrl) {
    return NextResponse.json({ error: "Missing image URL" }, { status: 400 });
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
  }

  const token = request.nextUrl.searchParams.get("token");
  const alt = request.nextUrl.searchParams.get("alt");

  if (token && !parsedUrl.searchParams.has("token")) {
    parsedUrl.searchParams.set("token", token);
  }

  if (alt && !parsedUrl.searchParams.has("alt")) {
    parsedUrl.searchParams.set("alt", alt);
  }

  if (
    parsedUrl.protocol !== "https:" ||
    !isAllowedFirebaseStorageHost(parsedUrl.hostname)
  ) {
    return NextResponse.json({ error: "Unsupported image URL" }, { status: 400 });
  }

  normalizeFirebaseObjectPath(parsedUrl);

  const imageResponse = await fetch(parsedUrl.toString(), {
    cache: "no-store",
    headers: {
      Accept: "image/*,application/octet-stream",
    },
  });

  if (!imageResponse.ok || !imageResponse.body) {
    const details = await imageResponse.text().catch(() => "");

    return NextResponse.json(
      {
        error: "Failed to fetch image",
        status: imageResponse.status,
        details: details.slice(0, 300),
      },
      { status: 502 }
    );
  }

  return new NextResponse(imageResponse.body, {
    headers: {
      "Content-Disposition": `attachment; filename="${sanitizeFileName(
        fileName
      )}"`,
      "Content-Type":
        imageResponse.headers.get("content-type") || "application/octet-stream",
      "Cache-Control": "no-store",
    },
  });
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function isAllowedFirebaseStorageHost(hostname: string) {
  return (
    hostname === FIREBASE_STORAGE_HOST ||
    hostname.endsWith(FIREBASE_STORAGE_HOST_SUFFIX)
  );
}

function normalizeFirebaseObjectPath(url: URL) {
  if (url.hostname !== FIREBASE_STORAGE_HOST) {
    return;
  }

  const objectPathStart = url.pathname.indexOf("/o/");

  if (objectPathStart === -1) {
    return;
  }

  const objectPath = url.pathname.slice(objectPathStart + 3);

  if (!objectPath || objectPath.includes("%2F")) {
    return;
  }

  url.pathname = `${url.pathname.slice(0, objectPathStart + 3)}${encodeURIComponent(
    objectPath
  )}`;
}