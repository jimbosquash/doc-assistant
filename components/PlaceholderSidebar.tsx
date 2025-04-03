// components/PlaceholderSidebar.tsx

import React from 'react';
import { Card, CardContent, List, ListItemButton, Typography } from '@mui/material';

type PlaceholderSidebarProps = {
    placeholders: string[];
    onSelect: (placeholder: string) => void;
};

const PlaceholderSidebar: React.FC<PlaceholderSidebarProps> = ({ placeholders, onSelect }) => {
    return (
        <Card variant="outlined" sx={{ height: '100%', overflowY: 'auto' }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    🔧 Placeholders
                </Typography>
                <List dense>
                    {placeholders.map((name) => (
                        <ListItemButton
                            key={name}
                            onClick={() => onSelect(name)}
                            sx={{ fontFamily: 'monospace' }}
                        >
                            {`{{${name}}}`}
                        </ListItemButton>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

export default PlaceholderSidebar;
