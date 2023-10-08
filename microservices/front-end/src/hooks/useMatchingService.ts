import { useCallback, useMemo } from "react";
import { MatchRequest } from "../components/types";
import useSocket from "./useSocket";
import { isMatchRequest } from "../components/matchingService/utility/isMatchRequest";

const EVENT_FIND_MATCH = 'match';
const EVENT_MATCH_FOUND = 'match found';

/**
 * Handles sending and responding to match requests.
 */
const useMatchingService = (onMatch: (match: MatchRequest) => void) => {
  const eventHandlers = useMemo(() => {
    const wrappedOnMatch = (match?: MatchRequest) => {
      if (isMatchRequest(match)) {
        console.log('Match found!', JSON.stringify(match));
        onMatch(match);
      } else {
        console.log('Invalid match response from server:', match);
      }
    }

    return {
      [EVENT_MATCH_FOUND]: wrappedOnMatch
    };
  }, [onMatch])

  const matchSocket = useSocket('127.0.0.1:8080', eventHandlers);

  const findMatch = useCallback((matchRequest: MatchRequest) => {
    matchSocket.emit(EVENT_FIND_MATCH, matchRequest);
  }, [matchSocket])

  return findMatch;
}

export default useMatchingService;
