import React from 'react'
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from './../../Helpers/actions/actionTypes'
import AdminHome from './../admin/HomePage/Home';
import ClubHome from './../club/HomePage/Home';
import NormalHome from './../user/HomePage/Home';
// import { Redirect } from 'react-router';
import Logout from '../Auth/Logout';

export const Dashboard = () => {

    const type_of_user = useSelector(state => state.type_of_user)
    // const dispatch = useDispatch();


    // const logout = () => {
    //     dispatch({type:actions.USER_LOGGED_OUT})
    //     dispatch({type:actions.SET_USER_TYPE, payload: ''})
    //     localStorage.removeItem('token');
        
    // };

    const multiView = (type_of_user) => {
        if(type_of_user === 'admin'){
            return <AdminHome />
        }else if(type_of_user === 'club'){
            return <ClubHome />
        }
        return <NormalHome />
    }

    return (
        <div>
            {
                !localStorage.getItem('token') ? (<Redirect to='/login' />) : null
            }
            {
                multiView(type_of_user)
            }
            {/* <button onClick={logout} >
                Logout
            </button> */}
            {/* <Logout /> */}
        </div>
    )
}
