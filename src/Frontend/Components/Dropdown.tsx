import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import React from 'react';
import styled from 'styled-components';
import dfstyles from '../Styles/dfstyles';

export interface DropdownItem {
  label: string;
  action: () => void;
}

export interface DropdownProps {
  items: DropdownItem[];
  open: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({ items, open }) => {
  if (items.length == 0) {
    return <></>;
  }
  return (
    <DropdownMenu.Root open={open} modal={false}>
      <DropdownMenu.Trigger />

      <Content>
        {/* <DropdownMenu.Label /> */}
        {items.map((item) => (
          <Item onClick={item.action}>{item.label}</Item>
        ))}
      </Content>
    </DropdownMenu.Root>
  );
};

const Content = styled(DropdownMenu.Content)`
  background: ${dfstyles.colors.backgroundlighter};
  color: #bbb;
  border-radius: 6px;
  min-width: 220;
  border-radius: 6px;
  padding: 5px;
  box-shadow: 0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2);
`;

const Item = styled(DropdownMenu.Item)`
  color: #bbb;
  padding: 8px;
  border-radius: 3px;
  cursor: pointer;
  &:hover {
    background: ${dfstyles.colors.backgrounddark};
    color: #fff;
    outline: none;
  }
`;
