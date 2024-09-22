export type LogsPropType = {
  details: { visitedAt: string; referrer: null | string; user_agent: string }[];
};

function DetailedLogs({ details }: LogsPropType) {
  return (
    <div>
      <div>
        <table>
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
            <tr>
              <td>sdf</td>
              <td>dddd</td>
              <td>hhhh</td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DetailedLogs;
