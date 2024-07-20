import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  width: string;
  height: string;
};

function MyImage({ src, alt, width, height }: Props) {
  const [loading, setLoading] = useState(true);

  const handleLoad = () => setLoading(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={{
          display: loading ? "none" : "block",
          width,
          height,
          borderRadius: "inherit",
        }}
        onLoad={handleLoad}
        fetchPriority="low"
      />
      <div
        className="loading-image"
        style={{ width, height, display: loading ? "block" : "none" }}
      ></div>
    </>
  );
}

export default MyImage;
