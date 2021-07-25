import React, {useEffect} from 'react';
import './App.css';
import { BrowserRouter as Router,Switch, Route} from 'react-router-dom';
import Login from './components/Auth/Login';
import { PrivateRoute } from './Helpers/PrivateRoute';
import { Dashboard } from './components/Dashboard/Dashboard';
import {useDispatch} from 'react-redux';
import * as actions from './Helpers/actions/actionTypes'
import ClubProfile from './components/user/clubs_profile/ClubProfile';
import UserEventsPage from './components/user/events/Events'
import ClubCreateEvent from './components/club/Events/CreateEvents/CreateEvents'
import ClubEvents from './components/club/Events/ListEvents/Events'
import UserEventHomePage from './components/user/EventsHome/Home'
import UserAnnouncementsPage from './components/user/announcements/AnnouncementList'
import ClubAnnouncementsPage from './components/club/announcements/AnnouncementsList'
import CreateClubAnnouncements from './components/club/announcements/CreateAnnouncements/CreateAnnouncements'
import ClubEditProfile from './components/club/HomePage/EditHome/HomeEdit'
import AdminCreateClub from './components/admin/CreateClub/CreateClub'
import AdminEvents from './components/admin/events/Events'
import AdminEventsHome from './components/admin/EventHome/EventHome'
import UserClubEvents from './components/user/ClubEvents/EventList'
import ClubEventsHome from './components/club/Events/EventsHome/EventsHome'
import AdminAnnouncements from './components/admin/announcements/AnnouncementList'
import AdminClubProfile from './components/admin/clubHome/ClubProfile'
import AdminEditProfile from './components/admin/EditClubProfile/HomeEdit'
import Error404 from './components/Error/Error404';

function App() {

  const dispatch = useDispatch();

  const fetchdetails = () => {
    let formData = new FormData();
    formData.append("token", localStorage.getItem("token"))
    fetch('http://localhost:8000/api/user/get_info', {
        method: "POST",
        body: formData
    }).then( data => data.json()).then(
        data => {
            dispatch({type: actions.USER_LOGGGED_IN, payload: data})
            if(data.type_of_user === 'user'){
              dispatch({type: actions.SET_USER_TYPE, payload: 'cmkua43qrh'})
            }else if(data.type_of_user === 'club'){
                dispatch({type: actions.SET_USER_TYPE, payload: 'xhuoxfn3'})
            }else if(data.type_of_user === 'admin'){
                dispatch({type: actions.SET_USER_TYPE, payload: 'vbekfka29'})
            }
            // dispatch({type: actions.SET_USER_TYPE, payload: data.type_of_user})
            // props.setUser(data.type_of_user)
        }
    ).catch(e => console.log(e))
  }

  useEffect( () => {
    if(localStorage.getItem("token")){
        fetchdetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <div className="App">
      <Router>
      <Switch>
        <PrivateRoute exact path='/' component={Dashboard}/>
        <Route exact path='/login' component={Login}/>

        <PrivateRoute exact path='/user/club-profiles/:club' component={ClubProfile} />
        <PrivateRoute exact path='/user/events' component={UserEventsPage} />
        <PrivateRoute exact path='/user/:club/announcements' component={UserAnnouncementsPage} />
        <PrivateRoute exact path='/user/:club/events' component={UserClubEvents}/>
        <PrivateRoute exact path='/user/events/:id' component={UserEventHomePage} />
        
        
        <PrivateRoute exact path='/club/edit-profile' component={ClubEditProfile} />
        <PrivateRoute exact path='/club/:club/events' component={ClubEvents} />
        <PrivateRoute exact path='/club/:club/announcements' component={ClubAnnouncementsPage} />
        <PrivateRoute exact path='/club/:club/create-announcement' component={CreateClubAnnouncements} />
        <PrivateRoute exact path='/club/:club/create-event' component={ClubCreateEvent} />
        <PrivateRoute exact path='/club/events/:id' component={ClubEventsHome} />
        
        
        <PrivateRoute exact path='/create-club' component={AdminCreateClub} />
        <PrivateRoute exact path='/admin/events' component={AdminEvents} />
        <PrivateRoute exact path='/admin/events/:id' component={AdminEventsHome} />
        <PrivateRoute exact path='/admin/announcements' component={AdminAnnouncements} />
        <PrivateRoute exact path='/admin/club-profiles/:club' component={AdminClubProfile} />
        <PrivateRoute exact path='/admin/:club/edit-profile' component={AdminEditProfile} />
        <Route component={Error404} />
      </Switch>
    </Router>
    </div>
  );
}

export default App;
