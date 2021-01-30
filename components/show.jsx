import React from 'react';

export default ({ condicion = true, children = null }) => {
    if (condicion) return children;
    return null;
}