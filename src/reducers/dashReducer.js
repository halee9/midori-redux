import _ from 'lodash'
import { FETCH_DAY_TOTAL } from '../actions/types';

export default function dashReducer(state=null, action){
  const { type, payload } = action
  switch (type) {
    case FETCH_DAY_TOTAL: {
      return { ...state, total: payload }
    }
    default:
      return state;
  }
}
