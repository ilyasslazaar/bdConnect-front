import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import reducers from "./reducers";
import sagas from "./sagas";

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

export const configureStore = initialState => {
  let composeEnhancers = compose;
  if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
    composeEnhancers =
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || composeEnhancers;
  }

  const store = createStore(
    reducers,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  sagaMiddleware.run(sagas);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept("./reducers", () => {
      const nextRootReducer = require("./reducers");
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};
