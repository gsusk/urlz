import { FaLink } from "react-icons/fa";
import { LuBrush } from "react-icons/lu";
import "./shortener.css";
import { useEffect, useState } from "react";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { IoMdOpen } from "react-icons/io";
import {
  type UrlErrorResponse,
  generateCustomShortUrl,
  generateShortUrl,
} from "../services/shorten";
import { errorHandler, serializeZodError } from "../utils/errorparser";
import { urlSchema } from "../validation/url";

function Shortener() {
  const [form, setForm] = useState({ url: "", customUrl: "" });
  const [formError, setFormError] = useState<UrlErrorResponse["errors"]>({});
  const [loading, setLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formError.url || formError.customUrl) {
      setFormError({});
    }
    const id = e.currentTarget.id;
    const value = e.currentTarget.value;
    setForm((prev) => {
      return {
        ...prev,
        [id]: value,
      };
    });
  };

  const handleShortenRequest = async ({
    url,
    customUrl,
  }: {
    url: string;
    customUrl?: string;
  }) => {
    if (customUrl) {
      return await generateCustomShortUrl({ url, customUrl });
    } else {
      return await generateShortUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.keys(formError).length > 0) return;
    setLoading(true);
    try {
      let formdata = form as { url: string; customUrl?: string };
      if (formdata.customUrl === "") {
        const { customUrl: _, url } = formdata;
        formdata = { url };
      }
      const result = urlSchema.safeParse(formdata);
      if (!result.success) {
        const errors = serializeZodError(result.error);
        setFormError(errors);
        return;
      }

      const data = await handleShortenRequest(result.data);
      setShortenedUrl(data.shortenedUrl);
    } catch (error) {
      const { errors } = errorHandler<UrlErrorResponse["errors"]>(
        error as Error
      );
      setFormError(errors);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      setShortenedUrl(null);
    };
  }, []);

  return (
    <section className="outer-shortener-container">
      {shortenedUrl ? (
        <div className="shortener-container">
          <div>
            <label htmlFor="original" className="shortener-label">
              <FaLink className="icon-label-shortener" />
              <span>Original Url</span>
            </label>
          </div>
          <input
            id="original"
            type="text"
            readOnly
            value={form.url}
            className={`shortener-input`}
          />
          <div className="shortener-err-div"></div>
          <div>
            <label htmlFor="short-url-response" className="shortener-label">
              <FaWandMagicSparkles className="icon-label-shortener" />
              <span>Short Url</span>
            </label>
          </div>
          <input
            id="short-url-response"
            type="text"
            value={shortenedUrl}
            readOnly
            className={`shortener-input`}
          />
          <div className="shortener-err-div"></div>
          <div className="utils-url">
            <a
              className="shortener-label __bg"
              href={shortenedUrl}
              target="_blank"
            >
              <IoMdOpen />
            </a>
            <button
              className="button __vmc"
              onClick={() => setShortenedUrl(null)}
            >
              Back
            </button>
          </div>
        </div>
      ) : (
        <form className="shortener-container" onSubmit={handleSubmit}>
          <label htmlFor="url" className="shortener-label">
            <FaLink className="icon-label-shortener" />
            <span>Shorten a long URL</span>
          </label>
          <input
            type="text"
            name="url"
            id="url"
            className={`shortener-input ${formError.url && "__err"}`}
            value={form.url}
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
      )}
    </section>
  );
}

export default Shortener;
