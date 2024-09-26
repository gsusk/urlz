import UAParser from "ua-parser-js";
import { useRef } from "react";
import client from "../services/axios";

export type LogsPropType = {
  details: {
    visitedAt: string;
    referrer: null | string;
    user_agent: string;
    continent: string;
  }[];
  url: string;
};

// const logData = useMemo(() => {
function DetailedLogs({ details, url }: LogsPropType) {
  const ref = useRef<HTMLAnchorElement>(null);
  const handleClick = () => {
    client
      .get(`/url/${url}/download`, {
        __retry: false,
        responseType: "blob",
      })
      .then((res) => {
        return res.data as Blob;
      })
      .then((blob) => {
        const blobData = new Blob([blob], { type: "text/csv" });
        const url = URL.createObjectURL(blobData);
        if (ref.current) {
          ref.current.href = url;
          ref.current.download = "data.csv";
          ref.current.click();
          URL.revokeObjectURL(url);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // const parsedDetails = details.map((row) => {
  // return (<div>sds</div>)
  // })
  // }, [details])
  return (
    <div>
      <div>
        <button type="button" onClick={handleClick}>
          Download CSV
        </button>
        {/*
          <a
            download="data.csv"
            href="http://localhost:8081/api/url/download"
          ></a>
        */}
        <a style={{ visibility: "hidden" }} ref={ref}></a>
      </div>
      <div>
        <table style={{ width: "100%", textAlign: "center" }}>
          <thead>
            <tr>
              <th>Browser</th>
              <th>Platform</th>
              <th>Referrer</th>
              <th>Location</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {details.map((row, idx) => {
              const parsedUA = new UAParser(row.user_agent);
              return (
                <tr key={idx}>
                  <td>{parsedUA.getBrowser().name ?? ""}</td>
                  <td>{parsedUA.getOS().name ?? ""}</td>
                  <td>{row.referrer ?? "-"}</td>
                  <td>{row.continent ?? ""}</td>
                  <td>{new Date(row.visitedAt).toLocaleString() || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DetailedLogs;
