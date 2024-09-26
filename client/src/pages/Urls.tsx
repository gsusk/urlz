import { useEffect, useState } from "react";
import { Pagination } from "../components/Pagination.tsx";
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
  const [urls, setUrls] = useState<{ urls: UrlList; pages: { total: number } }>(
    { urls: [], pages: { total: 0 } },
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const num = parseInt(searchParams.get("page") || "");
  const page = typeof num && !isNaN(num) ? num : 1;

  const handlePageChange = (value: number) => {
    setSearchParams({ page: value.toString() });
    setLoading(true);
  };

  console.log("1 and outer: Urls");

  useEffect(() => {
    if (!loading) setLoading(true);
    client
      .get(`http://localhost:8081/api/url?page=${encodeURIComponent(page)}`)
      .then((response) => {
        const urls = response.data.urls.map((url: []) => ({
          ...url,
          //@ts-expect-error its fine
          views: url._count.analytics, // Add 'views' property based on '_count.analytics'
        }));
        setUrls({ urls, pages: { total: response.data.pages.total } });
      })
      .catch((err) => {
        console.log(err);
        setUrls({ urls: [], pages: { total: 0 } });
      })
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) {
    console.log("1: loading");
    return <div>loading...</div>;
  }

  console.log("1: after loading");
  return (
    <div className="h-container">
      <div className="centered-container">
        <div>ADD SEARCH BAR?</div>
        {urls.urls.map((url) => {
          return (
            <UrlSection
              key={url.shortUrl ?? url.custom}
              views={url.views}
              shortenedUrl={url.custom ?? url.shortUrl}
              creationDate="12/11/2024"
              originalUrl={url.original}
            ></UrlSection>
          );
        })}
        <div>
          {urls.pages.total &&
            urls.pages.total > 10 &&
            urls.urls.length > 0 && (
              <Pagination
                totalCount={urls.pages.total}
                currentPage={page}
                pageSize={10}
                handlePageChange={handlePageChange}
              ></Pagination>
            )}
        </div>
      </div>
    </div>
  );
}

export default Urls;
