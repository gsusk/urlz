import { FaLink } from "react-icons/fa";
import { LuBrush } from "react-icons/lu";
import "./shortener.css";
import { useState } from "react";
import {
  type UrlErrorResponse,
  generateCustomShortUrl,
  generateShortUrl,
} from "../services/shorten";
import { z } from "zod";

const urlSchema = z.object({
  url: z
    .string()
    .trim()
    .min(5, { message: "Url must be at least 5 letters long" })
    .url({ message: "Must be a valid url" }),
});

const urlCustomSchema = urlSchema
  .pick({
    url: true,
  })
  .and(
    z.object({
      customUrl: z
        .string()
        .trim()
        .min(4, { message: "Alias must be at least 4 letters long" }),
    })
  );

function Shortener() {
  const [form, setForm] = useState({ url: "", customUrl: "" });
  const [formError, setFormError] = useState<UrlErrorResponse["errors"]>({});
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.keys(formError).length > 0) return;

    setLoading(true);
    try {
      const schema = form.customUrl ? urlCustomSchema : urlSchema;
      const result = schema.safeParse(form);

      if (!result.success) {
        const errors = result.error.errors.reduce((acc, err) => {
          acc[err.path[0]] = err.message;
          return acc;
        }, {} as Record<string, string>);

        setFormError(errors);
        return;
      }

      const data = form.customUrl
        ? await generateCustomShortUrl(
            result.data as { url: string; customUrl: string }
          )
        : await generateShortUrl(result.data.url);

      if ("errors" in data) {
        setFormError(data.errors);
      } else {
        console.log("Shortened URL:", data.shortenedUrl); // Handle success
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="outer-shortener-container">
      <form className="shortener-container" onSubmit={handleSubmit}>
        <label htmlFor="url" className="shortener-label">
          <FaLink className="icon-label-shortener" />
          <span>Shorten a long URL</span>
        </label>
        <input
          type="text"
          name="url"
          id="url"
          className={`shortener-input ${formError && "__err"}`}
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
    </section>
  );
}

export default Shortener;
