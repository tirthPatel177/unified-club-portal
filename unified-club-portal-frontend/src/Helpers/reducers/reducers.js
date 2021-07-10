import { SET_USER_TYPE, USER_LOGGED_OUT, USER_LOGGGED_IN } from "../actions/actionTypes";

const initialState = {
    user: {},
    type_of_user: ''
}


export default function(state = initialState, action) {
    switch (action.type) {
        case SET_USER_TYPE:
            return {
                ...state,
                type_of_user: action.payload
            };
        case USER_LOGGGED_IN:
            return {
                ...state,
                user: action.payload
            };
        case USER_LOGGED_OUT:
            return {
                ...state,
                user: {}
            }
            
        default:
        return state;
    }
  }