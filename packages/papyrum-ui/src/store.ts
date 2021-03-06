import { createStore, combineReducers, compose } from 'redux';
import app, { route, routeHeading } from './reducers/app';

const reducer = combineReducers({
  app,
  route,
  routeHeading
});

const composeEnhancers =
    typeof window === 'object' &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) :
        compose;

const enhancer = composeEnhancers(
    // other store enhancers if any
);

export const store = createStore(reducer, enhancer);
