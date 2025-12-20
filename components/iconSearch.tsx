import React from 'react';
import { Icon } from 'semantic-ui-react';

interface IconSearchProps {
  onClick?: () => void;
  disabled?: boolean;
}

const IconSearch: React.FC<IconSearchProps> = ({ onClick, disabled = false }) => {
  return (
    <Icon
      name="search"
      inverted
      circular
      link
      onClick={onClick}
      disabled={disabled}
    />
  );
};

export default IconSearch;
