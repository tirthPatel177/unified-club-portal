import React from "react";
import "./mobile.css";
import CancelIcon from '@material-ui/icons/Cancel';

function Mobile({ isOpen, setIsOpen }) {
  return (
    <div className="mobile">
      <div onClick={() => setIsOpen(!isOpen)} className="close-icon-container">
        <CancelIcon fontSize='medium' className='close-icon'/>
      </div>
      <div className="mobile-options">
        <div className="mobile-option">
          <a href="#projects">
            Edit Profile
          </a>
        </div>
        <div className="mobile-option">
          <a href="#skills">
            Events
          </a>
        </div>
        <div className="mobile-option">
          <a href="#work">
            {" "}
            Announcements
          </a>
        </div>
        <div className="mobile-option">
          <a href="#contact">
            Contact
          </a>
        </div>
      </div>
    </div>
  );
}

export default Mobile;
