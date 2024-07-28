import { useEffect, useState } from "react";

type Props = {
  src: string;
  alt: string;
  width?: string;
  height?: string;
  fetchPriority?: "high" | "low" | "auto";
  className?: string;
};

function MyImage({
  src,
  alt,
  className,
  fetchPriority,
  width = "inherit",
  height = "inherit",
}: Props) {
  const [loading, setLoading] = useState(true);
  const handleLoad = () => setLoading(false);

  const style = {
    width,
    height,
    borderRadius: "inherit",
  };

  useEffect(() => {
    setLoading(true);
  }, [src]);

  return (
    <>
      <img
        src={src}
        alt={alt}
        style={{
          display: loading ? "none" : "block",
          objectFit: "cover",
          ...style,
        }}
        className={className}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleLoad}
        fetchPriority={fetchPriority}
      />
      {loading && <div className="loading-image" style={style}></div>}
    </>
  );
}

export default MyImage;
