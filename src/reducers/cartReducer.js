import { ADD_ITEM, MODIFY_ITEM, REMOVE_ITEM, ONE_MORE_ITEM, EMPTY_CART } from '../actions/types';

const TAX = 10.1

const initState = {
  items: [],
  amount: {}
}

const getAmount = (items) => {
  const subtotal = items.reduce((acc, item, key) => {
    return acc += Number((item.total * item.qty).toFixed(2));
  },0)
  const tax = Number((subtotal * (TAX / 100)).toFixed(2));
  const total = subtotal + tax;
  return {
    subtotal, tax, total
  }
}

export default function cartReducer(state=initState, action){
  const { type, payload } = action
  switch (type) {
    case ADD_ITEM: {
      const { item, qty } = payload
      const items = [ ...state.items, { ...item, qty } ];
      return { items, amount: getAmount(items) };
    }
    case MODIFY_ITEM: {
      const { index, item } = payload
      const items = [ ...state.items ];
      items[index] = item
      return { items, amount: getAmount(items) };
    }
    case REMOVE_ITEM: {
      const { index } = payload
      const items = [ ...state.items ];
      items.splice(index, 1)
      return { items, amount: getAmount(items) };
    }

    case ONE_MORE_ITEM: {
      const { index } = payload
      const copied = { ...state.items[index] }
      const items = [ ...state.items.slice(0, index+1), copied, ...state.items.slice(index+1) ]
      return { items, amount: getAmount(items) };
    }

    case EMPTY_CART: {
      return { ...initState };
    }

    default:
      return state;
  }
}
