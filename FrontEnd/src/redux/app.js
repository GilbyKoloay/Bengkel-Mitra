import { createSlice } from '@reduxjs/toolkit';



export const _tokenSlice = createSlice({
  name: 'app',
  initialState: {
    _token: JSON.parse(sessionStorage.getItem('_token')),
    services: null,
    types: null,
    transactions: null
  },
  reducers: {
    set_token: (state, action) => {
      sessionStorage.setItem('_token', JSON.stringify(action.payload));
      state._token = action.payload;
    },
    clear_token: state => {
      sessionStorage.removeItem('_token');
      state._token = null;
    },
    setServices: (state, action) => {
      state.services = action.payload;
    },
    clearServices: state => {
      state.services = null;
    },
    setTypes: (state, action) => {
      state.types = action.payload;
    },
    clearTypes: state => {
      state.types = null;
    },
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    clearTransactions: state => {
      state.transactions = null;
    }
  }
});
export const {
  set_token,
  clear_token,
  setServices,
  clearServices,
  setTypes,
  clearTypes,
  setTransactions,
  clearTransactions
} = _tokenSlice.actions;

export default _tokenSlice.reducer;
