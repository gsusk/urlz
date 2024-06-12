import { FaLink } from "react-icons/fa";
import { LuBrush } from "react-icons/lu";
import "./shortener.css";
import { useState } from "react";
import { generateCustomShortUrl, generateShortUrl } from "../services/shorten";
import axios from "axios";

function Shortener() {
  const [form, setform] = useState({ longUrl: "", customUrl: "" });
  const [formError, setFormError] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formError.url || formError.customUrl) {
      setFormError({});
    }
    const id = e.currentTarget.id;
    const value = e.currentTarget.value;
    setform((prev) => {
      return {
        ...prev,
        [id]: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formError);
    if (Object.keys(formError).length > 0) {
      return;
    }
    setLoading(true);

    if (form.customUrl && form.customUrl.trim() !== "") {
      const res = await generateCustomShortUrl(form);
      setLoading(false);
      console.log(res);
      return;
    }
    const res = await generateShortUrl(form.longUrl);
    setLoading(false);
    console.log(res.shortUrl);

    if (axios.isAxiosError(err)) {
      console.log("yes");
      setFormError(err.response?.data.errors || { url: "Internal Error" });
    }
    setLoading(false);
    setFormError({ url: "Internal Error" });
    console.error(err.response?.data, "hihihihi");
  };

  return (
    <section className="outer-shortener-container">
      <form className="shortener-container" onSubmit={handleSubmit}>
        <label htmlFor="longUrl" className="shortener-label">
          <FaLink className="icon-label-shortener" />
          <span>Shorten a long URL</span>
        </label>
        <input
          type="text"
          name="longUrl"
          id="longUrl"
          className={`shortener-input ${formError.url && "__err"}`}
          value={form.longUrl}
          onChange={handleChange}
          placeholder="Enter long url"
        />
        <div className="shortener-err-div">{formError.url}</div>
        <label htmlFor="customUrl" className="shortener-label">
          <LuBrush className="icon-label-shortener" />
          <span>Custom URL</span>
        </label>
        <input
          type="text"
          name="customUrl"
          id="customUrl"
          className={`shortener-input ${formError.customUrl && "__err"}`}
          value={form.customUrl}
          onChange={handleChange}
          placeholder="Enter Custom Alias"
        />
        <div className="shortener-err-div">{formError.customUrl}</div>
        <button
          type="submit"
          className="button __vmc shortener-submit"
          disabled={loading}
        >
          {loading ? <div className="loader"> </div> : "Shorten"}
        </button>
      </form>
    </section>
  );
}

export default Shortener;
