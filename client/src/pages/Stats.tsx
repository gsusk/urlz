import { useEffect, useState } from "react";
import client from "../services/axios";
import { useSearchParams } from "react-router-dom";
import Clicks from "../components/Clicks";
import "./stats.css";
import "./Urls.css";
import ClickScan, { ScanDataType } from "../components/ClickScan";
import CountriesMap, { CountryMapPropTypes } from "../components/CountriesMap";
import DetailedLogs, { LogsPropType } from "../components/DetailedLogs";

function Stats() {
  const [params] = useSearchParams();
  const [urlStats, setUrlStats] = useState({
    monthStats: [] as ScanDataType[],
    totalClicks: 0,
    stats: [] as CountryMapPropTypes["stats"],
  });
  const [urlDetails, setUrlDetails] = useState({
    custom: "",
    original: "",
    shortUrl: "",
    analytics: [] as LogsPropType["details"],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const dataParam = params.get("url");

  useEffect(() => {
    if (!dataParam) {
      setError("URL parameter is missing");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    // Fetching URL Stats and Details in parallel
    const fetchStatsAndDetails = async () => {
      try {
        const [statsResponse, detailsResponse] = await Promise.all([
          client.get(`/url/${dataParam}/stats`),
          client.get(`/url/${dataParam}/details`),
        ]);

        setUrlStats(statsResponse.data ?? []);
        const detailsData = detailsResponse.data.details;
        setUrlDetails({
          ...detailsData,
          shortUrl: `http://${detailsData.shortUrl ?? detailsData.custom}.com`,
        });
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatsAndDetails();
  }, [dataParam]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
          />
        </div>
        <h2 className="sepline">Daily Stats</h2>
        <div className="clicks-ss">
          <ClickScan monthStats={urlStats.monthStats} />
        </div>
        <h2 className="sepline">Countries</h2>
        <div className="clicks-ss">
          <CountriesMap stats={urlStats.stats} />
        </div>
        <h2 className="sepline">Detailed Logs</h2>
        <div className="clicks-ss">
          <DetailedLogs url={dataParam!} details={urlDetails.analytics} />
        </div>
      </div>
    </div>
  );
}

export default Stats;
