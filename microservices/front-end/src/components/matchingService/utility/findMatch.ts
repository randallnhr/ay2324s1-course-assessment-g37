import { MatchRequest } from "../../types"
import { io } from "socket.io-client";

function delay(delayInms: number) {
  return new Promise(resolve => setTimeout(resolve, delayInms));
}

const findMatch = async (matchRequest: MatchRequest) => {
  io('127.0.0.1:3002');
  await delay(5000);
  return {
    userId: 'fake user',
    complexity: matchRequest.complexity
  };
  /*const response = JSON.parse(await sendMessage(JSON.stringify(matchRequest)));
  if (isMatchRequest(response)) {
    return response;
  }
  return null;*/
}

export default findMatch