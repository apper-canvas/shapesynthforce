import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Loader = () => {
    return (
        <div className="h-screen bg-surface-900 flex items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-primary"
            >
                <ApperIcon name="Loader" size={48} />
            </motion.div>
        </div>
    );
};

export default Loader;