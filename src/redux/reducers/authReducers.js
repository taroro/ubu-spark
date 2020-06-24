import * as types from "../constants";

const initialState = {
  user: {}
};

export default function reducer(state = initialState, actions) {
  switch (actions.type) {
    case types.SIGN_IN:
      return {
        ...state,
        user: actions.payload
      };
    case types.SIGN_UP:
      return {
        ...state,
        user: actions.payload
      };
    case types.SIGN_OUT:
      return {
        ...state,
        user: actions.payload
      };
    default:
      return state;
  }
}