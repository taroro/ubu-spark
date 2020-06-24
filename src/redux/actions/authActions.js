import * as types from "../constants";
import * as firebase from '../../firebase/firebase'

export const signin = (email, password) => {
  return async function(dispatch) {
    const user = await firebase.signin(email, password);
    if(user) {
      dispatch({
        type: types.SIGN_IN, 
        payload: user
      });

      return user;
    }
  }
}

export const signup = (email, password) => {
  return async function(dispatch) {
    const user = await firebase.signup(email, password);
    if(user) {
      dispatch({
        type: types.SIGN_UP, 
        payload: user
      });
      
      return user;
    }
  }
}

export const signout = () => {
  return async function(dispatch) {
    await firebase.signout();
    dispatch({
      type: types.SIGN_IN, 
      payload: {}
    });
    dispatch({
      type: types.SIGN_UP, 
      payload: {}
    });
  }
}
