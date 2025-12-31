import { useState } from 'react';

interface ExpandableMediaProps {
  title: string;
  mediaType: string;
  mediaUrl: string;
}

const ExpandableMedia: React.FC<ExpandableMediaProps> = ({ title, mediaType, mediaUrl }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-4 py-2 text-xl font-bold text-center w-full border-b"
      >
        {title}
      </button>
      {isExpanded && (
        <div className="p-4">
          {mediaType === 'image' ? (
            <img src={mediaUrl} alt={title} className="w-full" />
          ) : mediaType === 'video' ? (
            <video controls className="w-full">
              <source src={mediaUrl} type={`video/${mediaUrl.split('.').pop()}`} />
              Your browser does not support the video tag.
            </video>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ExpandableMedia;