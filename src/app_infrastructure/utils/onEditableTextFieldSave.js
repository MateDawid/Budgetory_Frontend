import {updateApiObject} from "../services/APIService";
import ApiError from "./ApiError";

/**
 * Handles saving EditableTextField.
 * @param {string} id - Edited object id.
 * @param {string} apiFieldName - Edited API field name.
 * @param {any} value - New value for object's apiFieldName.
 * @param {string} apiUrl - Base API url for object update.
 * @param {function} setUpdatedObjectParam - Setter for refreshing page on object update.
 * @param {function} setAlert - Alert setter.
 */
const onEditableTextFieldSave = async (
    id,
    apiFieldName,
    value,
    apiUrl,
    setUpdatedObjectParam,
    setAlert
) => {
    let payload = {id: id, [apiFieldName]: value}
    try {
        await updateApiObject(apiUrl, payload);
        setUpdatedObjectParam(`${apiFieldName}_${value}`)
        setAlert({type: 'success', message: 'Deposit updated successfully.'})
    } catch (error) {
        setAlert({type: 'error', message: 'Update failed.'})
        if (error instanceof ApiError) {
            const apiErrors = error.data.detail
            let errorMessageParts = []
            Object.keys(apiErrors).forEach(key => {
                apiErrors[key].forEach((message) => {
                    if (key === 'non_field_errors') {
                        errorMessageParts.push(message)
                    } else {
                        errorMessageParts.push(`${key}: ${message}`)
                    }
                });
            })
            throw new ApiError(errorMessageParts.join('\n'));
        }
        throw error
    }
};

export default onEditableTextFieldSave;