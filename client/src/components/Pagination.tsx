import { PaginationPropTypes, usePagination } from "../hooks/usePagination";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";

type PaginationPagePropTypes = PaginationPropTypes & {
  handlePageChange: (value: number) => void;
};

export function Pagination({
  totalCount,
  currentPage,
  pageSize,
  handlePageChange,
}: PaginationPagePropTypes) {
  const paginationRange = usePagination({ totalCount, currentPage, pageSize });
  return (
    <div
      style={{
        width: "100%",
        margin: "5rem 0",
        display: "flex",
        justifyContent: "center",
        columnGap: "1rem",
      }}
    >
      <button
        disabled={currentPage === 1}
        className="button __vsc"
        onClick={() => handlePageChange(currentPage - 1)}
      >
        <MdNavigateBefore />
      </button>
      {paginationRange?.map((page, index) => {
        return (
          <div key={index}>
            <button
              disabled={page === "..." || currentPage === page}
              className={`button __vsc pagbutt ${page === "..." ? "dot" : ""}`}
              onClick={() => typeof page !== "string" && handlePageChange(page)}
            >
              {page}
            </button>
          </div>
        );
      })}
      <button
        disabled={currentPage === Math.ceil(totalCount / pageSize)}
        onClick={() => handlePageChange(currentPage + 1)}
        className="button __vsc"
      >
        <MdNavigateNext />
      </button>
    </div>
  );
}
