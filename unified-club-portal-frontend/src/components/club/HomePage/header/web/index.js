import React from "react";
import Edit from "../../Edit";
import "./web.css";
function Web(props) {

  const get_title = (title) => {
    // console.log(title);
    if(title)
      return title.split(' ').join('-');
  }

  return (
    <div className="web">
      <div className="web-option">
        {/* <a href="#projects">
          Edit Profile
        </a> */}
        <Edit edit={props.edit} setEdit={props.setEdit}/>
      </div>
      <div className="web-option">
        <a href={'/' + get_title(props.title) + '/events' }>
          Events
        </a>
      </div>
      <div className="web-option">
        <a href="#work">
          Announcements
        </a>
      </div>
      <div className="web-option">
        <a href="#contact">
          Contact
        </a>
      </div>
    </div>
  );
}

export default Web;
