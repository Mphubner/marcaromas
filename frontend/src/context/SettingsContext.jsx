import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

const SettingsContext = createContext();

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(null);

    const { data, isLoading } = useQuery({
        queryKey: ['public-settings'],
        queryFn: async () => {
            const response = await api.get('/settings/public/all');
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    useEffect(() => {
        if (data) {
            setSettings(data);
            applyBranding(data.branding);
            injectScripts(data.scripts);
        }
    }, [data]);

    const applyBranding = (branding) => {
        if (!branding) return;
        const root = document.documentElement;
        if (branding.primaryColor) root.style.setProperty('--primary', branding.primaryColor);
        if (branding.secondaryColor) root.style.setProperty('--secondary', branding.secondaryColor);
        if (branding.backgroundColor) root.style.setProperty('--background', branding.backgroundColor);
        if (branding.textColor) root.style.setProperty('--foreground', branding.textColor);

        // Font handling would go here (loading google fonts dynamically)
    };

    const injectScripts = (scripts) => {
        if (!scripts) return;

        // Google Analytics
        if (scripts.googleAnalyticsId && !window.dataLayer) {
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${scripts.googleAnalyticsId}`;
            document.head.appendChild(script);

            const inlineScript = document.createElement('script');
            inlineScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${scripts.googleAnalyticsId}');
      `;
            document.head.appendChild(inlineScript);
        }

        // Custom Head Scripts
        if (scripts.customHead) {
            // Warning: This is dangerous and should be sanitized or handled carefully
            // For now, we assume admin is trusted
            const range = document.createRange();
            const fragment = range.createContextualFragment(scripts.customHead);
            document.head.appendChild(fragment);
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, isLoading }}>
            {children}
        </SettingsContext.Provider>
    );
};
