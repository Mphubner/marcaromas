import React from 'react';

export default function YouTubeBlock({ data }) {
    const { videoId, title, startTime = 0, autoplay = false } = data;

    const embedUrl = `https://www.youtube.com/embed/${videoId}?start=${startTime}&autoplay=${autoplay ? 1 : 0}`;

    return (
        <div className="my-8">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg bg-gray-100">
                <iframe
                    src={embedUrl}
                    title={title || 'YouTube video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                />
            </div>
            {title && (
                <p className="mt-3 text-sm text-gray-600 text-center">{title}</p>
            )}
        </div>
    );
}
