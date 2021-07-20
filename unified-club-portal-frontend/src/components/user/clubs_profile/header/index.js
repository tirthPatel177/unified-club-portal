import React, { useState, useEffect } from "react";
import "./header.css";
import Mobile from "./mobile/index";
import Web from "./web/index";
import DashboardIcon from '@material-ui/icons/Dashboard';

function Header(props) {
  const [isOpen, setIsOpen] = useState(false);
  const handleLogoClick = () => {
    window.scrollTo(0, 0);
  };
  window.onscroll = function () {
    setIsOpen(false);
  };

  const get_title = (title) => {
    // console.log(title);
    if (title)
      return title.split(' ').join('-');  
  }

  // const [title, settitle] = useState('');

  // useEffect(() => {
  //   settitle(get_title(props.club.title));
  // }, [])
  

  return (
    <div className="header">
      <div onClick={handleLogoClick} className="logo">
        Club
      </div>
      <div className="menu">
        <div className="web-menu">
          <Web />
        </div>

        <div className="mobile-menu">
          <div onClick={() => setIsOpen(!isOpen)}>
            <DashboardIcon />
          </div>
          {isOpen && <Mobile isOpen={isOpen} setIsOpen={setIsOpen} />}
        </div>
      </div>
    </div>
  );
}

export default Header;
