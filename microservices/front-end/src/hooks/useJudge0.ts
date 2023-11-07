import axios from "axios";
import { useCallback } from "react";

interface Output {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string;
  time: string;
}

const AUTH_SERVICE_URL =
  import.meta.env.VITE_AUTH_SERVICE_URL ?? "http://localhost:8080";

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
  const encode = (str: string) => {
    if (str == null) {
      return null;
    }
    return btoa(unescape(encodeURIComponent(str || "")));
  };

  const decode = (str: string) => {
    if (str == null) {
      return null;
    }
    var escaped = escape(atob(str || ""));
    try {
      return decodeURIComponent(escaped);
    } catch {
      return unescape(escaped);
    }
  };

  const sendSubmission = useCallback(
    async (code: string, language: string) => {
      try {
        if (code.length <= 1) {
          return {
            stdout: null,
            stderr: null,
            compile_output: "No code to run",
            message: "",
            time: "",
          } as Output;
        }
        const language_id = languages.get(language);
        const { data } = await axios.post(
          AUTH_SERVICE_URL + "/api/execute",
          {
            source_code: encode(code),
            language_id: language_id,
          },
          { withCredentials: true }
        );
        return {
          stdout: decode(data.stdout),
          stderr: decode(data.stderr),
          compile_output: decode(data.compile_output),
          message: decode(data.message),
          time: data.time,
        } as Output;
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
