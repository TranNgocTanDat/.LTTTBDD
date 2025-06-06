import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  authenticated: false,
  token: '',
  user: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.authenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.userResponse;
    },
    logout: (state) => {
      state.authenticated = false;
      state.token = '';
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
