import { useEffect, useState } from "react";
import { Pagination } from "../components/Pagination";
import UrlSection from "../components/UrlSection";
import "./Urls.css";
import client from "../services/axios";
import { useSearchParams } from "react-router-dom";

type UrlList = {
  custom: string;
  original: string;
  shortUrl: string;
  views: number;
}[];
function Urls() {
  const [loading, setLoading] = useState(true);
  const [urls, setUrls] = useState<UrlList>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page");

  useEffect(() => {
    client
      .get(`http://localhost:8081/api/url?page=${page}`)
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
        <div>ADD SEARCH BAR?</div>
        {urls.map((url) => {
          return (
            <UrlSection
              key={url.shortUrl}
              views={url.views}
              shortenedUrl={url.custom ?? url.shortUrl}
              creationDate="12/11/2024"
              originalUrl={url.original}
            ></UrlSection>
          );
        })}
        <div>
          <Pagination></Pagination>
        </div>
      </div>
    </div>
  );
}

export default Urls;
