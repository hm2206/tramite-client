import React, { ReactNode } from 'react';

interface ShowProps {
  condicion?: any;
  children?: ReactNode;
}

const Show: React.FC<ShowProps> = ({ condicion = true, children = null }) => {
  if (condicion) return <>{children}</>;
  return null;
};

export default Show;
