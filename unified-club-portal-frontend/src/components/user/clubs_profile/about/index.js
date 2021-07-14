import React from "react";
import "./about.css";
function About({club}) {
  return (
    <div className="about">
      <div className="about-top">
        <div className="about-info">
          Hello There 👋, Welcome to <br />
          <span className="info-name">{!club.title ? "Club Name" : club.title}</span>.<br /> 
            {!club.tag_line ? "Club Tagline" : club.tag_line}
        </div>
        <div className="about-photo">
          <img
            src={!club.profile ? require("./../../../../Resources/club-profile.jpg").default : club.profile}
            className="picture"
          />
        </div>
      </div>
      {/* <SocialContact /> */}
    </div>
  );
}

export default About;
