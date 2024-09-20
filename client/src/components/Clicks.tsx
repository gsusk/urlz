import "./Clicks.css";

type PropType = {
  totalViews: number;
};

export default function Clicks({ totalViews }: PropType) {
  return (
    <>
      <div className="click-counter-container">
        <div className="turl-tab-count">
          <div className="url-tab-count">
            <span className="urlt1">{totalViews ?? 0}</span>
            <span className="urlt2">Total Visits</span>
          </div>
          <div className="url-tab-count">
            <span className="urlt1">0</span>
            <span className="urlt2">Unique Visits</span>
          </div>
          <div className="url-tab-count">
            <span className="urlt1">0</span>
            <span className="urlt2">QR Scans</span>
          </div>
        </div>
        <div>
          <div>asdasdasdasdasdasdassdssdds</div>
        </div>
      </div>
    </>
  );
}
