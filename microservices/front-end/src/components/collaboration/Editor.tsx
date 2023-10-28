import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import Quill, { TextChangeHandler } from "quill";
import "quill/dist/quill.snow.css";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Socket } from "socket.io-client";
import classes from "./CollaborationPage.module.css";

interface EditorProps {
  socket: Socket | undefined;
}

const PROGRAMMING_LANGUAGES = [
  "xml",
  "bash",
  "c",
  "cpp",
  "csharp",
  "css",
  "markdown",
  "diff",
  "ruby",
  "go",
  "graphql",
  "ini",
  "java",
  "javascript",
  "json",
  "kotlin",
  "less",
  "lua",
  "makefile",
  "perl",
  "objectivec",
  "php",
  "php-template",
  "plaintext",
  "python",
  "python-repl",
  "r",
  "rust",
  "scss",
  "shell",
  "sql",
  "swift",
  "yaml",
  "typescript",
  "vbnet",
  "wasm",
];

const themeNames = ["atom-one-dark", "github-dark", "monokai", "dark"] as const;

type ThemeNames = (typeof themeNames)[number];

function Editor({ socket }: EditorProps) {
  const [quill, setQuill] = useState<Quill | null>(null);
  const [programmingLanguage, setProgrammingLanguage] = useState("javascript");
  const [theme, setTheme] = useState<ThemeNames>("atom-one-dark");

  useEffect(() => {
    const editor = new Quill("#editor", {
      theme: "snow",
      modules: {
        toolbar: [["code-block"]],
        syntax: {
          highlight: (text: string) => {
            return hljs.highlight(text, { language: programmingLanguage })
              .value;
          },
        },
      },
      placeholder: "Write your code here...",
      scrollingContainer: "#scrolling-container",
    });

    setQuill(editor);

    const editorTextLength = editor.getLength();
    const currentFormat = editor.getFormat(0, editorTextLength);

    if (currentFormat?.["code-block"] !== true) {
      console.log("auto formatting as code-block...");
      editor.formatLine(0, editorTextLength, { "code-block": true });
    }

    // cleanup
    return () => {
      setQuill(null);

      const quillToolbarElements = document
        .getElementById("scrolling-container")
        ?.getElementsByClassName("ql-toolbar ql-snow");

      if (quillToolbarElements === undefined) {
        return;
      }

      // remove leftover HTML elements from the previous Quill.js editor
      for (const el of quillToolbarElements) {
        el.remove();
      }
    };
  }, [programmingLanguage]);

  useEffect(() => {
    if (socket === undefined || quill == null) {
      return;
    }

    socket.on("room count", (count) => {
      if (count == 2) {
        quill.enable();
      } else {
        quill.disable();
      }
    });

    socket.on("request code", (id) => {
      socket.emit("send code", id, quill.getContents());
    });

    socket.on("receive code", (delta) => {
      quill.setContents(delta);
    });

    const textChangeHandler: TextChangeHandler = (
      delta,
      oldContents,
      source
    ) => {
      if (source === "user") {
        socket.emit("client code changes", delta);
      }
    };

    quill.on("text-change", textChangeHandler);

    socket.on("server code changes", (delta) => {
      quill.off("text-change", textChangeHandler);
      quill.updateContents(delta);
      quill.on("text-change", textChangeHandler);
    });
  }, [socket, quill]);

  const handleProgrammingLanguageSelectChange = useCallback(
    (e: SelectChangeEvent) => {
      setProgrammingLanguage(e.target.value);
    },
    []
  );

  const handleThemeSelectChange = useCallback((e: SelectChangeEvent) => {
    setTheme(e.target.value as ThemeNames);
  }, []);

  const getStylesheet = useCallback(() => {
    switch (theme) {
      case "atom-one-dark":
        return (
          <link
            rel="stylesheet"
            href="../../../node_modules/highlight.js/styles/atom-one-dark.css"
          />
        );
      case "github-dark":
        return (
          <link
            rel="stylesheet"
            href="../../../node_modules/highlight.js/styles/github-dark.css"
          />
        );
      case "monokai":
        return (
          <link
            rel="stylesheet"
            href="../../../node_modules/highlight.js/styles/monokai.css"
          />
        );
      case "dark":
        return (
          <link
            rel="stylesheet"
            href="../../../node_modules/highlight.js/styles/dark.css"
          />
        );
    }
  }, [theme]);

  return (
    <>
      <Helmet>{getStylesheet()}</Helmet>
      <div id="scrolling-container" className={classes.scrollingContainer}>
        <FormControl fullWidth style={{ margin: "1rem 0" }}>
          <InputLabel id="programming-language-select-label">
            Programming Language
          </InputLabel>
          <Select
            labelId="programming-language-select-label"
            id="programming-language-select"
            value={programmingLanguage}
            label="Programming Language"
            onChange={handleProgrammingLanguageSelectChange}
          >
            {PROGRAMMING_LANGUAGES.map((each) => (
              <MenuItem key={each} value={each}>
                {each}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth style={{ margin: "1rem 0" }}>
          <InputLabel id="code-editor-theme-select-label">Theme</InputLabel>
          <Select
            labelId="code-editor-theme-select-label"
            id="code-editor-theme-select"
            value={theme}
            label="Theme"
            onChange={handleThemeSelectChange}
          >
            {themeNames.map((each) => (
              <MenuItem key={each} value={each}>
                {each}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div id="editor" className={classes.editor} />
      </div>
    </>
  );
}

export default Editor;
