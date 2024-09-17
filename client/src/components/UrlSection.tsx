import { ImQrcode } from "react-icons/im";
import { IoEarth } from "react-icons/io5";
import "./Url.css";

export type PropTypes = {
  views: number;
  creationDate: string;
  shortenedUrl: string;
  originalUrl: string;
};

export default function Url({
  views,
  creationDate,
  shortenedUrl,
  originalUrl,
}: PropTypes) {
  const composedUrl = `http://localhost:8081/${shortenedUrl}`;
  return (
    <div className="urli-container">
      <div className="url-fp">
        <div>
          <div className="url-flex lc">
            <ImQrcode className="font-rq" />
            <a target="_blank" href={composedUrl} referrerPolicy="no-referrer">
              {composedUrl}
            </a>
          </div>
          <div className="url-flex">
            <IoEarth className="url-il" />
            <p className="url-il">{originalUrl}</p>
          </div>
        </div>
        <div>
          <div>{views}</div>
        </div>
        <div>
          <div>{creationDate}</div>
        </div>
        <div>Extra</div>
      </div>
    </div>
  );
}
