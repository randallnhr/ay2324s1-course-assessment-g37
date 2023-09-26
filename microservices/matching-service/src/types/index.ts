export type Complexity = 'Easy' | 'Medium' | 'Hard';

export type MatchRequest = {
  userId: string
  complexity: Complexity
}

export type OnMatch = (matchedRequest: MatchRequest) => void
