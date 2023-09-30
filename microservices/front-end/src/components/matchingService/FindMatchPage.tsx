import FindMatchForm from "./FindMatchForm";
import styles from "./FindMatchPage.module.css";

const FindMatchPage: React.FC = () => {

  return (
    <div>
      <div className={styles.header_container}>
        <h1>Find Match</h1>
      </div>
      <FindMatchForm />
    </div>
  );
};
export default FindMatchPage;
