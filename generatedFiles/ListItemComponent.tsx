import React from 'react';

interface ListItemComponentProps {
  items: string[];
  titleBackgroundColor?: string;
}

const ListItemComponent: React.FC<ListItemComponentProps> = ({ items, titleBackgroundColor = '#ffffff' }) => (
  <div className="bg-gray-100 p-4 rounded-lg shadow-md">
    <h2 className="text-xl font-bold mb-3" style={{ backgroundColor: titleBackgroundColor }}>
      List Title
    </h2>
    {items.map((item, index) => (
      <div key={index} className={`py-2 px-3 border-b last:border-b-0`}>
        {item}
      </div>
    ))}
  </div>
);

export default ListItemComponent;