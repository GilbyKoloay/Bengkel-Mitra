import { createSlice } from '@reduxjs/toolkit';



export const _tokenSlice = createSlice({
  name: '_app',
  initialState: {
    _token: JSON.parse(sessionStorage.getItem('_token')),
    _invoices: null
  },
  reducers: {
    setToken: (state, action) => {
      sessionStorage.setItem('_token', JSON.stringify(action.payload));
      state._token = action.payload;
    },
    clearToken: state => {
      sessionStorage.removeItem('_token');
      state._token = null;
    },
    setInvoices: (state, action) => {
      state._invoices = action.payload;
    },
    clearInvoices: state => {
      state._invoices = null;
    }
  }
});
export const {
  setToken,
  clearToken,
  setInvoices,
  clearInvoices
} = _tokenSlice.actions;

export default _tokenSlice.reducer;
