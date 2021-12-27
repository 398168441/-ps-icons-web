import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";

import configStore from "./store";
import Router from "./router";
import "antd/dist/antd.css";
import "./index.css";

const history = createBrowserHistory();
const store = configStore(history);
/**
 * react-router 4.0开始不提供hashStory和browserStory
 * ConnectedRouter可以自动使用Provider的store
 * IntlProvider通过InjectIntl的方式注入，不依赖react的context
 **/
ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Router dispatch={store.dispatch} />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);
