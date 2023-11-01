import { useEffect } from "react";
import { useUserContext } from "../../UserContext";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import { fetchHistory } from "../../store/slices/historySlice";
import style from "./HistoryPage.module.css";
import HistoryPageItem from "./HistoryPageItem";

function HistoryPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const { currentUser } = useUserContext();

  useEffect(() => {
    dispatch(fetchHistory(currentUser.username));
  }, [dispatch, currentUser]);

  const historyItems = useAppSelector((state) => state.history);

  return (
    <>
      <h1 style={{ textAlign: "left" }}>History</h1>
      <table
        style={{
          margin: "3rem auto",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <td className={style["question-title"]}>Question Title</td>
            <td className={style["code"]}>Code</td>
            <td className={style["attempt-time"]}>Attempt Time</td>
          </tr>
        </thead>
        <tbody>
          {historyItems.map((each, index) => (
            <HistoryPageItem
              key={`${each.username}::${each.timestamp}::${each.questionId}`}
              index={index}
              timestamp={each.timestamp}
              questionId={each.questionId}
              text={each.text}
              programmingLanguage={each.programmingLanguage}
            />
          ))}
        </tbody>
      </table>

      {historyItems.length === 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontStyle: "italic",
          }}
        >
          There are no attempts
        </div>
      )}
    </>
  );
}

export default HistoryPage;
