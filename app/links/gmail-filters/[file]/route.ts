import { NextResponse } from "next/server";

const TARGET_URL_BASE =
  "https://github.com/mpiniarski/gmail-filters/releases/download/v1.0.0";

function isSafeAssetFileName(name: string): boolean {
  if (name.length === 0 || name.length > 255) return false;
  if (name.includes("/") || name.includes("\\") || name.includes(".."))
    return false;
  return /^[\w.-]+$/.test(name);
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ file: string }> },
) {
  const { file } = await context.params;
  const decoded = decodeURIComponent(file);
  if (!isSafeAssetFileName(decoded)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const target = `${TARGET_URL_BASE}/${encodeURIComponent(decoded)}`;
  return NextResponse.redirect(target, 302);
}
