import type { ScanDataType } from "../components/ClickScan";

export const fillMissingDates = (data: ScanDataType[]) => {
  const result = [];
  const dateMap = new Map();

  // Create a map of existing dates
  data.forEach((item) => {
    dateMap.set(new Date(item.date).toDateString(), item.views);
  });

  const currentDate = new Date();
  const startDate = new Date();
  // Loop through the last 30 days
  startDate.setDate(currentDate.getDate() - 30);

  while (startDate <= currentDate) {
    const dateString = startDate.toDateString();

    if (dateMap.has(dateString)) {
      result.push({
        date: startDate.getTime(), // Convert date to timestamp (ms)
        views: dateMap.get(dateString),
      });
    } else {
      result.push({
        date: startDate.getTime(),
        views: 0, // Add missing date with 0 views
      });
    }

    // Move to the next day
    startDate.setDate(startDate.getDate() + 1);
  }

  return result;
};
