import React from 'react';

export default function DividerBlock({ data }) {
    const { style = 'solid', spacing = 'medium' } = data;

    const spacingClasses = {
        small: 'my-6',
        medium: 'my-12',
        large: 'my-20'
    };

    if (style === 'decorative') {
        return (
            <div className={`flex items-center justify-center ${spacingClasses[spacing]}`}>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#8B7355]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#8B7355]"></div>
                    <div className="w-2 h-2 rounded-full bg-[#8B7355]"></div>
                </div>
            </div>
        );
    }

    const styleClasses = {
        solid: 'border-solid',
        dashed: 'border-dashed',
        dotted: 'border-dotted'
    };

    return (
        <hr className={`border-t-2 ${styleClasses[style]} border-gray-300 ${spacingClasses[spacing]}`} />
    );
}
