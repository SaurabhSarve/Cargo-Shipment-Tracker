import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import { shipmentReducer } from './reducers';

const rootReducer = combineReducers({
  shipment: shipmentReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
