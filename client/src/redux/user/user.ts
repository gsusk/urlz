import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, register, verifyAccount, User } from "../../services/auth";
import { errorHandler } from "../../utils/errorparser";
import { AxiosError } from "axios";

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: {
    message?: string;
    username?: string;
    password?: string;
    email?: string;
    confirmPassword?: string;
  };
  user: User | null;
}
/* 
to be consider
"errors": [
    {
        "code": "100",
        "field": null,
        "message": "Name is required"
    }, {
        "code": "100",
        "field": null,
        "message": "Age is required"
    }
  ]
 */

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: {},
};

export const signIn = createAsyncThunk<
  User,
  { username: string; password: string },
  {
    rejectValue: {
      message: string;
      errors: {
        username?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
      };
    };
  }
>("user/signin", async (credentials, api) => {
  try {
    const res = await login(credentials);
    return res.data;
  } catch (err) {
    return api.rejectWithValue(errorHandler(err as Error));
  }
});

export const signUp = createAsyncThunk<
  User,
  {
    username: string;
    password: string;
    email: string;
    confirmPassword: string;
  },
  {
    rejectValue: {
      message: string;
      errors: {
        username?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
      };
    };
  }
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
  { rejectValue: Pick<AuthState["error"], "message"> }
>("user/verify", async (token, api) => {
  try {
    const res = await verifyAccount(token);
    return res.status === 200;
  } catch (err) {
    let error;
    if (err instanceof AxiosError && err.response?.data) {
      error = {
        ...(err as Error),
        message: err.response.status + " " + err.response.data.message,
      };
    }
    return api.rejectWithValue(errorHandler(error ?? (err as Error)));
  }
});

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    formError(state, action: PayloadAction<AuthState["error"]>) {
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
      state.error = {};
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
    },
    updateInfo(
      state,
      action: PayloadAction<{ username?: string; profilePic?: string }>
    ) {
      if (state.user) {
        state.user.username = action.payload.username ?? state.user.username;
        state.user.profilePic =
          action.payload.profilePic ?? state.user.profilePic;
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(signIn.pending, (state) => {
      state.loading = true;
      state.error = {};
    });
    builder.addCase(signIn.rejected, (state, action) => {
      const { message, errors } = action.payload!;
      state.error = { message, ...errors } || {};
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(signUp.pending, (state) => {
      state.loading = true;
      state.error = {};
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.loading = false;
      const { message, errors } = action.payload!;
      state.error = { message, ...errors } || {};
    });
    builder.addCase(verify.fulfilled, (state, action) => {
      state.loading = false;
      if (state.user) {
        state.user.isVerified = action.payload;
      }
    });
    builder.addCase(verify.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || {};
    });
    builder.addCase(verify.pending, (state) => {
      state.loading = true;
    });
  },
});

export default authSlice.reducer;
export const {
  formError,
  resetError,
  successfulVerification,
  logout,
  updateInfo,
} = authSlice.actions;
