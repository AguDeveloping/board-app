import styled from "styled-components";

const ClearButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #6c757d;
  &:hover {
    color: #343a40;
  }
`;
export default ClearButton;
