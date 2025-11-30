import React from 'react';

export default function GalleryBlock({ data }) {
    const { images = [], layout = 'grid', columns = 3 } = data;

    if (layout === 'carousel') {
        // Simple carousel - could be enhanced with Swiper
        return (
            <div className="my-8 overflow-x-auto">
                <div className="flex gap-4 pb-4">
                    {images.map((image, index) => (
                        <div key={index} className="flex-shrink-0 w-80">
                            <img
                                src={image.url}
                                alt={image.alt || `Gallery image ${index + 1}`}
                                className="w-full h-60 object-cover rounded-2xl shadow-lg"
                                loading="lazy"
                            />
                            {image.caption && (
                                <p className="mt-2 text-sm text-gray-600 text-center">{image.caption}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Grid layout
    const gridCols = {
        2: 'grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-2 md:grid-cols-4'
    };

    return (
        <div className={`my-8 grid ${gridCols[columns] || gridCols[3]} gap-4`}>
            {images.map((image, index) => (
                <figure key={index}>
                    <img
                        src={image.url}
                        alt={image.alt || `Gallery image ${index + 1}`}
                        className="w-full h-64 object-cover rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                        loading="lazy"
                    />
                    {image.caption && (
                        <figcaption className="mt-2 text-sm text-gray-600 text-center">
                            {image.caption}
                        </figcaption>
                    )}
                </figure>
            ))}
        </div>
    );
}
