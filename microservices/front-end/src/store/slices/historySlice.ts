import {
  AnyAction,
  PayloadAction,
  ThunkAction,
  createSlice,
} from "@reduxjs/toolkit";
import { RootState } from "..";
import { HistoryItem } from "../../components/types";
import authServiceUrl from "../../utility/authServiceUrl";

const initialState: HistoryItem[] = [];

export const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    _setHistoryItems: (_state, action: PayloadAction<HistoryItem[]>) =>
      action.payload,
  },
});

const { _setHistoryItems } = historySlice.actions;

export function fetchHistory(
  username: string
): ThunkAction<Promise<void>, RootState, unknown, AnyAction> {
  return async function thunk(dispatch) {
    const res = await fetch(`${authServiceUrl}/api/history/${username}`, {
      credentials: "include",
    });

    if (res.status === 204) {
      // this user has no attempts
      dispatch(_setHistoryItems([]));
      return;
    }

    const historyItems: HistoryItem[] = await res.json();

    // sort in place by latest attempt first
    historyItems.sort((a, b) => {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return dateB.getTime() - dateA.getTime();
    });

    dispatch(_setHistoryItems(historyItems));
  };
}

export default historySlice.reducer;
