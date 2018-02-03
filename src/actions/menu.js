import _ from 'lodash';
import { database, auth } from '../firebase';

import { FETCH_MENUS, FETCH_MENU, NEW_ITEM_FROM_MENU, FETCH_OPTIONS } from './types';
import { newItemFromMenu } from './item';

const store = '/srm/midori'

export const fetchMenus = () => { 
  return (dispatch, getState) => {
    database.ref('/srm/midori/menus')
      .once('value', snapshot => {
        // console.log(snapshot.key, snapshot.val())
        dispatch({ type: FETCH_MENUS, payload: snapshot.val() });
      })
  };
};

export const fetchMenu = (id) => { 
  return (dispatch, getState) => {
    database.ref(`/srm/midori/menus/${id}`)
      .once('value', snapshot => {
        // console.log(snapshot.key, snapshot.val())
        dispatch({ type: FETCH_MENU, payload: { id, value: snapshot.val() }});
        dispatch(newItemFromMenu(snapshot.val()))
      })
  };
};

export const fetchMenusWithOptions = (id, callback) => { 
  return dispatch => {
    database.ref(`${store}/options`)
    .once('value', optionsSnapshot => {
      const options = optionsSnapshot.val()
      database.ref(`${store}/addons`)
      .once('value', addonsSnapshot => {
        const addons = addonsSnapshot.val()
        database.ref(`${store}/menus`)
        .on('value', menuSnapshot => {
          // console.log(snapshot.key, snapshot.val())
          const menus = _.reduce(menuSnapshot.val(), (res, menu, key) => {
            const menuWithOptions = { 
              ...menu, 
              options: _.isArray(menu.options) ? menu.options.map(type => options[type]) : [],
              addons: _.isArray(menu.addons) ? 
                menu.addons.map(type => _.find(addons, o => o.value === type)) : []
            }
            return { ...res, [key]: menuWithOptions } 
          },{})
          dispatch({ type: FETCH_MENUS, payload: menus });
          if (Object.keys(menus).includes(id)){
            dispatch(newItemFromMenu({...menus[id], id}))
          }
          else {
            if (_.isFunction(callback)){
              callback(true)
            }
          }
        })
      })
    })
  };
};

export const fetchMenuWithOptions = (id) => { 
  return dispatch => {
    database.ref(`${store}/options`)
    .once('value', optionsSnapshot => {
      const options = optionsSnapshot.val()
      database.ref(`${store}/addons`)
      .once('value', addonsSnapshot => {
        const addons = addonsSnapshot.val()
        database.ref(`${store}/menus/${id}`)
        .once('value', menuSnapshot => {
          const menuWithOptions = { 
            ...menuSnapshot.val(), 
            options: menuSnapshot.val().options.map(type => options[type]),
            addons: menuSnapshot.val().addons.map(type => _.find(addons, o => o.value === type))
          }
          dispatch({ type: FETCH_MENU, payload: { id, value: menuWithOptions }});
          dispatch(newItemFromMenu(menuWithOptions))
        })
      })
    })
  };
};

export const fetchOptions = (id) => { 
  return (dispatch, getState) => {
    database.ref(`/srm/midori/options`)
      .on('value', snapshot => {
        dispatch({ type: FETCH_OPTIONS, payload: snapshot.val() });
      })
  };
};
