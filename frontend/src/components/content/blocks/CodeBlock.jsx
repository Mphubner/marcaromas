import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function CodeBlock({ data }) {
    const { code, language = 'javascript', showLineNumbers = true } = data;

    return (
        <div className="my-8 rounded-2xl overflow-hidden shadow-lg">
            <SyntaxHighlighter
                language={language}
                style={tomorrow}
                showLineNumbers={showLineNumbers}
                className="text-sm"
            >
                {code}
            </SyntaxHighlighter>
        </div>
    );
}
