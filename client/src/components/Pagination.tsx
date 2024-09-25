import { PaginationPropTypes, usePagination } from "../hooks/usePagination";

export function Pagination({
  totalCount,
  currentPage,
  pageSize,
}: PaginationPropTypes) {
  const paginationRange = usePagination({ totalCount, currentPage, pageSize });
  console.log("pagination upper comp", paginationRange);
  return (
    <div
      style={{
        width: "100%",
        marginBottom: "3rem",
      }}
    >
      <button disabled={currentPage === 1}>Left</button>
      {paginationRange?.map((page, index) => {
        return (
          <div key={index}>
            <button
              disabled={page === "..." || currentPage === page}
              style={{
                background: "transparent",
                border: "none",
                color: "red",
              }}
            >
              {page}
            </button>
          </div>
        );
      })}
      <button disabled={currentPage === Math.floor(totalCount / pageSize)}>
        Right
      </button>
    </div>
  );
}
