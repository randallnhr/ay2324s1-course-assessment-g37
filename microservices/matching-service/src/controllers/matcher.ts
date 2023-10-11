import { v4 as generateUuid } from 'uuid';
import { MatchRequest, OnMatch } from "../types";

export function createMatcher() {

  let waitingRequests: {
    request: MatchRequest,
    onMatch: OnMatch
  }[] = [];

  /**
   * Queues a match request for a user.
   * Calls the onMatch method with the another match request if both requests have the same complexity.
   * Replaces the original waiting request and onMatch method if called twice with the same userId and complexity.
   *
   * @param request Request to queue.
   * @param onMatch Method to call when a match is found.
   */
  function queueRequest(
    request: MatchRequest, 
    onMatch: OnMatch
  ) {
    waitingRequests = waitingRequests.filter(waiting => waiting.request.userId !== request.userId);
    const matchIndex = waitingRequests.findIndex(waiting => {
      return waiting.request.complexity === request.complexity
    });
    if (matchIndex === -1) {
      waitingRequests.push({request, onMatch});
    } else {
      const match = waitingRequests[matchIndex];
      waitingRequests.splice(matchIndex, 1);
      const roomId = generateUuid();
      onMatch({
        ...match.request,
        roomId
      });
      match.onMatch({
        ...request,
        roomId
      });
    }
  }

  return { queueRequest };
}
