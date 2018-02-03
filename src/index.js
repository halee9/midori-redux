export * from './actions'
export * from './helpers'

import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger'
import reducers from './reducers'

export const store = createStore(
  reducers,
  {},
  compose(
    applyMiddleware(thunk, logger),
  )
);