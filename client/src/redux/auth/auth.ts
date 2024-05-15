import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type Auth = {
  data: {
    token: string;
    username: string;
    id: string;
  } | null;
  loading: boolean;
  error: string | null;
};

const initialState: Auth = {
  data: null,
  loading: false,
  error: null,
};

export const signIn = createAsyncThunk<
  Auth,
  { email: string; password: string }
>("auth/signin", async ({ email, password }, api) => {
  email;
  password;
  api;
  return {} as Auth;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signIn.fulfilled, (state, action) => {});
  },
});

export default authSlice.reducer;
