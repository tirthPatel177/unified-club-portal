import React from "react";
import "./mobile.css";
import CancelIcon from '@material-ui/icons/Cancel';
import { useParams } from "react-router-dom";

//  Reffered from https://www.youtube.com/watch?v=j0yZc2yfa7o&t=173s
function Mobile({ isOpen, setIsOpen, title }) {

  let {club} = useParams();

  return (
    <div className="mobile">
      <div onClick={() => setIsOpen(!isOpen)} className="close-icon-container">
        <CancelIcon fontSize='medium' className='close-icon'/>
      </div>
      <div className="mobile-options">
        <div className="mobile-option">
        <a href={"/admin/club-profiles/" + club}>
          Profile
        </a>
        </div>
        <div className="mobile-option">
        <a href={"/admin/"+ club + "/edit-profile"}>
          Edit Profile
        </a>
        </div>
        {/* <div className="mobile-option">
          <a href="#contact">
            Contact
          </a>
        </div> */}
      </div>
    </div>
  );
}

export default Mobile;
