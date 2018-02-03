import firebase, { database } from '../firebase'
import _ from 'lodash'
import moment from 'moment'
import { FETCH_ORDER, FETCH_ORDERS } from './types'

// const makeAbbr = name => {
//   const values = name.toLowerCase().split(' ')
//   const filteredValues = values.filter(v => {
//     return v !== 'chicken' && v !== 'and' && v !== 'bulgogi' && 
//   })
//   values.map(v => {
//     switch (v) {
//       case 'spicy': {
//         return 'SP'
//       }
//       case 'crispy': {
//         return 'Crsp'
//       }
//       case 'chicken': {
//         return 'CH'
//       }
//       case 'chicken': {
//         return 'CH'
//       }
//       default: return v
//     }
//   })
// }

const pad = (n, width, z) => {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const convertOrderToRegister = (order) => {
  const items = order.items.map((item, index) => {
    const options = _.map(item.options, option => {
      return {
        abbr: option.value,
        name: option.text,
        price: option.price
      }
    })
    console.log("options: ", options)
    const newOptions = options.filter(o => {
      const a = o.abbr
      return (a !== 'White' && a !== 'GZ' && a !== 'E' && a !== 'CH' && a !== 'BF' && a !== 'PK' 
            && a !== 'Tofu' && a !== 'Shrimp' && a !== 'Veg' )
    })
    console.log("newOptions: ", newOptions)
    const addons = _.map(item.addons, addon => {
      return {
        abbr: addon.value,
        name: addon.text,
        price: addon.price
      }
    })

    return {
      name: item.name,
      abbr: item.abbr,
      basePrice: item.price,
      price: item.total,
      qty: item.qty || 1,
      job: item.job || 'Grill',
      rice: item.rice || 'F',
      state: 'Taken',
      index,
      options: [...newOptions, ...addons]
    }
  })
  const created_at = new Date().toISOString()
  return {
    subtotal: order.amount.subtotal,
    tax: order.amount.tax,
    total: order.amount.total,
    state: 'Taken',
    paymentType: 'Credit',
    orderType: 'Online',
    htType: 'Togo',
    customer_name: order.username,
    created_at,
    items
  }
}

const setOrder = (order, callback) => {
  database.ref(`/register/orderId/counter`)
  .transaction((counter) => {
    console.log("current counter: ", counter)
    if (!counter || counter < 0) return 1
    if (counter > 999) counter = 0
    return counter + 1
  })
  .then(({ committed, snapshot }) => {
    console.log("new counter: ", snapshot)
    console.log("new counter: ", snapshot.val())
    const orderNumber = snapshot.val()
    const orderId = moment().format('YYYYMMDD') + pad(orderNumber, 3)
    console.log("new order number: ", orderId)
    const convertedOrder = convertOrderToRegister(order)
    database.ref('/neworders')
    .push({ ...convertedOrder, id: orderId, number: orderNumber })
    .then((res) => {
      database.ref(`/srm/midori/orders/${order.uid}`)
      .push({ ...order, id: res.key, orderNumber })
      .then((res) => {
        if (_.isFunction(callback)) callback(false, res.key)
      })
    })
  })
}


export const placeOrder = (inputOrder, callback) => {
  const order = { ...inputOrder, createdAt: firebase.database.ServerValue.TIMESTAMP}
  return (dispatch, getState) => {
    database.ref(`/stripe_customers/${order.uid}/charges`)
    .push({ source: order.payment.id, amount: order.amount.total*100 })
    .then((res) => {
      console.log("res: ", res)
      database.ref(`/stripe_customers/${order.uid}/charges/${res.key}`)
      .on('value', snap => {
        if (snap.val().error){
          console.log('error: ', snap.val().error)
          if (_.isFunction(callback)) callback(snap.val().error)
          return
        }
        if (snap.val().status === 'succeeded'){
          console.log('succeeded: ', snap.val())
          setOrder(order, callback)
          
        }
      })
    })
  }
}

export const fetchOrder = (id) => {
  return (dispatch) => {
    database.ref(`/srm/midori/orders/${id}`)
    .on('value', snapshot => {
      dispatch({ type: FETCH_ORDER, payload: {id: snapshot.key, ...snapshot.val()} });
    })
    
  }
}

export const fetchOrdersByUser = (uid) => {
  return (dispatch) => {
    database.ref(`/srm/midori/orders/${uid}`)
    .once('value', snapshot => {
      dispatch({ type: FETCH_ORDERS, payload: snapshot.val() });
    })
  }
}
