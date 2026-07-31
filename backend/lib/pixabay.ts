const PIXABAY_API_URL = "https://pixabay.com/api/";

export interface PixabayHit {
  id: number;
  previewURL: string;
  webformatURL: string;
  largeImageURL: string;
  tags: string;
  user: string;
  [key: string]: unknown;
}

export interface PixabaySearchResult {
  total: number;
  totalHits: number;
  hits: PixabayHit[];
}

export async function searchPixabay(
  query: string,
  page = 1,
  perPage = 20
): Promise<PixabaySearchResult> {
  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) {
    throw new Error("Missing PIXABAY_API_KEY environment variable");
  }

  const url = new URL(PIXABAY_API_URL);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("q", query);
  url.searchParams.set("image_type", "photo");
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(Math.min(Math.max(perPage, 3), 200)));
  url.searchParams.set("safesearch", "true");

  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Pixabay search failed (${res.status}): ${text}`);
  }

  return (await res.json()) as PixabaySearchResult;
}

export default searchPixabay;
