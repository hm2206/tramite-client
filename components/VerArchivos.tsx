import React, { ReactNode } from 'react';

interface ModalViewProps {
  header?: string;
  headerStyle?: React.CSSProperties;
  headerClass?: string;
  onClose?: (e: React.MouseEvent) => void;
  children?: ReactNode;
  content?: ReactNode;
}

const ModalView: React.FC<ModalViewProps> = ({
  header,
  headerStyle = {},
  headerClass = "",
  onClose,
  children,
  content = null
}) => {
  return (
    <>
      <div style={{
        background: 'rgba(0,0,0,.5)',
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: '0px',
        left: '0px',
        zIndex: 99999999,
        overflow: 'hidden'
      }}>
        <div className="row justify-content-center align-items-center h-100">
          <div className="col-md-6 pt-2 pb-2 h-100">
            <div className="row justify-content-center align-items-center h-100 w-100">
              <div className="card w-100" style={{ maxHeight: '100%', overflowY: 'auto' }}>
                <div className={`card-header ${headerClass}`} style={headerStyle}>
                  {header}
                  <i
                    className="fas fa-times close"
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => typeof onClose === 'function' ? onClose(e) : null}
                  ></i>
                </div>
                <div className="card-body">
                  {children || content}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalView;
