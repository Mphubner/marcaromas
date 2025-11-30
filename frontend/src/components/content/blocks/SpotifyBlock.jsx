import React from 'react';

export default function SpotifyBlock({ data }) {
    const { type, id, theme = 'light' } = data;

    // type can be: track, playlist, album, artist
    const embedUrl = `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=${theme === 'dark' ? 1 : 0}`;

    const height = type === 'track' ? '152' : '380';

    return (
        <div className="my-8">
            <iframe
                src={embedUrl}
                width="100%"
                height={height}
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-2xl shadow-lg"
            />
        </div>
    );
}
