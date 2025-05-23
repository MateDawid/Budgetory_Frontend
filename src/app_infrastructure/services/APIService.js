import {getAccessToken} from "../../app_users/services/LoginService";
import ApiError from "../../app_infrastructure/utils/ApiError";

/**
 * Function to fetch data from API list endpoint.
 * @param {string} inputUrl - API list url.
 * @param {object} paginationModel - paginationModel object with page number and page size.
 * @param {object} sortModel - sortModel object.
 * @param {object} filterModel - filterModel object.
 * @return {object} - JSON data with API response.
 */
export const getApiObjectsList = async (inputUrl, paginationModel = {}, sortModel = {}, filterModel = {}) => {
    const token = await getAccessToken();
    let url_params = {...sortModel, ...filterModel};
    if (Object.entries(paginationModel).length !== 0) {
        url_params = {
            page: paginationModel.page + 1,
            page_size: paginationModel.pageSize,
            ...url_params
        };
    }
    const url = new URL(inputUrl);
    const existingParams = new URLSearchParams(url.search);
    const newParams = new URLSearchParams(url_params);
    for (const [key, value] of newParams) {
        existingParams.append(key, value);
    }
    const output_url = `${url.origin}${url.pathname}?${existingParams.toString()}`;
    const response = await fetch(output_url, {method: "GET", headers: {Authorization: `Bearer ${token}`}});
    return await response.json();
};

/**
 * Function to fetch data from API detail endpoint.
 * @param {string} inputUrl - API list url.
 * @param {string} objectId - id of fetched object.
 * @return {object} - JSON data with API response.
 */
export const getApiObjectDetails = async (inputUrl, objectId) => {
    const url = new URL(inputUrl);
    const token = await getAccessToken()
    const detailUrl = `${url.origin}${url.pathname}${objectId}/`
    const requestOptions = {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    }
    const response = await fetch(detailUrl, requestOptions)
    if (!response.ok) {
        throw new ApiError(`HTTP ${response.status}`);
    }
    return await response.json();
}


/**
 * Function to create object in API.
 * @param {string} url - API list url.
 * @param {object} newObject - Payload for API call with new object values.
 * @return {object} - JSON data with API response.
 */
export const createApiObject = async (url, newObject) => {
    let dataErrorRaised = false
    try {
        const token = await getAccessToken()
        const requestOptions = {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newObject)
        }
        const response = await fetch(url, requestOptions)
        if (!response.ok) {
            const data = await response.json()
            dataErrorRaised = true
            throw new ApiError('Invalid data', data);
        }
        return await response.json();
    }
    catch (error) {
        if (dataErrorRaised) {
            throw error;
        } else {
            throw new Error("Unexpected error occurred.");
        }

    }
};

/**
 * Function to update single object from API.
 * @param {string} inputUrl - API list url.
 * @param {object} updatedObject - Payload for API call with updated object values.
 * @return {object} - JSON data with API response.
 */
export const updateApiObject = async (inputUrl, updatedObject) => {
    const url = new URL(inputUrl);
    const token = await getAccessToken()
    const detailUrl = `${url.origin}${url.pathname}${updatedObject["id"]}/`
    const requestOptions = {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedObject)
    }
    const response = await fetch(detailUrl, requestOptions)
    return {
        ok: response.ok,
        data: await response.json()
    };
};


/**
 * Function to delete single object from API.
 * @param {string} inputUrl - API list url.
 * @param {string} objectId - id of deleted object.
 * @return {object} - JSON data with API response.
 */
export const deleteApiObject = async (inputUrl, objectId) => {
    const url = new URL(inputUrl);
    try {
        const token = await getAccessToken()
        const detailUrl = `${url.origin}${url.pathname}${objectId}/`
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        }
        const response = await fetch(detailUrl, requestOptions)
        if (!response.ok) {
            const data = await response.json()
            return {errorOccurred: true, ...data}
        }
        return {errorOccurred: false, detail: "Success."};
    } catch (error) {
        return {errorOccurred: true, detail: "Unexpected server error."}
    }
};
