import { useRef, memo } from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
  background-color: #343a40;
  color: white;
  padding: 1rem 2rem;
  text-align: center;
  margin-top: 0px;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
`;

const FooterText = styled.p`
  margin: 0;
  font-size: 0.9rem;
`;

const Footer = () => {
  const renderCountRef = useRef(0);
  renderCountRef.current++;

  if (process.env.NODE_ENV === "development") {
    console.log("👣 Footer render #", renderCountRef.current);
  }

  return (
    <FooterContainer>
      <FooterText>
        &copy; {new Date().getFullYear()} Card Board App. All rights reserved.
      </FooterText>
    </FooterContainer>
  );
};

export default memo(Footer);
