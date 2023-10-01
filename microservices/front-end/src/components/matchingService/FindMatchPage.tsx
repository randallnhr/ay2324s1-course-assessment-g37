import { useEffect, useState } from "react";
import useTimer from "../../hooks/useTimer";
import { MatchRequest, QuestionComplexity } from "../types";
import FindMatchForm from "./FindMatchForm";
import styles from "./FindMatchPage.module.css";
import { useUserContext } from "../../UserContext";
import findMatch from "./utility/findMatch";
import FindMatchStatus from "./FindMatchStatus";

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

  useEffect(() => {
    if (!timerIsRunning) {
      return () => {};
    }
    let isCancelled = false;
    const matchRequest: MatchRequest = {
      userId: currentUser.username,
      complexity
    };
    console.log('Starting search:', matchRequest)
    findMatch(matchRequest).then((foundMatch) => {
      if (isCancelled || !foundMatch) {
        return;
      }
      joinRoom(foundMatch);
    })

    const cleanup =  () => {
      console.log('Cancelling search: ', matchRequest);
      resetTimer();
      isCancelled = true;
    }
    return cleanup;
  }, [currentUser.username, complexity, resetTimer, timerIsRunning]);

  useEffect(() => {
    if (timeElapsed >= MAX_WAITING_TIME) {
      resetTimer();
      setMessageToUser('No match found! Try again?')
    }
  }, [timeElapsed, resetTimer]);

  return (
    <>
      <div className={styles.header_container}>
        <h1>Find Match</h1>
      </div>
      <FindMatchForm
        complexity={complexity}
        setComplexity={setComplexity}
        isSearching={timerIsRunning}
        setIsSearching={(newIsSearching: boolean) => {
          if (newIsSearching) {
            startTimer();
            setMessageToUser('');
          } else {
            resetTimer();
          }
        }}
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
