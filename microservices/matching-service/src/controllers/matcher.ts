import { Complexity, MatchRequest, OnMatch } from "../types";

export function createMatcher() {

  const waitingRequests: {
    [difficulty in Complexity]: {
      request: MatchRequest,
      onMatch: OnMatch
      } | null
  } = {
    'Easy': null,
    'Medium': null,
    'Hard': null
  };

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
    const waitingRequest = waitingRequests[request.complexity];
    if (!waitingRequest) {
      waitingRequests[request.complexity] = {
        request,
        onMatch
      }
      return;
    }
    onMatch(waitingRequest.request);
    waitingRequest.onMatch(request);
    waitingRequests[request.complexity] = null;
  }

  return { queueRequest };
}
