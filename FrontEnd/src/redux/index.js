import { configureStore } from '@reduxjs/toolkit';

import _tokenReducer from './_token';



export default configureStore({
  reducer: {
    _token: _tokenReducer
  }
});
