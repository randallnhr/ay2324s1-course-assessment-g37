import { useCallback, useEffect, useState } from "react";
import useTimer from "../../hooks/useTimer";
import { MatchRequest, QuestionComplexity } from "../types";
import FindMatchForm from "./FindMatchForm";
import styles from "./FindMatchPage.module.css";
import { useUserContext } from "../../UserContext";
import FindMatchStatus from "./FindMatchStatus";
import useMatchingService from "../../hooks/useMatchingService";

const MAX_WAITING_TIME = 20;

function joinRoom(allocatedMatch: MatchRequest) {
  //TODO: use collaboration service to join room
  console.log('joining room:', allocatedMatch);
}

const FindMatchPage: React.FC = () => {
  const { currentUser } = useUserContext();
  const [complexity, setComplexity] = useState<QuestionComplexity>('Easy');
  const {
    timeElapsed,
    isRunning: timerIsRunning,
    start: startTimer,
    reset: resetTimer
  } = useTimer();
  const [messageToUser, setMessageToUser] = useState('');

  const onMatch = useCallback((match?: MatchRequest) => {
    if (match && timerIsRunning && complexity == match.complexity) {
      joinRoom(match);
    }
  }, [complexity, timerIsRunning]);
  const findMatch = useMatchingService(onMatch);

  useEffect(() => {
    if (timeElapsed >= MAX_WAITING_TIME) {
      resetTimer();
      setMessageToUser('No match found! Try again?')
    }
  }, [timeElapsed, resetTimer]);

  const toggleSearch = useCallback((newIsSearching: boolean) => {
    if (!newIsSearching) {
      resetTimer();
      return;
    }
    const matchRequest: MatchRequest = {
      userId: currentUser.username,
      complexity: complexity
    }
    findMatch(matchRequest);
    startTimer();
    setMessageToUser('');
  }, [currentUser.username, complexity, startTimer, resetTimer, findMatch])

  return (
    <>
      <div className={styles.header_container}>
        <h1>Find Match</h1>
      </div>
      <FindMatchForm
        complexity={complexity}
        setComplexity={setComplexity}
        isSearching={timerIsRunning}
        setIsSearching={toggleSearch}
      />
      <FindMatchStatus
        messageToUser={
          timerIsRunning
            ? 'Finding suitable match'+ '.'.repeat(timeElapsed % 4)
            : messageToUser
        }
        timeElapsed={timeElapsed}
        timerIsRunning={timerIsRunning}
      />
    </>
  );
};
export default FindMatchPage;
