import React from 'react'
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import * as actions from './../../Helpers/actions/actionTypes'
import AdminHome from './../admin/HomePage/Home';
import ClubHome from './../club/HomePage/Home';
import NormalHome from './../user/HomePage/Home';
import Error404 from './../Error/Error404'

export const Dashboard = () => {

    const type_of_user = useSelector(state => state.type_of_user)
    // const dispatch = useDispatch();


    // const logout = () => {
    //     dispatch({type:actions.USER_LOGGED_OUT})
    //     dispatch({type:actions.SET_USER_TYPE, payload: ''})
    //     localStorage.removeItem('token');
        
    // };
    // const fetchdetails = async (token) => {
    //     let formData = new FormData();
    //     formData.append("token", token);
    //     fetch('http://localhost:8000/api/user/get_info', {
    //         method: "POST",
    //         body: formData
    //     }).then( data => data.json()).then(
    //         data => {
    //             dispatch({type: actions.USER_LOGGGED_IN, payload: data})
    //             dispatch({type: actions.SET_USER_TYPE, payload: data.type_of_user})
    //             // props.setUser(data.type_of_user)
                
    //         }
    //     ).catch(e => console.log(e))
    // }

    // useEffect(() => {
    //     let token = localStorage.getItem('token');
    //     fetchdetails(token);
    // }, [])

    const multiView = (type_of_user) => {
        if(type_of_user === 'vbekfka29'){
            return <AdminHome />
        }else if(type_of_user === 'xhuoxfn3'){
            return <ClubHome />
        }else if(type_of_user === 'cmkua43qrh'){
            return <NormalHome />
        }else{
            <Error404 />
        }
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
