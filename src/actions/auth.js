import _ from 'lodash'
import { USER_LOGIN, USER_LOGOUT } from './types'

export const userLogIn = (user, admin) => { 
  return {
    type: USER_LOGIN,
    payload: {
      user,
      admin
    }
  }
};

export const userLogOut = () => { 
  return {
    type: USER_LOGOUT,
  }
};
