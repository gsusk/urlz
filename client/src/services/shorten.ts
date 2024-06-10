import client from "./axios";

type Url = {
  shortUrl: string;
};

export async function generateShortUrl(url: string): Promise<Url> {
  const response = await client.post<Url>(
    "/url/create",
    { url: url },
    { headers: { "Content-Type": "application/json" }, __retry: true }
  );
  console.log(response);
  return response.data;
}

export async function generateCustomShortUrl({
  longUrl: url,
  customUrl,
}: {
  longUrl: string;
  customUrl: string;
}) {
  const response = await client.post<Url>(
    "/url/custom",
    { url, customUrl },
    { headers: { "Content-Type": "application/json" }, __retry: true }
  );
  console.log(response);
  return response.data;
}
