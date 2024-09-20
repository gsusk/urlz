import "./Clicks.css";

type PropType = {
  totalViews: number;
  shortUrl: string;
  createdAt: Date | string;
  originalUrl: string;
};

export default function Clicks({
  totalViews,
  shortUrl,
  createdAt,
  originalUrl,
}: PropType) {
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
        <div className="lurl-tab-count">
          <div className="inne-tc">
            <div className="inne-tc-comp">{shortUrl}</div>
            <div className="inne-tc-comp">
              <span className="lk">{originalUrl}</span>
            </div>
            <div className="inne-tc-comp">Created: {`${createdAt}`}</div>
          </div>
        </div>
      </div>
    </>
  );
}
