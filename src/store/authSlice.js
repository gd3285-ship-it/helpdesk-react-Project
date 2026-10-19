import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOKEN_KEY, getErrorMessage } from '../api/axios';
import { loginRequest, registerRequest, getMeRequest } from '../api/authApi';

const USER_KEY = 'helpdesk_user';

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    return await loginRequest(email, password);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

// Registration does not return a token, so we log in right after it
export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      await registerRequest(name, email, password);
      return await loginRequest(email, password);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Refreshes the user details from the server (used when the app loads with a saved token)
export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    return await getMeRequest();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

const initialState = {
  token: localStorage.getItem(TOKEN_KEY),
  user: loadUser(),
  status: 'idle', // idle | loading | succeeded | failed
  error: null,
};

function saveSession(state, { token, user }) {
  state.token = token;
  state.user = user;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem(USER_KEY, JSON.stringify(action.payload));
      })
      // login and register share the same flow
      .addMatcher(
        (action) => [login.pending.type, register.pending.type].includes(action.type),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        (action) => [login.fulfilled.type, register.fulfilled.type].includes(action.type),
        (state, action) => {
          state.status = 'succeeded';
          saveSession(state, action.payload);
        }
      )
      .addMatcher(
        (action) => [login.rejected.type, register.rejected.type].includes(action.type),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        }
      );
  },
});

export const { logout, clearAuthError } = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsLoggedIn = (state) => Boolean(state.auth.token);

export default authSlice.reducer;
