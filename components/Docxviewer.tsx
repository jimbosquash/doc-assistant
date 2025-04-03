'use client';

import React, { useEffect, useState } from 'react';
import mammoth from 'mammoth';
import { Card, CardContent } from '@mui/material';

type DocxViewerProps = {
    fileUrl: string;
    onPlaceholdersExtracted?: (placeholders: string[]) => void;
};

const DocxViewer: React.FC<DocxViewerProps> = ({ fileUrl, onPlaceholdersExtracted }) => {
    const [htmlContent, setHtmlContent] = useState<string>('');
    const [placeholders, setPlaceholders] = useState<string[]>([]);

    useEffect(() => {
        const fetchAndConvertDocx = async () => {
            try {
                const response = await fetch(fileUrl);
                if (!response.ok) throw new Error(`❌ File not found: ${response.statusText}`);

                const arrayBuffer = await response.arrayBuffer();
                const result = await mammoth.convertToHtml({ arrayBuffer });

                const htmlWithSpans = highlightPlaceholders(result.value);
                const extracted = extractPlaceholders(result.value);

                setHtmlContent(htmlWithSpans);
                setPlaceholders(extracted);
                onPlaceholdersExtracted?.(extracted);
            } catch (error) {
                console.error(error);
                setHtmlContent(`<p style="color:red;">Unable to load document from <code>${fileUrl}</code></p>`);
                setPlaceholders([]);
                onPlaceholdersExtracted?.([]);
            }
        };

        fetchAndConvertDocx();
    }, [fileUrl, onPlaceholdersExtracted]);

    useEffect(() => {
        const elements = document.querySelectorAll('.docx-content .placeholder');

        elements.forEach((el) => {
            el.addEventListener('click', () => {
                // Remove highlight from all
                elements.forEach((e) => e.classList.remove('active-placeholder'));

                // Highlight the clicked one
                el.classList.add('active-placeholder');
            });
        });

        return () => {
            elements.forEach((el) => el.replaceWith(el.cloneNode(true)));
        };
    }, [htmlContent]);

    return (
        <Card sx={{ maxWidth: '960px', margin: '2rem auto', padding: 2 }}>
            <CardContent>
                <div
                    className="docx-content"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
            </CardContent>
        </Card>
    );
};

// Helpers
const highlightPlaceholders = (html: string) => {
    return html.replace(/{{(.*?)}}/g, (_, name) => {
        return `<span class="placeholder" data-placeholder="${name}">{{${name}}}</span>`;
    });
};

const extractPlaceholders = (html: string): string[] => {
    const matches = [...html.matchAll(/{{(.*?)}}/g)];
    return Array.from(new Set(matches.map((m) => m[1])));
};

export default DocxViewer;
