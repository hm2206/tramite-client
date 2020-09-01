import React from 'react';

export default ({ condicion = true, children }) => {
    if (condicion) return children;
    return null;
}