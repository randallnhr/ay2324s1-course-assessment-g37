import { FC, useState } from "react";
import { useUserContext } from "../../UserContext";
import { QuestionComplexity } from "../types";

import styles from "./FindMatchForm.module.css";

function handleFindMatch(userId: string, complexity: QuestionComplexity) {
  console.log(userId, complexity);
}

const FindMatchForm: FC = () => {
  const { currentUser } = useUserContext();
  const [complexity, setComplexity] = useState<QuestionComplexity>('Easy');
  
  return (
    <form
      className={styles.form_container}
      onSubmit={(e) => {
        e.preventDefault();
        handleFindMatch(currentUser.username, complexity);
      }}
    >
      <h2 className={styles.form_header}>Match Details</h2>
      <div>
        <label className={styles.form_label}>Complexity</label>
        <select
          className={styles.form_select}
          value={complexity}
          onChange={(e) => setComplexity(e.target.value as QuestionComplexity)}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
      <button className={styles.action_button} type="submit">
        Find Match
      </button>
    </form>
  );  
}

export default FindMatchForm;
