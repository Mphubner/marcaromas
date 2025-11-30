import React from 'react';

export default function ImageBlock({ data }) {
    const { url, alt, caption, width = 'full', alignment = 'center' } = data;

    const widthClasses = {
        full: 'w-full',
        medium: 'max-w-3xl mx-auto',
        small: 'max-w-xl mx-auto'
    };

    const alignmentClasses = {
        left: 'mr-auto',
        center: 'mx-auto',
        right: 'ml-auto'
    };

    return (
        <figure className={`my-8 ${widthClasses[width]} ${alignmentClasses[alignment]}`}>
            <img
                src={url}
                alt={alt || ''}
                className="w-full rounded-2xl shadow-lg object-cover"
                loading="lazy"
            />
            {caption && (
                <figcaption className="mt-3 text-sm text-gray-600 text-center italic">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
}
