import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, register } from "../../services/auth";

type Auth = {
  user: {
    token: string;
    email: string;
    first_name: string;
    last_name: string;
    id: string;
  } | null;
  loading: boolean;
  error: string | null;
};

const initialState: Auth = {
  user: null,
  loading: false,
  error: null,
};

export const signIn = createAsyncThunk<
  Auth["user"],
  { email: string; password: string }
>("auth/signin", async (credentials) => {
  const data = await login(credentials);
  return data;
});

export const signUp = createAsyncThunk<
  Auth["user"],
  { email: string; password: string; first_name: string; last_name: string }
>("auth/signup", async (credentials) => {
  const data = await register(credentials);
  return data;
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
