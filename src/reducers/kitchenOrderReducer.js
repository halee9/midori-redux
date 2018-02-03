import _ from 'lodash'
import { FETCH_ORDERS } from '../actions/types';

export default function kitchenOrderReducer(state=null, action){
  const { type, payload } = action
  switch (type) {
    case FETCH_ORDERS: {
      return { ...payload }
    }
    default:
      return state;
  }
}
