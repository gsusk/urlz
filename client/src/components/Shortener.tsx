import { FaLink } from "react-icons/fa";
import { LuBrush } from "react-icons/lu";
import "./shortener.css";

function Shortener() {
  return (
    <section>
      <div className="shortener-container">
        <label htmlFor="longUrl">
          <FaLink />
          <span>Shorten a long URL</span>
        </label>
        <input
          type="text"
          name="longUrl"
          id="longUrl"
          className="long-url-input"
        />
        <label htmlFor="customUrl">
          <LuBrush />
          <span>Custom URL</span>
        </label>
        <input
          type="text"
          name="customUrl"
          id="customUrl"
          className="custom-url-inut"
        />

        <input type="submit" />
      </div>
    </section>
  );
}

export default Shortener;
