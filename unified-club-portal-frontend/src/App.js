import React, {useState, useEffect} from 'react';
import './App.css';
import { BrowserRouter as Router,Switch, Route} from 'react-router-dom';
import Login from './components/Auth/Login';
import { PrivateRoute } from './Helpers/PrivateRoute';
import { Dashboard } from './components/Dashboard/Dashboard';
import {useSelector, useDispatch} from 'react-redux';
import * as actions from './Helpers/actions/actionTypes'
import ClubProfile from './components/user/clubs_profile/ClubProfile';
import UserEventsPage from './components/user/events/Events'
import CreateEvent from './components/club/Events/CreateEvents/CreateEvents'
import ClubEvents from './components/club/Events/ListEvents/Events'
import UserEventHomePage from './components/user/EventsHome/Home'
import UserAnnouncementsPage from './components/user/announcements/AnnouncementList'

function App() {

  const dispatch = useDispatch();

  const fetchdetails = async (token) => {
    let formData = new FormData();
    formData.append("token", token);
    fetch('http://localhost:8000/api/user/get_info', {
        method: "POST",
        body: formData
    }).then( data => data.json()).then(
        data => {
            dispatch({type: actions.USER_LOGGGED_IN, payload: data})
            dispatch({type: actions.SET_USER_TYPE, payload: data.type_of_user})
            // props.setUser(data.type_of_user)
        }
    ).catch(e => console.log(e))
  }

  useEffect( () => {
    if(localStorage.getItem("token")){
        fetchdetails(localStorage.getItem("token"));
        console.log("HElll Yah")
    }
  }, [])
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
        {/* <Route exact path='/club-profiles/:club' component={ClubProfile}/> */}
        <PrivateRoute exact path='/user/club-profiles/:club' component={ClubProfile} />
        <PrivateRoute exact path='/user/events' component={UserEventsPage} />
        <PrivateRoute exact path='/user/:club/announcements' component={UserAnnouncementsPage} />
        <PrivateRoute exact path='/user/events/:id' component={UserEventHomePage} />
        <PrivateRoute exact path='/club/:club/events' component={ClubEvents} />
        {/* <PrivateRoute exact path='/club/announcements' component={} /> */}
        <PrivateRoute exact path='/club/:club/create-event' component={CreateEvent} />
      </Switch>
    </Router>
    </div>
  );
}

export default App;
