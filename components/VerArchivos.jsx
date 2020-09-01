import React, { Fragment } from 'react'

function ModalView({ header, headerStyle = {}, headerClass = "", onClose, children, content = null }) {
    return (
        <Fragment>
            <div style={ { background: 'rgba(0,0,0,.5)', position: 'fixed', width: '100%', height: '100%', top: '0px', left: '0px', zIndex: 99999999 } }>
                <div className="row justify-content-center align-items-center" style={ { minHeight: '100vh' } }>
                    <div className="col-md-6">
                        <div className="card">
                            <div className={ `card-header ${headerStyle}` } style={ headerStyle }>
                                { header }
                                <i className="fas fa-times close" style={ { cursor: 'pointer' } } onClick={ (e) => typeof onClose == 'function' ? onClose(e) : null }></i>
                            </div>
                            <div className="card-body">
                                { children || content }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default ModalView;