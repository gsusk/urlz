import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, register } from "../../services/auth";

type Auth = {
  user: {
    email: string;
    username: string;
  } | null;
  loading: boolean;
  error: string | null;
};

const initialState: Auth = {
  user: null,
  loading: true,
  error: null,
};

export const signIn = createAsyncThunk<
  Auth["user"],
  { email: string; password: string }
>("auth/signin", async (credentials) => {
  const data = await login(credentials);
  const { token, ...rest } = data;
  localStorage.setItem("x-auth-token", token);
  return rest;
});

export const signUp = createAsyncThunk<
  Auth["user"],
  { email: string; password: string; username: string; confirmPassword: string }
>("auth/signup", async (credentials) => {
  const data = await register(credentials);
  const { token, ...rest } = data;
  localStorage.setItem("x-auth-token", token);
  return rest;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(signIn.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signIn.rejected, (state) => {
      state.loading = false;
      state.error = "Temporal error";
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
    });
    builder.addCase(signUp.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signUp.rejected, (state) => {
      state.loading = false;
      state.error = "Temporal error";
    });
  },
});

export default authSlice.reducer;
