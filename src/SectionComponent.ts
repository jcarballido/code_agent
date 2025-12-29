import React from 'react';

interface SectionComponentProps {
  children1: React.ReactNode;
  children2: React.ReactNode;
}

const SectionComponent: React.FC<SectionComponentProps> = ({ children1, children2 }) => (
  <div className="flex h-full">
    <div className="w-1/3 bg-gray-100 p-4">{children1}</div>
    <div className="flex-grow bg-gray-200 p-4">{children2}</div>
  </div>
);

export default SectionComponent;