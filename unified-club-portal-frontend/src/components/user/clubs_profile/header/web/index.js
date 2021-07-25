import React from "react";
import { useParams } from "react-router-dom";
import "./web.css";

//  Reffered from https://www.youtube.com/watch?v=j0yZc2yfa7o&t=173s
function Web() {

  let {club} = useParams();

  return (
    <div className="web">
      <div className="web-option">
        <a href={"/user/" + club + "/events"}>
          Events
        </a>
      </div>
      <div className="web-option">
        <a href={"/user/"+ club +"/announcements"}>
          Announcements
        </a>
      </div>
      {/* <div className="web-option">
        <a href="#contact">
          Contact
        </a>
      </div> */}
    </div>
  );
}

export default Web;
