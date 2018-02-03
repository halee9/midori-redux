import _ from 'lodash'
import { FETCH_PAYMENT_SOURCES } from '../actions/types';

export default function paymentReducer(state=null, action){
  const { type, payload } = action
  switch (type) {
    case FETCH_PAYMENT_SOURCES: {
      return { ...payload }
    }
    default:
      return state;
  }
}
