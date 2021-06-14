import React from 'react';
import { Icon } from 'semantic-ui-react';

const IconSearch = ({ onClick = null, disabled = false }) => {
    return (
        <Icon name='search' 
            inverted 
            circular 
            link 
            onClick={onClick}
            disabled={disabled}
        />
    );
}


export default IconSearch;