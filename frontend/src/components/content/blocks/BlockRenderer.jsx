import React from 'react';
import TextBlock from './TextBlock';
import HeadingBlock from './HeadingBlock';
import ImageBlock from './ImageBlock';
import YouTubeBlock from './YouTubeBlock';
import SpotifyBlock from './SpotifyBlock';
import GalleryBlock from './GalleryBlock';
import QuoteBlock from './QuoteBlock';
import CodeBlock from './CodeBlock';
import DividerBlock from './DividerBlock';

const BLOCK_COMPONENTS = {
    TEXT: TextBlock,
    HEADING: HeadingBlock,
    IMAGE: ImageBlock,
    YOUTUBE: YouTubeBlock,
    SPOTIFY: SpotifyBlock,
    GALLERY: GalleryBlock,
    QUOTE: QuoteBlock,
    CODE: CodeBlock,
    DIVIDER: DividerBlock
};

export default function BlockRenderer({ blocks = [] }) {
    if (!blocks || blocks.length === 0) {
        return null;
    }

    return (
        <div className="content-blocks space-y-6">
            {blocks
                .filter(block => block.is_visible !== false)
                .sort((a, b) => a.order - b.order)
                .map(block => {
                    const Component = BLOCK_COMPONENTS[block.type];

                    if (!Component) {
                        console.warn(`Unknown block type: ${block.type}`);
                        return null;
                    }

                    return (
                        <Component
                            key={block.id}
                            data={block.data}
                            blockId={block.id}
                        />
                    );
                })}
        </div>
    );
}
