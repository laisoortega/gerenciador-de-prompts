import React from 'react';
import { Tag, AllTag } from '../ui/Tag';

interface TagFilterProps {
    tags: string[];
    selectedTag: string | null;
    onSelectTag: (tag: string | null) => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({
    tags,
    selectedTag,
    onSelectTag,
}) => {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <AllTag
                active={selectedTag === null}
                onClick={() => onSelectTag(null)}
            />

            {tags.map((tag) => (
                <Tag
                    key={tag}
                    label={tag}
                    active={selectedTag === tag}
                    onClick={() => onSelectTag(selectedTag === tag ? null : tag)}
                />
            ))}

            <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    );
};
