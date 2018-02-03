import { FETCH_DAY_TOTAL } from './types'
import moment from 'moment'

const base = '/sales'

export const fetchDayTotal = (database, dateString) => { //YYYYMMDD
  const date = dateString || moment().format('YYYYMMDD')
  console.log("date: ", date)
  return (dispatch) => {
    database.ref(`${base}/${date}/amount/total`)
    .on('value', snapshot => {
      dispatch({ type: FETCH_DAY_TOTAL, payload: snapshot.val() });
    })
  }
}

