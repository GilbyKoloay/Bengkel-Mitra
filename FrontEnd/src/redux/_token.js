import { createSlice } from '@reduxjs/toolkit';



export const _tokenSlice = createSlice({
  name: '_token',
  initialState: {
    _token: JSON.parse(sessionStorage.getItem('_token'))
  },
  reducers: {
    set_token: (state, action) => {
      sessionStorage.setItem('_token', JSON.stringify(action.payload));
      state._token = action.payload;
    },
    clear_token: state => {
      sessionStorage.removeItem('_token');
      state._token = null;
    }
  }
});
export const { set_token, clear_token } = _tokenSlice.actions;

export default _tokenSlice.reducer;
