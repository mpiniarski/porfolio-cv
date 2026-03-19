export function shortUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/i, "").trim();
}

