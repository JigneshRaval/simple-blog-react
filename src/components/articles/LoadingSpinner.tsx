import React from 'react';

const LoadingSpinner = () => (
    <div className="loading-spinner">
        <div className="spinner">
            <div className="rect1"></div>
            <div className="rect2"></div>
            <div className="rect3"></div>
            <div className="rect4"></div>
            <div className="rect5"></div>
        </div>
        <div>Loading articles...</div>
    </div>
);

export default LoadingSpinner;
