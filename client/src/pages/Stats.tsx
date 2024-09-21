import { useEffect, useState } from "react";
import client from "../services/axios";
import { useSearchParams } from "react-router-dom";
import Clicks from "../components/Clicks";
import "./stats.css";
import ClickScan, { ScanDataType } from "../components/ClickScan";
import CountriesMap from "../components/CountriesMap";

function Stats() {
  const [params] = useSearchParams();
  const [urlStats, setUrlStats] = useState({
    monthStats: [] as ScanDataType[],
    totalClicks: 0,
    stats: [] as { country: string; country_code: string; views: number }[],
  });
  const [urlDetails, setUrlDetails] = useState({
    custom: "",
    original: "",
    shortUrl: "",
    analytics: [],
  });

  useEffect(() => {
    const t = async () => {
      const response = await client.get(`/url/${params.get("url")}/stats`);
      setUrlStats(response.data);
    };
    const b = async () => {
      const response = await client.get(`/url/${params.get("url")}/details`);
      const data = response.data.details;
      setUrlDetails({
        ...data,
        shortUrl: `http://${data.shortUrl ?? data.custom}.com`,
      });
      console.log(response.data);
    };
    t();
    b();
  }, []);

  return (
    <div className="h-container">
      <div className="centered-container">
        <h2 className="sepline">Info</h2>
        <div className="clicks-ss">
          <Clicks
            totalViews={urlStats.totalClicks}
            shortUrl={urlDetails.shortUrl}
            createdAt={new Date().toLocaleString()}
            originalUrl={urlDetails.original}
          ></Clicks>
        </div>
        <h2 className="sepline">Daily Stats</h2>
        <div className="clicks-ss">
          <ClickScan monthStats={urlStats.monthStats}></ClickScan>
        </div>
        <h2 className="sepline">Countries</h2>
        <div className="clicks-ss">
          <CountriesMap></CountriesMap>
        </div>
      </div>
    </div>
  );
}

export default Stats;
