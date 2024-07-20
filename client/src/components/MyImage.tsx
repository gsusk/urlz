import { useMemo, useState } from "react";

type Props = {
  src: string;
  alt: string;
  width?: string;
  height?: string;
};

function MyImage({ src, alt, width, height }: Props) {
  const [loading, setLoading] = useState(true);

  const handleLoad = () => setLoading(false);

  const config = useMemo(() => {
    return {
      width: width ?? "inherit",
      height: height ?? "inherit",
      borderRadius: "inherit",
    };
  }, [width, height]);

  return (
    <>
      <img
        src={src}
        alt={alt}
        style={{
          display: loading ? "none" : "block",
          ...config,
        }}
        onLoad={handleLoad}
        fetchPriority="low"
      />
      <div
        className="loading-image"
        style={{
          ...config,
          display: loading ? "block" : "inline",
        }}
      ></div>
    </>
  );
}

export default MyImage;
