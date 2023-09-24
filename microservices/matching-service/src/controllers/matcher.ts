import { MatchRequest, OnMatch } from "../types";

export function createMatcher() {
  const watitingRequests: [MatchRequest, OnMatch][] = [];

  function queueRequest(
    request: MatchRequest, 
    onMatch: OnMatch
  ) {
    for (let [otherRequest, otherOnMatch] of watitingRequests) {
      if (request.complexity !== otherRequest.complexity) {
        continue;
      }
      onMatch(otherRequest);
      otherOnMatch(request);
      return;
    }
    watitingRequests.push([request, onMatch]);
  }

  return { queueRequest };
}
