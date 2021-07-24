import React, { useState } from "react";
import "./header.css";
import Mobile from "./mobile/index";
import Web from "./web/index";
import DashboardIcon from '@material-ui/icons/Dashboard';

function Header(props) {
  const [isOpen, setIsOpen] = useState(false);
  
  



  return (
    <div className="header">
      <div className="logo">
        Club
      </div>
      <div className="menu">
        <div className="web-menu">
          {/* <Web edit={props.edit} setEdit={props.setEdit} title={props.title}/> */}
          <Web title={props.title}/>
        </div>

        <div className="mobile-menu">
          <div onClick={() => setIsOpen(!isOpen)}>
            <DashboardIcon />
          </div>
          {/* {isOpen && <Mobile isOpen={isOpen} setIsOpen={setIsOpen} edit={props.edit} setEdit={props.setEdit} title={props.title}/>} */}
          {isOpen && <Mobile isOpen={isOpen} setIsOpen={setIsOpen}  title={props.title}/>}
        </div>
      </div>
    </div>
  );
}

export default Header;
