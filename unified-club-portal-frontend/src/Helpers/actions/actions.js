import * as actions from './actionTypes';

export const loggedIn = (details) => {
    return {
        type: actions.USER_LOGGGED_IN,
        payload: details
    }
}

export const loggedOut = () => {
    return {
        type: actions.USER_LOGGED_OUT,
        payload: 'logout'
    }
}

// export const IS_USER_LOGGED_IN = () => {

// }