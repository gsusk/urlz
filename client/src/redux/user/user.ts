import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  type LoginForm,
  type RegisterForm,
  type AuthenticatedData,
  login,
  register,
  verifyAccount,
} from "../../services/auth";
import { errorHandler } from "../../utils/errorparser";

type User = {
  user: AuthenticatedData | null;
  loading: boolean;
  error: {
    message?: string;
    errors?: {
      email: string;
      username: string;
      password: string;
      confirmPassword: string;
      etoken?: string;
    };
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
  try {
    const res = await login(credentials);
    return res.data;
  } catch (err) {
    return api.rejectWithValue(errorHandler(err as Error));
  }
});

export const signUp = createAsyncThunk<
  AuthenticatedData,
  RegisterForm,
  { rejectValue: User["error"] }
>("user/signup", async (credentials, api) => {
  try {
    const res = await register(credentials);
    return res.data;
  } catch (err) {
    return api.rejectWithValue(errorHandler(err as Error));
  }
});

export const verify = createAsyncThunk<
  boolean,
  string,
  { rejectValue: Pick<User["error"], "message"> }
>("user/verify", async (token, api) => {
  try {
    const res = await verifyAccount(token);
    return res.status === 200;
  } catch (err) {
    return api.rejectWithValue(errorHandler(err as Error));
  }
});

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
    successfulVerification(state) {
      if (state.user) {
        state.user.isVerified = true;
      }
    },
    logout(state) {
      state = { user: null, error: {}, loading: false };
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
    builder.addCase(verify.fulfilled, (state, action) => {
      state.loading = false;
      if (state.user) {
        state.user.isVerified = action.payload;
      }
    });
    builder.addCase(verify.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload! || {};
    });
    builder.addCase(verify.pending, (state) => {
      state.loading = true;
    });
  },
});

export default authSlice.reducer;
export const { formError, resetError, successfulVerification, logout } =
  authSlice.actions;
