import { useEffect, useState } from "react";
import UrlSection from "../components/UrlSection";
import "./Urls.css";
import client from "../services/axios";

type UrlList = {
  custom: string;
  original: string;
  shortUrl: string;
  views: number;
}[];
function Urls() {
  const [loading, setLoading] = useState(true);
  const [urls, setUrls] = useState<UrlList>([]);

  useEffect(() => {
    client
      .get("http://localhost:8081/api/url/")
      .then((response) => {
        const urls = response.data.urls.map((url: []) => ({
          ...url,
          //@ts-expect-error its fine
          views: url._count.analytics, // Add 'views' property based on '_count.analytics'
        }));
        setUrls(urls);
      })
      .catch((err) => {
        console.log(err);
        setUrls([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>loading...</div>;

  return (
    <div className="h-container">
      <div className="centered-container">
        {urls.map((url) => {
          return (
            <UrlSection
              views={url.views}
              shortenedUrl={url.custom ?? url.shortUrl}
              creationDate="12/11/2024"
              originalUrl={url.original}
            ></UrlSection>
          );
        })}
      </div>
    </div>
  );
}

export default Urls;
