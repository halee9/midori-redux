import _ from 'lodash';

import { 
  NEW_ITEM_FROM_MENU, 
  SET_ITEM_FROM_CART, 
  CHANGE_OPTION_VALUE,
  CHANGE_ADDONS_VALUE,
} from './types';

export const newItemFromMenu = (menu) => { 
  return {
    type: NEW_ITEM_FROM_MENU,
    payload: { menu }
  }
};

export const setItemFromCart = (index) => { 
  return (dispatch, getState) => {
    const order = getState().cart.items[index]
    const menu = getState().menus.byKey[order.menuId]
    dispatch({
      type: SET_ITEM_FROM_CART,
      payload: { order, menu }
    })
  }
};

export const changeOptionValue = ({ name, value, newName, newAbbr }) => { 
  return {
    type: CHANGE_OPTION_VALUE,
    payload: { name, value, newName, newAbbr }
  }
};

export const changeAddonsValue = ({ name, value }) => { 
  return {
    type: CHANGE_ADDONS_VALUE,
    payload: { name, value }
  }
};

