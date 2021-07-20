import React from 'react'
import TitleLogo from './../../TitleLogo/TitleLogo'
import { useMediaQuery } from "react-responsive";
import { DeviceSize } from './../../../Helpers/Screensize';
import MobileNavLinks from './MobileNavLinks';
import Logout from './../../Auth/Logout';
import NavLinks from './NavLinks';
import styled from "styled-components";

const NavbarContainer = styled.div`
  width: 100%;
  height: 60px;
  box-shadow: 0 1px 3px rgba(15, 15, 15, 0.13);
  display: flex;
  align-items: center;
//   padding: 0 1.5em;
`;

const LeftSection = styled.div`
  display: flex;
  margin-left: 1.5em;
`;

const MiddleSection = styled.div`
  display: flex;
  flex: 2;
  height: 100%;
  justify-content: center;
`;

const RightSection = styled.div`
  display: flex;
  margin-right: 1.5em;
`;

const Navbar = () => {
    const isMobile = useMediaQuery({ maxWidth: DeviceSize.mobile });
    return (
        <NavbarContainer>
            <LeftSection> 
                <TitleLogo />
            </LeftSection>
            <MiddleSection>{!isMobile && <NavLinks />}</MiddleSection>
            <RightSection>
            {!isMobile && <Logout />}
            {isMobile && <MobileNavLinks />}
            </RightSection>
        </NavbarContainer>
    )
}

export default Navbar
