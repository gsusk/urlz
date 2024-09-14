import { ImQrcode } from "react-icons/im";
import { IoEarth } from "react-icons/io5";
import "./Url.css";

export default function Url() {
  return (
    <div className="urli-container">
      <div className="url-fp">
        <div>
          <div className="url-flex lc">
            <ImQrcode className="font-rq" />
            <a
              target="_blank"
              href="https://t.ly/G4L7b"
              referrerPolicy="no-referrer"
            >
              t.ly/bJsdnP
            </a>
          </div>
          <div className="url-flex">
            <IoEarth className="url-il" />
            <p className="url-il">original url</p>
          </div>
        </div>
        <div>
          <div>1 view</div>
        </div>
        <div>
          <div>22/12/2024</div>
        </div>
        <div>Extra</div>
      </div>
    </div>
  );
}
