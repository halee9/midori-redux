import { FETCH_MENUS, FETCH_MENU } from '../actions/types';
import _ from 'lodash'
export default function menuReducer(state=null, action){
  const { type, payload } = action
  switch (type) {
    case FETCH_MENUS: {
      const byKey = _.reduce(payload, (res, menu, key) => {
        return { ...res, [key]: { ...menu, id: key }}
      },{})
      const byCategory = _.groupBy(byKey, menu => {
        return menu.category
      })
      return { byKey, byCategory }
    }
    case FETCH_MENU: {
      return { ...state, [payload.id]: { ...payload.value, id: payload.id }}
    }
    default:
      return state;
  }
}
