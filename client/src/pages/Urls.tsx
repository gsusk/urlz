import { useEffect, useState } from "react";
import UrlSection from "../components/UrlSection";
import "./Urls.css";
import client from "../services/axios";

function Urls() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .get("http://localhost:8081/api/url/")
      .then(async (val) => val)
      .then((v) => console.log(v))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>loading...</div>;

  return (
    <div className="h-container">
      <div className="centered-container">
        <div>
          <div>asdasd</div>
          <div>asdasd</div>
          <div>asdasd</div>
          <div>asdasd</div>
          <div>asdasd</div>
          <div>asdasd</div>
          <div>asdasd</div>
          <div>asdasd</div>
          <div>asdasd</div>
          <div>asdasd</div>
          <div>asdasd</div>
          <div>asdasd</div>
          <div>asdasd</div>
          <div>asdasd</div>
          <div>asdasd</div>
          <div>asdasd</div>
          <div>asdasd</div>
          <div>asdasd</div>
        </div>

        <UrlSection
          views={0}
          creationDate={""}
          shortUrl={""}
          originalUrl={""}
          customUrl={""}
        ></UrlSection>
      </div>
    </div>
  );
}

export default Urls;
