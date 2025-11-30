import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEOHead({
    title,
    description,
    keywords = [],
    image,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = []
}) {
    const siteName = 'Marc Aromas';
    const defaultImage = 'https://marcaromas.com.br/og-image.jpg'; // Replace with actual default image
    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const currentUrl = url || window.location.href;

    // JSON-LD Structured Data
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': type === 'article' ? 'Article' : 'WebSite',
        headline: title,
        description: description,
        image: image || defaultImage,
        url: currentUrl,
        datePublished: publishedTime,
        dateModified: modifiedTime || publishedTime,
        author: author ? {
            '@type': 'Person',
            name: author
        } : {
            '@type': 'Organization',
            name: siteName
        },
        publisher: {
            '@type': 'Organization',
            name: siteName,
            logo: {
                '@type': 'ImageObject',
                url: 'https://marcaromas.com.br/logo.png' // Replace with actual logo
            }
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': currentUrl
        }
    };

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
            <link rel="canonical" href={currentUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image || defaultImage} />
            <meta property="og:url" content={currentUrl} />
            {publishedTime && <meta property="article:published_time" content={publishedTime} />}
            {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
            {section && <meta property="article:section" content={section} />}
            {tags.map(tag => (
                <meta property="article:tag" content={tag} key={tag} />
            ))}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image || defaultImage} />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Helmet>
    );
}
