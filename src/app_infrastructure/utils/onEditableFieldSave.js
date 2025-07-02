import {updateApiObject} from "../services/APIService";
import ApiError from "./ApiError";

/**
 * Handles saving EditableTextField.
 * @param {string} id - Edited object id.
 * @param {string} apiFieldName - Edited API field name.
 * @param {any} value - New value for object's apiFieldName.
 * @param {string} apiUrl - Base API url for object update.
 * @param {function} setObjectChange - Setter for refreshing page on object update.
 * @param {function} setAlert - Alert setter.
 */
const onEditableFieldSave = async (
    id,
    apiFieldName,
    value,
    apiUrl,
    setObjectChange,
    setAlert
) => {
    let payload = {id: id, [apiFieldName]: value}
    try {
        await updateApiObject(apiUrl, payload);
        setObjectChange({ operation: 'update', objectId: id, objectType: apiUrl, value: value})
        setAlert({type: 'success', message: 'Object updated successfully.'})
    } catch (error) {
        setAlert({type: 'error', message: 'Update failed.'})
        if (error instanceof ApiError) {
            let errorMessage = ''
            if (typeof error.data.detail === 'object') {
                let errorMessageParts = []
                Object.keys(error.data.detail).forEach(key => {
                    error.data.detail[key].forEach((message) => {
                        if (key === 'non_field_errors') {
                            errorMessageParts.push(message)
                        } else {
                            errorMessageParts.push(`${key}: ${message}`)
                        }
                    });
                 })
                errorMessage = errorMessageParts.join('\n')
            } else {
                errorMessage = error.data.detail
            }
            throw new ApiError(errorMessage);
        }
        throw error
    }
};

export default onEditableFieldSave;