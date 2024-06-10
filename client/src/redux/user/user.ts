import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  type LoginForm,
  type RegisterForm,
  type AuthenticatedData,
  login,
  register,
} from "../../services/auth";

type User = {
  user: AuthenticatedData | null;
  loading: boolean;
  error: string | null;
};

const initialState: User = {
  user: JSON.parse(localStorage.getItem("user") as string),
  loading: false,
  error: null,
};

export const signIn = createAsyncThunk<
  AuthenticatedData,
  LoginForm,
  { rejectValue: string }
>("user/signin", async (credentials, api) => {
  const data = await login(credentials);
  if (!data) {
    return api.rejectWithValue("errorr");
  }
  return data;
});

export const signUp = createAsyncThunk<AuthenticatedData, RegisterForm>(
  "user/signup",
  async (credentials) => {
    const data = await register(credentials);
    return data;
  }
);

const authSlice = createSlice({
  name: "user",
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
    builder.addCase(signIn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message as string;
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
