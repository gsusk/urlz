import { FaLink } from "react-icons/fa";
import { LuBrush } from "react-icons/lu";
function Shortener() {
  return (
    <section>
      <div className="">
        <label htmlFor="long_url">
          <div>
            <FaLink />
          </div>
          <span>Shorten a long URL</span>
        </label>
        <input type="text" name="long_url" />
        <label htmlFor="">
          <div>
            <LuBrush />
          </div>
          <span></span>
        </label>
        <input type="text" />
        <input type="submit" />
      </div>
    </section>
  );
}

export default Shortener;
