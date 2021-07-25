import React, { useState } from "react";
import styled from "styled-components";
import Logout from "./../../Auth/Logout";
import  MenuToggle  from "./MenuToggle";

//Reffered and used https://www.youtube.com/watch?v=mt7bcvsreMQ&t=210s

const NavLinksContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
`;

const LinksWrapper = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  height: 100%;
  list-style: none;
  background-color: #fff;
  width: 100%;
  flex-direction: column;
  position: fixed;
  top: 65px;
  left: 0;
  z-index: 5;
`;

const LinkItem = styled.li`
  width: 100%;
  /* padding: 0 1.1em; */
  color: #222;
  font-weight: 500;
  font-size: 16px;
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const Link = styled.a`
  text-decoration: none;
  color: inherit;
  font-size: inherit;
//   text-align: center;    
`;
const Marginer = styled.div`
  height: 0.8em;
`;

const CenterLogout = styled.div`
  align-self: center;
`;

export default function MobileNavLinks(props) {
  const [isOpen, setOpen] = useState(false);

  return (
    <NavLinksContainer>
      <MenuToggle isOpen={isOpen} toggle={() => setOpen(!isOpen)} />
      {isOpen && (
        <LinksWrapper>
          <LinkItem>
            <Link href="/">Clubs</Link>
          </LinkItem>
          <LinkItem>
            <Link href="/admin/events">Events</Link>
          </LinkItem>
          <LinkItem>
            <Link href="/admin/announcements">Announcements</Link>
          </LinkItem>
          <Marginer />
          <CenterLogout>
            <Logout />
          </CenterLogout>
        </LinksWrapper>
      )}
    </NavLinksContainer>
  );
}
