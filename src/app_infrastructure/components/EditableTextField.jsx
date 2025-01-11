import React, {useEffect, useState} from 'react';
import {TextField, InputAdornment, IconButton, InputLabel} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

/**
 * Extended TextField component for displaying label above field and edit/save icon with value update handling.
 * @param {string} label - Label displayed above the field.
 * @param {object} initialValue - Initial field value.
 * @param {string} apiFieldName - API field name for field value.
 * @param {function} onSave - Function to be performed on save icon click.
 * @param {object} props - Additional props passed to TextField.
 */
const EditableTextField = ({label, initialValue, apiFieldName, onSave, ...props}) => {
    const [isDisabled, setIsDisabled] = useState(true);
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState('');

    /**
     * useEffect for setting field initial value on component render.
     */
    useEffect(() => {
        setValue(initialValue);
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
                setIsDisabled(true);
                setError('');
            } catch (error) {
                setError(error.message);
            }
        }
    };

    return (
        <>
            <InputLabel sx={{display: "flex", fontWeight: 700,}}>
                {label}
            </InputLabel>
            <TextField
                disabled={isDisabled}
                error={!!error}
                helperText={error}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label={isDisabled ? "`edit" : "save"}
                                    onClick={handleIconClick}
                                    edge="end"
                                >
                                    {isDisabled ? <EditIcon/> : <SaveIcon/>}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }
                }}
                {...props}
            />
        </>
    )
        ;
};

export default EditableTextField;