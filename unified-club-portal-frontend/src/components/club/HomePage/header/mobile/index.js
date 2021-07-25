import React from "react";
import "./mobile.css";
import CancelIcon from '@material-ui/icons/Cancel';
// import Edit from "../../Edit";
import { useParams } from "react-router-dom";
//  Reffered from https://www.youtube.com/watch?v=j0yZc2yfa7o&t=173s

function Mobile({ isOpen, setIsOpen, title }) {

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
    <div className="mobile">
      <div onClick={() => setIsOpen(!isOpen)} className="close-icon-container">
        <CancelIcon fontSize='medium' className='close-icon'/>
      </div>
      <div className="mobile-options">
        <div className="mobile-option">
          <a href="/">
            Profile
          </a>
          {/* <Edit edit={edit} setEdit={setEdit}/> */}
        </div>
        <div className="mobile-option">
          <a href="/club/edit-profile">
            Edit Profile
          </a>
          {/* <Edit edit={edit} setEdit={setEdit}/> */}
        </div>
        <div className="mobile-option">
          <a href={'/club/' + get_title(title) + '/events' }>
            Events
          </a>
        </div>
        <div className="mobile-option">
          <a href={'/club/' + get_title(title) + '/announcements' }>
            {" "}
            Announcements
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
