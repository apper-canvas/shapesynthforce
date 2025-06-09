import React from 'react';
import { motion } from 'framer-motion';

const TargetOutline = ({ targetOutlineData }) => {
    if (!targetOutlineData) return null;

    return (
        <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            animate={{
                scale: [1, 1.05, 1],
                opacity: [0.6, 0.8, 0.6]
            }}
            transition={{ duration: 2, repeat: Infinity }}
        >
            <div
                className="border-4 border-accent target-glow"
                style={{
                    width: targetOutlineData.width,
                    height: targetOutlineData.height,
                    borderRadius: targetOutlineData.borderRadius || '0',
                    transform: `rotate(${targetOutlineData.rotation || 0}deg)`
                }}
            />
        </motion.div>
    );
};

export default TargetOutline;