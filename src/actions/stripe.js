import _ from 'lodash'
// import { database, auth } from '../firebase'
import { ADD_PAYMENT_SOURCE, FETCH_PAYMENT_SOURCES } from './types'

export const addPaymentSource = (database, token, callback) => {
  return (dispatch, getState) => {
    const uid = getState().user.uid
    database.ref(`/stripe_customers/${uid}/sources`)
      .set({ token })
      .then(() => {
        // fetchPaymentSources(callback)
        if (_.isFunction(callback)) callback()
      })
  }
}

// export const addPaymentSource = (token, callback) => {
//   return (dispatch, getState) => {
//     const uid = getState().user.uid
//     database.ref(`/stripe_customers/${uid}/sources`)
//       .set({ token })
//       .then(() => {
//         if (_.isFunction(callback)) callback()
//       })
//   }
// }

export const fetchPaymentSources = (database, callback) => {
  return (dispatch, getState) => {
    const uid = getState().user.uid
    console.log("uid: ", uid)
    database.ref(`/stripe_customers/${uid}/sources`)
      .on('value', snap => {
        if (snap.val() && snap.val().error){
          if (_.isFunction(callback)) callback(snap.val().error)
        }
        else if (snap.val() && snap.val().token){}
        else {
          dispatch({ type: FETCH_PAYMENT_SOURCES, payload: snap.val() })
        }
      })
  }
}

export const removePaymentSource = (database, callback) => {
  return (dispatch, getState) => {
    const uid = getState().user.uid
    database.ref(`/stripe_customers/${uid}/sources`)
      .remove()
      .then(() => {
        if (_.isFunction(callback)) callback()
      })
  }
}


