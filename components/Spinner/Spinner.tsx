import React from 'react';
import './Spinner.css'; // Import the CSS file

const Spinner: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#000' }) => {
    return (
        <div
            className="spinner"
            style={{
                width: size,
                height: size,
                borderColor: color,
            }}
        />
    );
};

export default Spinner;