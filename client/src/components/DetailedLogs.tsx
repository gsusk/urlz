import UAParser from "ua-parser-js"

export type LogsPropType = {
  details: { visitedAt: string; referrer: null | string; user_agent: string, continent: string }[];
};

// const logData = useMemo(() => {
function DetailedLogs({ details }: LogsPropType) {
  // const parsedDetails = details.map((row) => {
  // return (<div>sds</div>)
  // })
  // }, [details])
  return (
    <div>
      <div>
        <table style={{ "width": "100%", "textAlign": "center" }}>
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
            {details.map(row => {
              const parsedUA = new UAParser(row.user_agent)
              return (<tr>
                <td >{parsedUA.getBrowser().name ?? ""}</td>
                <td >{parsedUA.getOS().name ?? ""}</td>
                <td >{row.referrer ?? "-"}</td>
                <td >{row.continent ?? ""}</td>
                <td >{new Date(row.visitedAt).toLocaleString() || "-"}</td>
              </tr>)
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DetailedLogs;
