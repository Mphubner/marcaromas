export const contentTemplates = {
    blank: {
        name: 'Blank',
        description: 'Start from scratch',
        blocks: []
    },

    tutorial: {
        name: 'Tutorial',
        description: 'Step-by-step guide',
        blocks: [
            {
                id: 'temp_1',
                type: 'HEADING',
                data: { text: 'Introduction', level: 2, alignment: 'left' },
                order: 0,
                is_visible: true
            },
            {
                id: 'temp_2',
                type: 'TEXT',
                data: { html: '<p>What you\'ll learn in this tutorial...</p>', alignment: 'left' },
                order: 1,
                is_visible: true
            },
            {
                id: 'temp_3',
                type: 'YOUTUBE',
                data: { videoId: '', title: 'Tutorial Video', startTime: 0, autoplay: false },
                order: 2,
                is_visible: true
            },
            {
                id: 'temp_4',
                type: 'HEADING',
                data: { text: 'Step 1', level: 3, alignment: 'left' },
                order: 3,
                is_visible: true
            },
            {
                id: 'temp_5',
                type: 'TEXT',
                data: { html: '<p>First step explanation...</p>', alignment: 'left' },
                order: 4,
                is_visible: true
            }
        ]
    },

    productReview: {
        name: 'Product Review',
        description: 'Product analysis',
        blocks: [
            {
                id: 'temp_1',
                type: 'IMAGE',
                data: { url: '', alt: 'Product image', caption: '', width: 'full', alignment: 'center' },
                order: 0,
                is_visible: true
            },
            {
                id: 'temp_2',
                type: 'HEADING',
                data: { text: 'Overview', level: 2, alignment: 'left' },
                order: 1,
                is_visible: true
            },
            {
                id: 'temp_3',
                type: 'TEXT',
                data: { html: '<p>Product description...</p>', alignment: 'left' },
                order: 2,
                is_visible: true
            },
            {
                id: 'temp_4',
                type: 'QUOTE',
                data: { text: 'My verdict on this product', author: 'Reviewer', source: '', style: 'pullquote' },
                order: 3,
                is_visible: true
            }
        ]
    },

    howTo: {
        name: 'How-To Guide',
        description: 'Problem solving article',
        blocks: [
            {
                id: 'temp_1',
                type: 'HEADING',
                data: { text: 'The Problem', level: 2, alignment: 'left' },
                order: 0,
                is_visible: true
            },
            {
                id: 'temp_2',
                type: 'TEXT',
                data: { html: '<p>Describe the problem...</p>', alignment: 'left' },
                order: 1,
                is_visible: true
            },
            {
                id: 'temp_3',
                type: 'HEADING',
                data: { text: 'The Solution', level: 2, alignment: 'left' },
                order: 2,
                is_visible: true
            },
            {
                id: 'temp_4',
                type: 'TEXT',
                data: { html: '<p>Explain the solution...</p>', alignment: 'left' },
                order: 3,
                is_visible: true
            },
            {
                id: 'temp_5',
                type: 'CODE',
                data: { code: '// Example code', language: 'javascript', showLineNumbers: true },
                order: 4,
                is_visible: true
            }
        ]
    }
};

export const getTemplate = (templateKey) => {
    return contentTemplates[templateKey] || contentTemplates.blank;
};
