import React from 'react'
import {Redirect, Route} from "react-router-dom"

export const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route 
        {...rest}
        render = {props => localStorage.getItem("token") ? (
            <Component {...props} />
        ) : (
            <Redirect to = {{
                pathname: '/login',
                state: {from: props.location}
            }} />
        )}
        />
    )
}

// const AuthRoute = props => {
//     const { isAuthUser, type } = props;
//     if (type === "guest" && isAuthUser) return <Redirect to="/home" />;
//     else if (type === "private" && !isAuthUser) return <Redirect to="/" />;
  
//     return <Route {...props} />;
//   };
  
//   const mapStateToProps = ({ isAuthUser }) => ({
//     isAuthUser
//   });
  
//   export default connect(mapStateToProps)(AuthRoute);
