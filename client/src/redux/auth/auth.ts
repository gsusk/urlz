import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, register } from "../../services/auth";

type Auth = {
  token: string | null;
  loading: boolean;
  error: string | null;
};

const token = localStorage.getItem("token");
const initialState: Auth = {
  token: token,
  loading: false,
  error: null,
};

export const signIn = createAsyncThunk<
  Auth["token"],
  { username: string; password: string }
>("auth/signin", async (credentials) => {
  const data = await login(credentials);
  localStorage.setItem("token", data.token);
  return data.token;
});

export const signUp = createAsyncThunk<
  Auth["token"],
  { email: string; password: string; username: string; confirmPassword: string }
>("auth/signup", async (credentials) => {
  const data = await register(credentials);
  localStorage.setItem("user", data.token);
  return data.token;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload;
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
      state.token = action.payload;
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
