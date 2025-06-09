import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ onClick, children, className, disabled, whileHover, whileTap }) => {
    return (
        <motion.button
            onClick={onClick}
            className={className}
            disabled={disabled}
            whileHover={whileHover}
            whileTap={whileTap}
        >
            {children}
        </motion.button>
    );
};

export default Button;