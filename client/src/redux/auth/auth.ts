import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login } from "../../services/auth";

const initialState: Auth = {
  user: null,
  loading: false,
  error: null,
};

export const signIn = createAsyncThunk<
  Auth,
  { email: string; password: string }
>("auth/signin", async (credentials) => {
  const data = await login(credentials);
  return data;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signIn.fulfilled, (_state, _action) => {});
  },
});

export default authSlice.reducer;
