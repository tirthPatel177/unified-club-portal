import React, {useState} from 'react';
import './App.css';
import { BrowserRouter as Router,Switch, Route} from 'react-router-dom';
import Login from './components/Login/Login';
import { PrivateRoute } from './Helpers/PrivateRoute';
import { Dashboard } from './components/HomePage/Dashboard';
import {useSelector} from 'react-redux';

function App() {

  // const user = useSelector( state => state.type_of_user)

  return (
    <div className="App">
      {/* {
        !user ? (
          <Login />
        ):( 
          user === 'admin' ? (
            <div className="admin_user">
              <h2>Welcome Admin</h2>
            </div>
          ) : (
            user === 'club' ? (
              <div className="club_user">
                <h2>Welcome club</h2>
              </div>
            ) : (
              <div className="normal_user">
                <h2>Welcome Normal User</h2>
              </div>
            )
          )
        )
      } */}
      <Router>
      <Switch>
        <PrivateRoute exact path='/' component={Dashboard}/>
        <Route exact path='/login' component={Login}/>
      </Switch>
    </Router>
    </div>
  );
}

export default App;
