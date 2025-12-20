import React from 'react';

interface LoadingGlobalProps {
  display?: string;
  id?: string;
  message?: string;
}

const LoadingGlobal: React.FC<LoadingGlobalProps> = ({ display, id, message }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: 'rgba(255, 255, 255, 0.8)',
        position: 'fixed',
        top: '0px',
        left: '0px',
        zIndex: 5000,
        display: display || 'block'
      }}
      id={id || 'id-loading-brand'}
    >
      <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src="https://sis.unia.edu.pe/api_authentication/find_file_local?path=app%2Fimg%2Fintegracion_icon.png&size=200x200" alt="loader" className="loading-brand" />
      </div>
    </div>
  );
};

export default LoadingGlobal;
