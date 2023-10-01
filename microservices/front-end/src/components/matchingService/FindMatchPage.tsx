import { useEffect, useState } from "react";
import useTimer from "../../hooks/useTimer";
import { MatchRequest, QuestionComplexity } from "../types";
import FindMatchForm from "./FindMatchForm";
import styles from "./FindMatchPage.module.css";
import { useUserContext } from "../../UserContext";

const MAX_WAITING_TIME = 20;

function delay(delayInms: number) {
  return new Promise(resolve => setTimeout(resolve, delayInms));
}

async function findMatch(matchRequest: MatchRequest): Promise<MatchRequest> {
  await delay(5000);
  return {
    userId: 'fake user',
    complexity: matchRequest.complexity
  };
}

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
      if (isCancelled) {
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
    <div>
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
      <div className={styles.display_container}>
        <div>
          { messageToUser }
        </div>
        {
          !timerIsRunning
            ? <></>
            : (
                <>
                  <div>
                    Finding suitable match{'.'.repeat(timeElapsed % 4)}
                  </div>
                  <div>
                    Time elapsed:{' '}{timeElapsed}s
                  </div>
                </>            
            )
        }
      </div>
      
    </div>
  );
};
export default FindMatchPage;
