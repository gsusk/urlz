import { useEffect, useState } from "react";
import Url from "../components/Url";
import "./Urls.css";
import client from "../services/axios";

function Urls() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .get("http://localhost:8081/api/url/")
      .then(async (val) => val)
      .then((v) => console.log(v));
  }, []);

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

        <Url></Url>
      </div>
    </div>
  );
}

export default Urls;
