import { useMemo } from "react";

export type PaginationPropTypes = {
  totalCount: number;
  currentPage: number;
  pageSize: number;
};

export function usePagination({
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
      return [...leftRange, DOTS, totalPageCount];
    }
    if (showDotsLeft && !showDotsRight) {
      const rightCount = 3;
      const rightRange = range(totalPageCount - rightCount + 1, totalPageCount);
      return [1, DOTS, ...rightRange];
    }
    if (showDotsLeft && showDotsRight) {
      const middle = range(leftSiblingIdx, rightSiblingIdx);
      return [1, DOTS, ...middle, DOTS, totalPageCount];
    }
    console.log("sds");
  }, [totalCount, currentPage, pageSize]);
  return paginationRange;
}

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};
