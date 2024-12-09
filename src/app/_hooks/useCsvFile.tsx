import { useState, useEffect, useTransition } from "react";
import Papa from "papaparse";

export function useCSVFile<T>(fileName: string, attribute = null) {
  const [isLoading, startFetchingData] = useTransition();
  const [csvData, setCsvData] = useState<T[]>([]);

  useEffect(() => {
    startFetchingData(async () => {
      const response = await fetch(fileName); // Fetch CSV from public folder
      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      let result = attribute !== null ? (attribute ?? [].join(",") + "\n") : "";
      let done = false;

      while (!done && reader) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        result += decoder.decode(value, { stream: true });
      }

      // Parse the CSV
      Papa.parse<T>(result, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          // console.log(results.data);
          if (results.errors.length > 0) {
            console.error(results.errors);
          }
          if (results.data) {
            setCsvData(results.data); // Set parsed CSV data
          }
        },
      });
    });
  }, [fileName]);

  return { csvData, isLoading };
}
