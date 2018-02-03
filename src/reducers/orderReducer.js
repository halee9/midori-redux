import _ from 'lodash'
import { FETCH_ORDER, FETCH_ORDERS } from '../actions/types';

export default function orderReducer(state=null, action){
  const { type, payload } = action
  switch (type) {
    case FETCH_ORDER: {
      return { ...state, byId: payload }
    }
    case FETCH_ORDERS: {
      const orders = _.map(payload, (order, key) => ({ ...order, id: key })).reverse()
      return { ...state, byUser: orders }
    }
    default:
      return state;
  }
}
