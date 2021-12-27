import { combineReducers } from "redux";
import { handleActions } from "redux-actions";

import { APP_SHOW_LOADING, APP_CLOSE_LOADING } from "../actions/common";

const loading = handleActions(
  {
    [APP_SHOW_LOADING]: () => true,
    [APP_CLOSE_LOADING]: () => false,
  },
  false
);

export default combineReducers({
  loading,
});
