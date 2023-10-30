import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";

interface Output {
  stdout: string;
  stderr: string;
  compile_output: string;
  message: string;
  time: string;
}

const JUDGE0_URL = import.meta.env.VITE_JUDGE0_URL ?? "http://localhost:2358";

const languages: Map<string, number> = new Map([
  ["bash", 46],
  ["c", 50],
  ["cpp", 54],
  ["csharp", 51],
  ["ruby", 72],
  ["go", 60],
  ["java", 62],
  ["javascript", 63],
  ["kotlin", 78],
  ["lua", 64],
  ["perl", 85],
  ["objectivec", 79],
  ["php", 68],
  ["python", 71],
  ["r", 80],
  ["rust", 73],
  ["sql", 82],
  ["swift", 83],
  ["typescript", 74],
  ["vbnet", 84],
]);

const useJudge0 = () => {
  //   const [languages, setLanguages] = useState<Language[]>([]);
  //   useEffect(() => {
  //     const fetchLanguages = async () => {
  //       const { data } = await axios.get(JUDGE0_URL + "/languages");
  //       setLanguages(data as Language[]);
  //     };
  //     fetchLanguages();
  //   }, []);

  const sendSubmission = useCallback(
    async (code: string, language: string) => {
      try {
        const language_id = languages.get(language);
        const { data } = await axios.post(
          JUDGE0_URL + "/submissions",
          {
            source_code: code,
            language_id: language_id,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            params: {
              wait: "true",
            },
          }
        );
        return data as Output;
      } catch (error) {
        console.log(error);
      }
    },
    [languages]
  );

  const checkLanguage = useCallback(
    (name: string) => {
      if (languages.has(name)) {
        return languages.get(name);
      }
      return 0;
    },
    [languages]
  );

  return { sendSubmission, checkLanguage };
};

export default useJudge0;
