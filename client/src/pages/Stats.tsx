import { useEffect } from "react";
import client from "../services/axios";
import { useSearchParams } from "react-router-dom";

function Stats() {
  const [params] = useSearchParams();

  useEffect(() => {
    const t = async () => {
      const data = await client.get(`/url/${params.get("url")}/stats`);
      console.log(data);
    };
    t();
  }, []);

  return (
    <div className="h-container">
      <div className="centered-container">Stats</div>
    </div>
  );
}

export default Stats;
