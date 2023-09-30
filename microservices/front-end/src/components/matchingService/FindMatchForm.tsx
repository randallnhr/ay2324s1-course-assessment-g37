import { FC, useEffect, useState } from "react";
import { useUserContext } from "../../UserContext";
import { MatchRequest, QuestionComplexity } from "../types";

import styles from "./FindMatchForm.module.css";

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

type MatchFormProps = {
  joinRoom: (matchRequest: MatchRequest) => void
}

const FindMatchForm: FC<MatchFormProps> = ({
  joinRoom
}) => {
  const { currentUser } = useUserContext();
  const [complexity, setComplexity] = useState<QuestionComplexity>('Easy');
  const [isSearching, setIsSearching] = useState(false);

  const handleToggleSearch = () => {
    setIsSearching(!isSearching);
  }

  useEffect(() => {
    if (!isSearching) {
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

      console.log('Cancelling search: ', matchRequest)
      isCancelled = true;
    }
    return cleanup;
  }, [currentUser.username, complexity, isSearching, joinRoom]);

  return (
    <form
      className={styles.form_container}
      onSubmit={(e) => {
        e.preventDefault();
        handleToggleSearch();
      }}
    >
      <h2 className={styles.form_header}>Match Details</h2>
      <div>
        <label className={styles.form_label}>Complexity</label>
        <select
          className={styles.form_select}
          value={complexity}
          onChange={(e) => setComplexity(e.target.value as QuestionComplexity)}
          disabled={isSearching}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
      <button className={styles.action_button} type="submit">
        {
          isSearching ? 'Cancel' : 'Find Match'
        }
      </button>
    </form>
  );  
}

export default FindMatchForm;
