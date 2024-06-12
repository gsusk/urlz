import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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
  error: {
    email?: string;
    username?: string;
    password?: string;
    confirmPassword?: string;
  };
};

const initialState: User = {
  user: JSON.parse(localStorage.getItem("user") as string),
  loading: false,
  error: {},
};

export const signIn = createAsyncThunk<
  AuthenticatedData,
  LoginForm,
  { rejectValue: User["error"] }
>("user/signin", async (credentials, api) => {
  const data = await login(credentials);
  if ("errors" in data) {
    return api.rejectWithValue(data.errors);
  }
  return data;
});

export const signUp = createAsyncThunk<AuthenticatedData, RegisterForm>(
  "user/signup",
  async (credentials, api) => {
    const data = await register(credentials);
    if ("errors" in data) {
      return api.rejectWithValue(data.errors);
    }
    return data;
  }
);

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    formError(state, action: PayloadAction<User["error"]>) {
      state.error = action.payload;
    },
    resetError(state) {
      state.error = {};
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(signIn.pending, (state) => {
      state.loading = true;
      state.error = {};
    });
    builder.addCase(signIn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || {};
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(signUp.pending, (state) => {
      state.loading = true;
      state.error = {};
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || {};
    });
  },
});

export default authSlice.reducer;
export const { formError, resetError } = authSlice.actions;
