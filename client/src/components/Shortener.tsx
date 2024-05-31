import { FaLink } from "react-icons/fa";
import { LuBrush } from "react-icons/lu";
import "./shortener.css";
import { useState } from "react";

function Shortener() {
  const [form, setform] = useState({ longUrl: "", customUrl: "" });
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const id = e.currentTarget.id;
    const value = e.currentTarget.value;
    setform((prev) => {
      return {
        ...prev,
        [id]: value,
      };
    });
  };

  return (
    <section className="outer-shortener-container">
      <form className="shortener-container">
        <label htmlFor="longUrl" className="shortener-label">
          <FaLink className="icon-label-shortener" />
          <span>Shorten a long URL</span>
        </label>
        <input
          type="text"
          name="longUrl"
          id="longUrl"
          className="long-url-input "
          value={form.longUrl}
          onChange={handleChange}
          placeholder="Enter long url"
        />
        <label htmlFor="customUrl" className="shortener-label">
          <LuBrush className="icon-label-shortener" />
          <span>Custom URL</span>
        </label>
        <input
          type="text"
          name="customUrl"
          id="customUrl"
          className="custom-url-input"
          value={form.customUrl}
          onChange={handleChange}
          placeholder="Enter Custom Alias"
        />

        <button type="submit" className="button __vmc shortener-submit">
          Shorten
        </button>
      </form>
    </section>
  );
}

export default Shortener;
