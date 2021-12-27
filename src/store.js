import { routerMiddleware, connectRouter } from "connected-react-router";
import { applyMiddleware } from "redux";

import thunkMiddleware from "./middlewares/thunk";
import promiseMiddleware from "./middlewares/promise";
import errorMiddleware from "./middlewares/error";
import loadingMiddleware from "./middlewares/loading";

import { createStore } from "./utils/injectReducer";
import reducers from "./reducers/index";
import common from "./reducers/common";

const store = (history) => {
  return createStore(
    {
      router: connectRouter(history),
      common,
      ...reducers,
    },
    applyMiddleware(
      routerMiddleware(history),
      thunkMiddleware,
      loadingMiddleware,
      promiseMiddleware,
      errorMiddleware
    )
  );
};

export default store;
