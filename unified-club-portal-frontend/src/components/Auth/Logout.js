import { Button } from '@material-ui/core'
import React from 'react'
import * as actions from './../../Helpers/actions/actionTypes'
import { useDispatch} from 'react-redux';

const Logout = () => {

    const dispatch = useDispatch();

    const logout = () => {
        dispatch({type:actions.USER_LOGGED_OUT})
        dispatch({type:actions.SET_USER_TYPE, payload: ''})
        localStorage.removeItem('token');
        
    };

    return (
        <div>
            <Button onClick={logout} variant="contained" color='primary'>
                Logout
            </Button>
        </div>
    )
}

export default Logout
