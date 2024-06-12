import client, { isAxiosError } from "./axios";

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
): Promise<UrlSuccessResponse | UrlErrorResponse> {
  try {
    const response = await client.post<UrlSuccessResponse>(
      "/url/create",
      { url: url },
      { headers: { "Content-Type": "application/json" }, __retry: true }
    );
    return response.data;
  } catch (err) {
    if (
      isAxiosError<UrlErrorResponse & Partial<UrlErrorResponse["errors"]>>(
        err
      ) &&
      err.response
    ) {
      return err.response.data;
    } else {
      return {
        errors: { url: "Something went wrong" },
        message: "Something went wrong",
      };
    }
  }
}

export async function generateCustomShortUrl({
  longUrl: url,
  customUrl,
}: {
  longUrl: string;
  customUrl: string;
}) {
  try {
    const response = await client.post<UrlSuccessResponse>(
      "/url/custom",
      { url, customUrl },
      { headers: { "Content-Type": "application/json" }, __retry: true }
    );
    return response.data;
  } catch (err) {
    if (isAxiosError<UrlErrorResponse>(err) && err.response) {
      return err.response.data;
    } else {
      return {
        errors: { url: "Something went wrong" },
        message: "Something went wrong",
      };
    }
  }
}
