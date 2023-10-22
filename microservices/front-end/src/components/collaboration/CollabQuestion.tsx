import { Question } from "../types";
import { useEffect, useState } from "react";

function CollabQuestion() {
  const QUESTION_SERVICE_URL = "http://localhost:3001";
  const [question, setQuestion] = useState<Question>();

  const init = async () => {
    const res = await fetch("/api/questions/651a6f454386c83a839e15fa");
    const temp = await res.json();
    setQuestion(temp);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      {question && (
        <div style={{ width: "50%", margin: "10px" }}>
          {question.title}
          <div dangerouslySetInnerHTML={{ __html: question.description }} />
        </div>
      )}
    </>
  );
}

export default CollabQuestion;
