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
  const style = {
    width,
    height,
    borderRadius: "inherit",
  };

  return (
    <>
      <img
        src={src}
        alt={alt}
        style={{
          display: "block",
          visibility: "visible",
          objectFit: "cover",
          ...style,
        }}
        className={className}
        loading="lazy"
        fetchPriority={fetchPriority}
      />
    </>
  );
}

export default MyImage;
