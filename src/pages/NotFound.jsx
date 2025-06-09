import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="mb-8"
        >
          <ApperIcon name="Shapes" size={120} className="text-primary mx-auto" />
        </motion.div>
        <h1 className="text-4xl font-heading text-white mb-4">Shape Not Found</h1>
        <p className="text-gray-400 mb-8">This page seems to have morphed away...</p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:scale-105 transition-transform"
        >
          <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
          Back to Game
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;