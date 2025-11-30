import React from 'react';

export default function QuoteBlock({ data }) {
    const { text, author, source, style = 'blockquote' } = data;

    if (style === 'pullquote') {
        return (
            <div className="my-12 border-l-4 border-[#8B7355] pl-8 pr-4 py-2">
                <blockquote className="text-2xl font-['Playfair_Display'] text-[#2C2419] italic leading-relaxed">
                    "{text}"
                </blockquote>
                {author && (
                    <cite className="block mt-4 text-sm text-gray-600 not-italic">
                        — {author}
                        {source && <span className="text-gray-500">, {source}</span>}
                    </cite>
                )}
            </div>
        );
    }

    return (
        <blockquote className="my-8 p-6 bg-gradient-to-r from-[#F9F8F6] to-[#FAFAF9] rounded-2xl border-l-4 border-[#8B7355]">
            <p className="text-lg text-gray-800 italic leading-relaxed">"{text}"</p>
            {author && (
                <cite className="block mt-3 text-sm text-gray-600 not-italic">
                    — {author}
                    {source && <span className="text-gray-500">, {source}</span>}
                </cite>
            )}
        </blockquote>
    );
}
