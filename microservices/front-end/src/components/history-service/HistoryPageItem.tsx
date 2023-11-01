import { CSSProperties } from "react";
import { useAppSelector } from "../../store/hook";
import { HistoryItem } from "../types";
import HistoryPageItemFullText from "./HistoryPageItemFullText";

interface HistoryPageItemProps {
  timestamp: HistoryItem["timestamp"];
  questionId: HistoryItem["questionId"];
  text: HistoryItem["text"];
  programmingLanguage: HistoryItem["programmingLanguage"];
  index: number;
}

const tdStyle: CSSProperties = {
  padding: "0.1rem 1rem",
};

function HistoryPageItem({
  timestamp,
  questionId,
  text,
  programmingLanguage,
  index,
}: HistoryPageItemProps): JSX.Element {
  const question = useAppSelector((state) => {
    const questions = state.questions;
    return questions.find((q) => q._id === questionId);
  });

  return (
    <tr style={{ backgroundColor: index % 2 == 0 ? "#f5f5f5" : "#e6e6e6" }}>
      {question === undefined ? (
        <td style={{ ...tdStyle, fontStyle: "italic" }}>
          This question has been deleted
        </td>
      ) : (
        <td style={tdStyle}>{question.title}</td>
      )}

      <td style={tdStyle}>
        <HistoryPageItemFullText
          text={text}
          programmingLanguage={programmingLanguage}
        />
      </td>
      <td style={{ ...tdStyle, textAlign: "right" }}>
        {new Date(timestamp).toLocaleString("en-GB")}
      </td>
    </tr>
  );
}

export default HistoryPageItem;
