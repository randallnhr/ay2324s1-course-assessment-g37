import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import Quill, { TextChangeHandler } from "quill";
import "quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import classes from "./CollaborationPage.module.css";
import prettier from "prettier/standalone";
import BabelPlugin from "prettier/plugins/babel";
import JSPlugin from "prettier/plugins/estree";
import { Button } from "@mui/material";

interface EditorProps {
  socket: Socket | undefined;
}

function Editor({ socket }: EditorProps) {
  const [quill, setQuill] = useState<Quill | null>();

  useEffect(() => {
    if (socket === undefined) {
      return;
    }

    const editor = new Quill("#editor", {
      theme: "snow",
      modules: {
        toolbar: [["code-block"]],
        syntax: {
          highlight: (text: string) => {
            return hljs.highlightAuto(text, ["javascript", "python"]).value;
          },
        },
      },
      placeholder: "Write your code here...",
      scrollingContainer: "#scrolling-container",
    });

    editor.formatText(0, 100, { "code-block": true });

    socket.on("room count", (count) => {
      if (count == 2) {
        editor.enable();
      } else {
        editor.disable();
      }
    });

    socket.on("request code", (id) => {
      socket.emit("send code", id, editor.getContents());
    });

    socket.on("receive code", (delta) => {
      editor.setContents(delta);
    });

    const textChangeHandler: TextChangeHandler = (
      delta,
      oldContents,
      source
    ) => {
      if (source === "user") {
        editor.formatText(0, editor.getLength(), { "code-block": true });
        socket.emit("client code changes", delta);
      }
    };

    editor.on("text-change", textChangeHandler);

    socket.on("server code changes", (delta) => {
      editor.off("text-change", textChangeHandler);
      editor.updateContents(delta);
      editor.on("text-change", textChangeHandler);
    });

    socket.on("server code format", (content) => {
      editor.off("text-change", textChangeHandler);
      editor.setContents(content);
      editor.formatText(0, editor.getLength(), { "code-block": true });
      editor.on("text-change", textChangeHandler);
    });

    setQuill(editor);

    // cleanup
    return () => setQuill(null);
  }, [socket]);

  return (
    <>
      <Button
        onClick={() => {
          if (quill == undefined || socket == undefined) {
            return;
          }
          prettier
            .format(quill.getText(), {
              parser: "babel",
              plugins: [BabelPlugin, JSPlugin],
              semi: false,
            })
            .then((formattedCode) => {
              console.log(formattedCode);
              quill.setText(formattedCode);
              quill.formatText(0, quill.getLength(), { "code-block": true });
              socket.emit("client code format", quill.getContents());
            });
        }}
      >
        {" "}
        Format Code{" "}
      </Button>
      <div id="scrolling-container" className={classes.scrollingContainer}>
        <div id="editor" className={classes.editor} />
      </div>
    </>
  );
}

export default Editor;
