import React from "react";
import Edit from "../../Edit";
import "./web.css";
function Web(props) {
  return (
    <div className="web">
      <div className="web-option">
        {/* <a href="#projects">
          Edit Profile
        </a> */}
        <Edit edit={props.edit} setEdit={props.setEdit}/>
      </div>
      <div className="web-option">
        <a href="#skills">
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
