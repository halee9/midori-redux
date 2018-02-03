import { USER_LOGIN, USER_LOGOUT } from '../actions/types';

const initState = {
  user: null,
  username: '',
  email: '',
  uid: null
}

export default function authReducer(state=initState, action){
  const { type, payload } = action
  switch (type) {
    case USER_LOGIN: {
      const { user } = payload
      return { user, username: user.displayName, email: user.email, uid: user.uid };
    }
    case USER_LOGOUT: {
      return {...initState};
    }
    default:
      return state;
  }
}
