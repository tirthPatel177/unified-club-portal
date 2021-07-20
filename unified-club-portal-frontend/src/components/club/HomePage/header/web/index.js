import React from "react";
import Edit from "../../Edit";
import "./web.css";
import {useParams} from 'react-router-dom'
function Web(props) {

  let {club} = useParams();

  const get_title = (title) => {
    // console.log(title);
    if(title){
      return title.split(' ').join('-');
    }
    else{
      
      return club;
    }
  }

  return (
    <div className="web">
      <div className="web-option">
        <a href="/">
          Profile
        </a>
        {/* <Edit edit={props.edit} setEdit={props.setEdit}/> */}
      </div>
      <div className="web-option">
        <a href="/club/edit-profile">
          Edit Profile
        </a>
        {/* <Edit edit={props.edit} setEdit={props.setEdit}/> */}
      </div>
      <div className="web-option">
        <a href={'/club/' + get_title(props.title) + '/events' }>
          Events
        </a>
      </div>
      <div className="web-option">
        <a href={'/club/' + get_title(props.title) + '/announcements' }>
          Announcements
        </a>
      </div>
      {/* <div className="web-option">
        <a href="#contact">
          Contact
        </a>
      </div> */}
    </div>
  );
}

export default Web;
