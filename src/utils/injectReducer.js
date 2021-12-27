import { createStore as reduxCreateStore, combineReducers } from 'redux'

let __store__,
  __reducers__ = {}

const createReducer = reducers => {
  for (let key in reducers) {
    if (__reducers__[key]) return
    __reducers__[key] = typeof reducers[key] === 'function' ? reducers[key] : combineReducers(reducers[key])
  }
  return combineReducers(__reducers__)
}

export const createStore = (reducers, middleware) => {
  const store = reduxCreateStore(createReducer(reducers), middleware)
  __store__ = store
  return store
}

export const injectReducer = (key, reducer) => {
  let reducerObj = {}
  if (typeof key === 'string') {
    reducerObj[key] = reducer
  } else {
    reducerObj = key
  }
  const r = createReducer(reducerObj)
  if (__store__ && r) {
    __store__.replaceReducer(r)
  }
}
