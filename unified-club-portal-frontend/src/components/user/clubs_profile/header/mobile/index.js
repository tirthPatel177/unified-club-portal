import React from "react";
import "./mobile.css";
import CancelIcon from '@material-ui/icons/Cancel';
import { useParams } from "react-router-dom";

function Mobile({ isOpen, setIsOpen, title }) {

  let {club} = useParams();

  return (
    <div className="mobile">
      <div onClick={() => setIsOpen(!isOpen)} className="close-icon-container">
        <CancelIcon fontSize='medium' className='close-icon'/>
      </div>
      <div className="mobile-options">
        <div className="mobile-option">
          <a href="#skills">
            Events
          </a>
        </div>
        <div className="mobile-option">
          <a href={"/user/"+ club +"/announcements"}>
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
