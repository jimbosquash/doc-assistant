import { useState } from "react";
import { placeholderMetadata } from "./FinancialDocAssistant";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';

export const FocusedPlaceholderPanel = ({
    focused,
    metadata,
}: {
    focused: string | undefined;
    metadata: typeof placeholderMetadata;
}) => {
    const meta = focused ? metadata[focused] : undefined;

    const [dropdownValues, setDropdownValues] = useState<Record<string, string>>({});

    const handleChange = (label: string) => (event: SelectChangeEvent<string>) => {
        setDropdownValues((prev) => ({
            ...prev,
            [label]: event.target.value,
        }));
    };

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800">
                {/* {meta?.title || "Select a field to edit"} */}
                {focused || "Select a field to edit"}
            </h2>
            <p className="text-sm text-gray-600">
                {meta?.description || "Click a placeholder in the document to view its options."}
            </p>

            {(meta?.dropdowns || []).map((dropdown, index) => (
                <FormControl fullWidth key={index} size="small">
                    <InputLabel>{dropdown.label}</InputLabel>
                    <Select
                        value={dropdownValues[dropdown.label] || ""}
                        label={dropdown.label}
                        onChange={handleChange(dropdown.label)}
                    >
                        {dropdown.options.map((opt) => (
                            <MenuItem key={opt} value={opt}>
                                {opt}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            ))}
        </div>
    );
}

export default FocusedPlaceholderPanel;
