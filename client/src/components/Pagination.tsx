import { useMemo } from "react";

type PaginationPropTypes = {
  totalCount: number;
  currentPage: number;
  pageSize: number;
};

export function Pagination({
  totalCount,
  currentPage,
  pageSize,
}: PaginationPropTypes) {
  const paginationRange = useMemo(() => {
    const DOTS = "...";
    const totalPageCount = Math.ceil(totalCount / pageSize);
    const totalPageNumbers = 1 + 5;
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    const leftSiblingIdx = Math.max(1, currentPage - 1);
    const rightSiblingIdx = Math.min(totalPageCount, currentPage + 1);

    const showDotsLeft = leftSiblingIdx > 2;
    const showDotsRight = rightSiblingIdx < totalPageCount - 2;

    if (!showDotsLeft && showDotsRight) {
      const leftCount = 3;
      const leftRange = range(1, leftCount);
      return [...leftRange, "...", totalPageCount];
    }
  }, [totalCount, currentPage, pageSize]);
  return <div>pagination</div>;
}

const range = (start: number, end: number) => {
  const length = end - start + 1;
  /*
      Create an array of certain length and set the elements within it from
    start value to end value.
  */
  return Array.from({ length }, (_, idx) => idx + start);
};
