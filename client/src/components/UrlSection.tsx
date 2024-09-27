import { ImQrcode } from "react-icons/im";
import { IoEarth } from "react-icons/io5";
import { IoSettingsSharp } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import "./Url.css";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

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
  const [isOpen, setIsOpen] = useState(false);
  const settingRef = useRef<HTMLDivElement>(null);
  const composedUrl = `http://localhost:8081/${shortenedUrl}`;

  const toggleMenu = (e: React.FormEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    const handleCLickOutside = (event: MouseEvent) => {
      if (
        settingRef.current &&
        !settingRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleCLickOutside, true);
    return () => {
      document.removeEventListener("click", handleCLickOutside, true);
    };
  }, []);

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
            <a className="url-il" href={originalUrl}>
              {originalUrl}
            </a>
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
        <div className="tend" onClick={toggleMenu} ref={settingRef}>
          <IoSettingsSharp />
          {isOpen && (
            <div className="tend-dropdown-menu">
              <NavLink className="navlink-sett" to={""}>
                Copy
              </NavLink>
              <NavLink
                className="navlink-sett"
                to={`/stats?url=${shortenedUrl}`}
              >
                Stats
              </NavLink>
              <NavLink className="navlink-sett" to={"/"}>
                Delete
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
