import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { UserModel } from "../../types/userModel";

// Define a type for the slice state
interface AuthState {
  value: boolean;
}

// Define the initial state using that type
const initialState: AuthState = {
  value: false,
};

export const authSlice = createSlice({
  name: "auth",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    isSignedIn: (state) => {
      const token = localStorage.get("access-token");
      state.value = !!token ? true : false;
    },
    signOut: (state) => {
      localStorage.removeItem("access-token");
      state.value = false;
      return state;
    },
  },
});

export const { isSignedIn, signOut } = authSlice.actions;

export default authSlice.reducer;
