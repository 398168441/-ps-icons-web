import { handleActions } from "redux-actions";

import { FETCH_ICON_COMPONENT, FETCH_TAGS } from "../actions/index";

const componentMap = handleActions(
  {
    [FETCH_ICON_COMPONENT]: (state, { payload, meta: { type, theme } }) => ({
      ...state,
      [`${type}${theme}`]: payload,
    }),
  },
  {}
);

const tags = handleActions(
  {
    [FETCH_TAGS]: (state, { payload = [] }) => payload,
  },
  []
);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  componentMap,
  tags,
};
