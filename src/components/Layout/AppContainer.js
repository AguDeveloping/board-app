import { useRef, memo } from "react";
import styled from "styled-components";

const AppContainerStyle = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

function AppContainer({ children }) {
  const renderCountRef = useRef(0);
  renderCountRef.current++;

  if (process.env.NODE_ENV === "development") {
    console.log("📦 AppContainer render #", renderCountRef.current);
  }

  return <AppContainerStyle>{children}</AppContainerStyle>;
}

export default memo(AppContainer);
