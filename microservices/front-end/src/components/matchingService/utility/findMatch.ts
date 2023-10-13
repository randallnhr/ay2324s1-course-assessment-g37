import { MatchRequest } from "../../types"

function delay(delayInms: number) {
  return new Promise(resolve => setTimeout(resolve, delayInms));
}

const findMatch = async (matchRequest: MatchRequest) => {
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