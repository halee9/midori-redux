import { combineReducers } from 'redux';
import menuReducer from './menuReducer';
import cartReducer from './cartReducer';
import authReducer from './authReducer';
import itemReducer from './itemReducer';
import orderReducer from './orderReducer';
import paymentReducer from './paymentReducer';


const rootReducer = combineReducers({
  menus: menuReducer,
  cart: cartReducer,
  item: itemReducer,
  user: authReducer,
  order: orderReducer,
  payment: paymentReducer,
});

export default rootReducer;
