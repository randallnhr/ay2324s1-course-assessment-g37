export type MatchRequest = {
  userId: string
  complexity: 'Easy' | 'Medium' | 'Hard'
}

export type OnMatch = (matchedRequest: MatchRequest) => void
