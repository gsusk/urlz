import { useEffect } from "react";
import client from "../services/axios";
import { useSearchParams } from "react-router-dom";
import Clicks from "../components/Clicks";
import "./stats.css";

function Stats() {
  const [params] = useSearchParams();

  useEffect(() => {
    const t = async () => {
      const data = await client.get(`/url/${params.get("url")}/stats`);
      console.log(data);
    };
    const b = async () => {
      const data = await client.get(`/url/${params.get("url")}/details`);
      console.log(data);
    };
    t();
    b();
  }, []);

  return (
    <div className="h-container">
      <div className="centered-container">
        <h2 className="sepline">Info</h2>
        <div>
          <Clicks
            totalViews={0}
            shortUrl={"s4Vdj"}
            createdAt={new Date().toLocaleString()}
            originalUrl={"http://test.com"}
          ></Clicks>
        </div>
        <h2 className="sepline">Daily</h2>
        <div></div>
      </div>
    </div>
  );
}

export default Stats;
