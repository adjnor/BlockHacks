import React from 'react';
// import { HashLink as Link } from 'react-router-hash-link';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: flex-end;
`;

// const NavLink = styled(Link)`
//   margin: 10px;
//   text-decoration: none;
//   color: #fff;
// `;

function Navbar() {
  return (
    <Wrapper>
      {/* <NavLink smooth to="/#about">
        About
      </NavLink> */}
    </Wrapper>
  );
}

export default Navbar;
