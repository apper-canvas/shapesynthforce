import React from 'react';
import Text from '@/components/atoms/Text';

const StatDisplay = ({ label, value, valueClassName, children }) => {
    return (
        <div className="text-center">
            <Text as="div" className={`text-2xl font-bold ${valueClassName || 'text-white'}`}>
                {value}
            </Text>
            <Text as="div" className="text-xs text-gray-400">
                {label}
            </Text>
            {children}
        </div>
    );
};

export default StatDisplay;