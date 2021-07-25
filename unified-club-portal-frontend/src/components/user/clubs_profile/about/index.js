import React from "react";
import "./about.css";

//  Reffered from https://www.youtube.com/watch?v=j0yZc2yfa7o&t=173s
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
            src={club.profile}
            className="picture"
            alt='profile'
          />
        </div>
      </div>
      {/* <SocialContact /> */}
    </div>
  );
}

export default About;
