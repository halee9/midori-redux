import _ from 'lodash';

import { ADD_ITEM, MODIFY_ITEM, REMOVE_ITEM, ONE_MORE_ITEM, EMPTY_CART } from './types';

export const addItem = (database, item, qty=1) => { 
  return {
    type: ADD_ITEM,
    payload: {
      item,
      qty
    }
  }
};

export const modifyItem = (index, item) => { 
  return {
    type: MODIFY_ITEM,
    payload: {
      index,
      item
    }
  }
};

export const removeItem = (index) => { 
  return {
    type: REMOVE_ITEM,
    payload: {
      index
    }
  }
};

export const oneMoreItem = (index) => { 
  return {
    type: ONE_MORE_ITEM,
    payload: {
      index
    }
  }
};

export const emptyCart = () => { 
  return {
    type: EMPTY_CART,
  }
};

