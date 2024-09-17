import { ImQrcode } from "react-icons/im";
import { IoEarth } from "react-icons/io5";
import { IoSettingsSharp } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
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
        <div className="url-out-flex">
          <div className="url-flex lc">
            <ImQrcode className="font-rq" />
            <a
              target="_blank"
              href={composedUrl}
              referrerPolicy="no-referrer"
              className="urlcont"
            >
              {composedUrl}
            </a>
          </div>
          <div className="url-flex clr">
            <IoEarth className="url-il" />
            <p className="url-il">{originalUrl}</p>
          </div>
        </div>
        <div className="tt">
          <div className="itt">
            {views}
            <span className="www">
              <FaEye className="ewww" />
            </span>
          </div>
        </div>
        <div className="tdt">
          <div>{creationDate}</div>
        </div>
        <div className="tend">
          <IoSettingsSharp />
        </div>
      </div>
    </div>
  );
}
