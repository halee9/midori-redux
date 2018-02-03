import { combineReducers } from 'redux';
import menuReducer from './menuReducer';
import cartReducer from './cartReducer';
import authReducer from './authReducer';
import itemReducer from './itemReducer';
import orderReducer from './orderReducer';
import paymentReducer from './paymentReducer';
import kitchenOrderReducer from './kitchenOrderReducer';
import dashReducer from './dashReducer';

const rootReducer = combineReducers({
  menus: menuReducer,
  cart: cartReducer,
  item: itemReducer,
  user: authReducer,
  order: orderReducer,
  payment: paymentReducer,
  kitchenOrders: kitchenOrderReducer,
  sales: dashReducer
});

export default rootReducer;
