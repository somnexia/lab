// src/utils/withNavigate.js
import { useNavigate } from 'react-router-dom';
import React from 'react';

const withNavigate = (Component) => {
    return (props) => {
        const navigate = useNavigate();
        return <Component {...props} navigate={navigate} />;
    };
};

export default withNavigate;
