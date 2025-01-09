import React, {useEffect, useState} from 'react';
import {TextField, InputAdornment, IconButton, InputLabel} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

/**
 * Extended TextField component for displaying label above field and edit/save icon with value update handling.
 */
const EditableTextField = ({label, value, onSave, ...props}) => {
    const [isDisabled, setIsDisabled] = useState(true);
    const [text, setText] = useState(value);
    const [error, setError] = useState('');

    /**
     * useEffect for setting field initial value on component render.
     */
    useEffect(() => {
        setText(value);
    }, [value]);

    /**
     * Function to handle edit/save icon click.
     */
    const handleIconClick = () => {
        if (isDisabled) {
            setIsDisabled(false);
        } else {
            if (text.trim() === '') {
                setError('This field cannot be empty');
            } else {
                setIsDisabled(true);
                setError('');
                onSave(text);
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
                value={text}
                onChange={(e) => setText(e.target.value)}
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