import _ from 'lodash'
import { 
  NEW_ITEM_FROM_MENU, 
  SET_ITEM_FROM_CART, 
  CHANGE_OPTION_VALUE, 
  CHANGE_OPTION_MULTIPLE_VALUES, 
  CHANGE_ADDONS_VALUE,
} from '../actions/types';

const sample = {
  menu: {
    name: 'Spicy Chicken'
    // ...
  },
  order: {
    name: 'Spicy Chicken',
    menuId: 'C01',
    price: 9.99,
    options: {
      rice: { value: 'brown', text: 'Brown Rice', price: 1.00 },
    },
    addons: [
      { value: 'exSpicyChicken', text: 'Extra Spicy Chicken', price: 3.50 }
    ],
    total: 15.49
  }
}

const removeField = (obj, fieldName) => {
  const newObj = { ...obj }
  delete newObj[fieldName]
  return newObj
}

const getDefault = arr => {
  for (let i=0; i<arr.length; i++){
    if (arr[i].default) {
      return removeField(arr[i], 'default')
    }
  }
  return null
}

const money = number => Number(number.toFixed(2))

const getTotal = item => {
  const optionPrice = _.reduce(item.options, (acc, option, key) => {
    return acc + (option.price || 0)
  }, 0)
  const addonsPrice = _.reduce(item.addons, (acc, addon, key) => {
    return acc + (addon.price || 0)
  }, 0)
  return money(optionPrice + addonsPrice + item.price)
}

export default function itemReducer(state=null, action){
  const { type, payload } = action
  switch (type) {
    case NEW_ITEM_FROM_MENU: {
      const { menu } = payload;
      const options = menu.options.reduce((res, option) => {
        // console.log('option: ', option)
        const key = option.name
        if (option.multipleSelect){
          return { ...res, [key]: [] }
        }
        else {
          return { ...res, [key]: getDefault(option.values) }
        }
      }, {})

      // set name by default naming if the menu has 'namingRule'
      let name = menu.name
      if (menu.namingRule) {
        const { pre, select, post } = menu.namingRule
        name = `${pre} ${select} ${post}`
      }

      let order = { 
        name,
        abbr: menu.abbr,
        image: menu.image,
        price: Number(menu.price),
        menuId: menu.id,
        job: menu.job,
        rice: menu.rice,
        options,
        addons: []
      };
      order.total = getTotal(order)

      return { menu, order }
    }

    case SET_ITEM_FROM_CART: {
      const { order, menu } = payload;
      return { menu, order }
    }

    case CHANGE_OPTION_VALUE: {
      const { name, value, newName, newAbbr } = payload
      const menuName = newName ? newName : state.order.name
      const abbrName = newAbbr ? newAbbr : state.order.abbr
      let order = { 
        ...state.order, 
        name: menuName, 
        abbr: abbrName,
        options: { ...state.order.options, [name]: value } 
      }
      order.total = getTotal(order)
      return { ...state, order }
    }

    case CHANGE_ADDONS_VALUE: {
      const { name, value } = payload
      let order = { ...state.order, addons: value }
      order.total = getTotal(order)
      return { ...state, order }
    }
    default:
      return state;
  }
}
