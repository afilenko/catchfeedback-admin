import { createSlice } from "@reduxjs/toolkit";
import { AuthUser } from "typings/entities";

import { setAuthUser } from "./actions";

type Props = {
  user: AuthUser | null;
};

const INITIAL_STATE = {
  user: null,
};

const auth = createSlice({
  name: "auth",
  initialState: { ...INITIAL_STATE } as Props,
  reducers: {
    clearAuthenticationState() {
      return { ...INITIAL_STATE };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setAuthUser, (state, { payload }) => {
      state.user = payload && { ...payload };
    });
  },
});

export const { clearAuthenticationState } = auth.actions;
export default auth;
