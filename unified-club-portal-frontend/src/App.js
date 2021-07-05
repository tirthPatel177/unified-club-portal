import React from 'react';
import './App.css';
import { BrowserRouter as Router,Switch, Route} from 'react-router-dom';
import Login from './components/Login/Login';

function App() {

  const user = '';

  return (
    <div className="App">
      {
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
      }
    </div>
  );
}

export default App;
