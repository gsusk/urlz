import { ImQrcode } from "react-icons/im";
import { IoEarth } from "react-icons/io5";
import "./Url.css";

export default function Url() {
  return (
    <div className="urli-container">
      <div className="url-fp">
        <div>
          <div className="url-fp">
            <ImQrcode />
            <a target="_blank" href="https://t.ly/G4L7b" referrerPolicy="">
              t.ly/bJsdnP
            </a>
          </div>
          <div className="url-fp">
            <IoEarth className="url-il" />
            <p className="url-il">original url</p>
          </div>
        </div>
        <div>
          <div>number</div>
        </div>
        <div>
          <div>date</div>
        </div>
        <div>adhs</div>
      </div>
    </div>
  );
}
