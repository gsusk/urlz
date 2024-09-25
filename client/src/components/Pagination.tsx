import { usePagination } from "../hooks/usePagination";

export type PaginationPropTypes = {
  totalCount: number;
  currentPage: number;
  pageSize: number;
};

export function Pagination({
  totalCount,
  currentPage,
  pageSize,
}: PaginationPropTypes) {
  const paginationRange = usePagination({ totalCount, currentPage, pageSize });
  console.log("pagination upper comp");
  return <div style={{ width: "100%" }}>sdsd</div>;
}
