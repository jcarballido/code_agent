import React from 'react';

interface ImageComponentProps {
  imgSrc: string;
  title: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ imgSrc, title }) => (
  <div className="flex flex-col items-center">
    <img src={imgSrc} alt={title} className="w-full max-w-md h-auto" />
    <h3 className="mt-2 text-lg font-semibold">{title}</h3>
  </div>
);

export default ImageComponent;