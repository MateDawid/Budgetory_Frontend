import React, {useEffect, useState} from 'react';
import {InputAdornment, IconButton, InputLabel, MenuItem} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import StyledTextField from "./StyledTextField";

/**
 * Extended TextField component for displaying label above field and edit/save icon with value update handling.
 * @param {string} label - Label displayed above the field.
 * @param {object} initialValue - Initial field value.
 * @param {string} apiFieldName - API field name for field value.
 * @param {function} onSave - Function to be performed on save icon click.
 * @param {boolean} isEditable - Indicates if enable editing field.
 * @param {object} props - Additional props passed to TextField.
 */
const EditableTextField = ({label, initialValue, apiFieldName, onSave, isEditable=true, ...props}) => {
    const [isDisabled, setIsDisabled] = useState(true);
    const [currentValue, setCurrentValue] = useState(null);
    const [value, setValue] = useState(initialValue === undefined ? '' : initialValue);
    const [error, setError] = useState('');

    /**
     * useEffect for setting field initial value on component render.
     */
    useEffect(() => {
        setValue(initialValue === undefined ? '' : initialValue);
        setCurrentValue(initialValue === undefined ? '' : initialValue);
    }, [initialValue]);

    /**
     * Function to handle edit/save icon click.
     */
    const handleIconClick = async () => {
        if (isDisabled) {
            setIsDisabled(false);
        } else {
            try {
                await onSave(apiFieldName, value);
                setCurrentValue(value);
                setIsDisabled(true);
                setError('');
            } catch (error) {
                setError(error.message);
                setValue(currentValue);
            }
        }
    };

    /**
     * Function to handle select option.
     */
    const handleSelect = async (selectedValue) => {
        try {
            await onSave(apiFieldName, selectedValue);
            setCurrentValue(value);
            setIsDisabled(true);
            setError('');
        } catch (error) {
            setError(error.message);
            setValue(currentValue);
        }
    }

    return (
        <>
            <InputLabel sx={{display: "flex", fontWeight: 700}}>
                {label}
            </InputLabel>
            {props.type === 'select' ? (
                <StyledTextField
                    select
                    value={value}
                    onChange={(e) => {handleSelect(e.target.value)}}
                    error={!!error}
                    helperText={error}
                    fullWidth
                    {...props}
                >
                    {props.options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </StyledTextField>
            ) : (
                <StyledTextField
                    disabled={isDisabled}
                    error={!!error}
                    helperText={error}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    slotProps={isEditable ? {
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={isDisabled ? "edit" : "save"}
                                        onClick={handleIconClick}
                                        edge="end"
                                    >
                                        {isDisabled ? <EditIcon/> : <SaveIcon/>}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }
                    } : {}}
                    {...props}
                />
            )}
        </>
    );
};

export default EditableTextField;
