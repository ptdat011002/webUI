import { styled } from '@packages/ds-core';

export const SaveSuccess = styled.button`
  background-color: transparent;
  color: #ffffff;
  border: none;
  display: flex;
  align-items: center;

  &:hover {
    background-color: transparent;
  }

  .icon-container {
    background-color: #37a18a;
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    margin: 4px
  }

  span {
    font-size: 14px;
  }
`;
