import React from "react";
import "./web.css";
function Web() {
  return (
    <div className="web">
      <div className="web-option">
        <a href="#projects">
          Edit Profile
        </a>
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
