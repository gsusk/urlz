import client from "./axios";

export type UrlSuccessResponse = {
  shortenedUrl: string;
};

export type UrlErrorResponse = {
  errors: {
    url?: string;
    customUrl?: string;
  };
  message: string;
};

export async function generateShortUrl(
  url: string
): Promise<UrlSuccessResponse> {
  const response = await client.post<UrlSuccessResponse>(
    "/url/create",
    { url: url },
    { headers: { "Content-Type": "application/json" }, __retry: true }
  );
  return response.data;
}

export async function generateCustomShortUrl({
  url,
  customUrl,
}: {
  url: string;
  customUrl: string;
}) {
  const response = await client.post<UrlSuccessResponse>(
    "/url/custom",
    { url, customUrl },
    { headers: { "Content-Type": "application/json" }, __retry: true }
  );
  return response.data;
}
