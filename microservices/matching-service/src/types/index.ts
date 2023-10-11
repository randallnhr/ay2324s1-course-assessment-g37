export type Complexity = 'Easy' | 'Medium' | 'Hard';

export type MatchRequest = {
  userId: string
  complexity: Complexity
}

export type MatchResponse = MatchRequest & {
  roomId: string
}

export type OnMatch = (matchedResponse: MatchResponse) => void
