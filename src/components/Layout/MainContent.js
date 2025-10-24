import { useRef, memo } from "react";
import styled from "styled-components";

const MainContentStyle = styled.main`
  flex: 1;
  padding: 1rem 0;
`;

function MainContent({ children }) {
  const renderCountRef = useRef(0);
  renderCountRef.current++;

  if (process.env.NODE_ENV === "development") {
    console.log("🌐 MainContent render #", renderCountRef.current);
  }

  return <MainContentStyle>{children}</MainContentStyle>;
}

export default memo(MainContent);