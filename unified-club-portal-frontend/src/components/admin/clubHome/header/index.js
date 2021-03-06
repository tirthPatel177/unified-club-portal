import React, { useState } from "react";
import "./header.css";
import Mobile from "./mobile/index";
import Web from "./web/index";
import DashboardIcon from '@material-ui/icons/Dashboard';
import { useParams } from "react-router-dom";


//  Reffered from https://www.youtube.com/watch?v=j0yZc2yfa7o&t=173s
function Header(props) {
  const [isOpen, setIsOpen] = useState(false);
  // const handleLogoClick = () => {
  //   window.scrollTo(0, 0);
  // };
  // window.onscroll = function () {
  //   setIsOpen(false);
  // };


  // const [title, settitle] = useState('');

  // useEffect(() => {
  //   settitle(get_title(props.club.title));
  // }, [])

  let {club} = useParams();
  

  return (
    <div className="header">
      <div 
      // onClick={handleLogoClick} 
      className="logo">
        {club.split('_').join(' ')}
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
