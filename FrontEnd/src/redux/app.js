import { createSlice } from '@reduxjs/toolkit';



export const _tokenSlice = createSlice({
  name: '_app',
  initialState: {
    _token: JSON.parse(sessionStorage.getItem('_token')),
    // _services: null,
    // _types: null,
    // _transactions: null,
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
    // setServices: (state, action) => {
    //   state._services = action.payload;
    // },
    // clearServices: state => {
    //   state._services = null;
    // },
    // setTypes: (state, action) => {
    //   state._types = action.payload;
    // },
    // clearTypes: state => {
    //   state._types = null;
    // },
    // setTransactions: (state, action) => {
    //   state._transactions = action.payload;
    // },
    // clearTransactions: state => {
    //   state._transactions = null;
    // },
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
  // setServices,
  // clearServices,
  // setTypes,
  // clearTypes,
  // setTransactions,
  // clearTransactions,
  setInvoices,
  clearInvoices
} = _tokenSlice.actions;

export default _tokenSlice.reducer;
