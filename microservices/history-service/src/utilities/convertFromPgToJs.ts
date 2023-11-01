import { JsHistoryItem, PgHistoryItem } from "../types";

export function convertFromPgToJs(pgHistoryItem: PgHistoryItem): JsHistoryItem {
  const jsHistoryItem: JsHistoryItem = {
    username: pgHistoryItem.username,
    timestamp: pgHistoryItem.timestamp,
    questionId: pgHistoryItem.question_id,
    text: pgHistoryItem.text,
    programmingLanguage: pgHistoryItem.programming_language,
  };

  return jsHistoryItem;
}
