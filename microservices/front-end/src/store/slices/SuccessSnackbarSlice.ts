import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface SuccessSnackbarState {
  isOpen: boolean;
  currentMessage: string;
  messageQueue: string[];
}

const initialState: SuccessSnackbarState = {
  isOpen: false,
  currentMessage: "",
  messageQueue: [],
};

export const SuccessSnackbarSlice = createSlice({
  name: "SuccessSnackbar",
  initialState,
  reducers: {
    closeSuccessSnackbar: (state) => {
      state.isOpen = false;
      return state;
    },
    resetCurrentSuccessSnackbarMessage: (state) => {
      state.currentMessage = "";
      return state;
    },
    enqueueSuccessSnackbarMessage: (state, action: PayloadAction<string>) => {
      const newMessage = action.payload;
      state.messageQueue.push(newMessage);
      return state;
    },
    popAndShowNextSuccessSnackbarMessage: (state) => {
      // pop first message
      const nextMessage = state.messageQueue.shift();

      if (nextMessage === undefined) {
        throw new Error("SuccessSnackbar message queue is empty!");
      }

      state.currentMessage = nextMessage;
      state.isOpen = true;
      return state;
    },
  },
});

export const {
  closeSuccessSnackbar,
  resetCurrentSuccessSnackbarMessage,
  enqueueSuccessSnackbarMessage,
  popAndShowNextSuccessSnackbarMessage,
} = SuccessSnackbarSlice.actions;

export default SuccessSnackbarSlice.reducer;
