import React from "react";
import { useParams } from "react-router-dom";
import "./web.css";
function Web() {

  let {club} = useParams();

  return (
    <div className="web">
      <div className="web-option">
        <a href={"/admin/club-profiles/" + club}>
          Profile
        </a>
      </div>
      <div className="web-option">
        <a href={"/admin/"+ club + "/edit-profile"}>
          Edit Profile
        </a>
      </div>
      {/* <div className="web-option">
        <a href="/contact">
          Contact
        </a>
      </div> */}
    </div>
  );
}

export default Web;
