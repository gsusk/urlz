import client from "./axios";

type Url = {
  shortUrl: string;
};

export async function generateShortUrl(url: string): Promise<Url> {
  const response = await client.post<Url>(
    "/api/url/create",
    { shortUrl: url },
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data;
}

//export async function redirectToUrl(param: string) {
//  await client.get(`/${param}`);
//}
