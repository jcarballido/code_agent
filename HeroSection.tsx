```tsx
import React from 'react';

interface HeroSectionProps {
  name: string;
  role: string;
  location: string;
  toolsExperiencedWith: string[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ name, role, location, toolsExperiencedWith }) => {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center">{name}</h1>
      <p className="text-xl text-center">{role}</p>
      <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 mt-4">
        {location}
      </a>
      <div className="flex flex-wrap justify-center mt-6 gap-4">
        {toolsExperiencedWith.map((tool, index) => (
          <span key={index} className={`bg-${tool.split(' ').join('-').toLowerCase()}-500 text-white px-3 py-1 rounded-full`}>
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
```
