import ActionType from '../constants/ActionTypes';

const { isEmpty } = require('lodash');

const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ActionType.SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload), //isEmpty from lodash
        user: action.payload
      };
    case ActionType.USER_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
