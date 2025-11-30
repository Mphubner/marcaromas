import React from 'react';

export default function TextBlock({ data }) {
    const { html, alignment = 'left' } = data;

    const alignmentClasses = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
        justify: 'text-justify'
    };

    return (
        <div
            className={`prose prose-lg max-w-none ${alignmentClasses[alignment]} prose-headings:text-[#2C2419] prose-a:text-[#8B7355] prose-strong:text-[#2C2419]`}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
