import { legacy_createStore as createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from "./session";
import spotReducer from './spotsReducer';
import reviewReducer from './reviewReducer';
import spotReducer2 from './createSpotReducer';

const rootReducer = combineReducers({
  session: sessionReducer,
  spotState: spotReducer,
  reviewState: reviewReducer,
  spotReducer2: spotReducer2
});

let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}


const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
  };

  export default configureStore;
