import React from 'react';

export default function HeadingBlock({ data }) {
    const { text, level = 2, alignment = 'left' } = data;

    const alignmentClasses = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    };

    const HeadingTag = `h${level}`;

    const sizeClasses = {
        1: 'text-4xl md:text-5xl',
        2: 'text-3xl md:text-4xl',
        3: 'text-2xl md:text-3xl',
        4: 'text-xl md:text-2xl',
        5: 'text-lg md:text-xl',
        6: 'text-base md:text-lg'
    };

    return (
        <HeadingTag
            className={`font-bold font-['Playfair_Display'] text-[#2C2419] mb-4 ${sizeClasses[level]} ${alignmentClasses[alignment]}`}
        >
            {text}
        </HeadingTag>
    );
}
