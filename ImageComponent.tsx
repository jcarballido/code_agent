import React from 'react';

interface ImageComponentProps {
  src: string;
  altText: string;
  title: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ src, altText, title }) => (
  <div className="flex flex-col items-center">
    <img src={src} alt={altText} className="max-h-500 max-w-full rounded-lg" />
    <h2 className="mt-4 text-xl font-bold">{title}</h2>
    <p className="mt-2 text-gray-600">Description goes here...</p>
  </div>
);

export default ImageComponent;