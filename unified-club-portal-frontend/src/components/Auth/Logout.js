// import { Button } from '@material-ui/core'
import React from 'react'
import * as actions from './../../Helpers/actions/actionTypes'
import { useDispatch} from 'react-redux';
import './Logout.css'
import { useHistory } from "react-router-dom";

const Logout = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const logout = () => {
        dispatch({type:actions.USER_LOGGED_OUT})
        dispatch({type:actions.SET_USER_TYPE, payload: ''})
        localStorage.removeItem('token');
        history.push("/login");
    };

    return (
        <div>
            <button onClick={logout} className="logout-button">
                Logout
            </button>
        </div>
    )
}

export default Logout
