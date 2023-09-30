import { MatchRequest } from "../types";
import FindMatchForm from "./FindMatchForm";
import styles from "./FindMatchPage.module.css";

function joinRoom(allocatedMatch: MatchRequest) {
  //TODO: use collaboration service to join room
  console.log('joining room:', allocatedMatch);
}

const FindMatchPage: React.FC = () => {

  return (
    <div>
      <div className={styles.header_container}>
        <h1>Find Match</h1>
      </div>
      <FindMatchForm joinRoom={joinRoom}/>
    </div>
  );
};
export default FindMatchPage;
