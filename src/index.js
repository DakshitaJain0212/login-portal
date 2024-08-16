import React from 'react';
import { createRoot } from 'react-dom/client';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './store/reducer/rootReducer';
import App from './App';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const createStoreWithMiddleware = composeEnhancers(applyMiddleware(thunk))(
  createStore
);

function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState);
  return store;
}

const store = configureStore();

const root = createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

