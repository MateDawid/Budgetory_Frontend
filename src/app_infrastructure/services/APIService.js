import {getAccessToken} from "../../app_users/services/LoginService";
import ApiError from "../../app_infrastructure/utils/ApiError";

/**
 * Function calling API.
 * @param {string} url - API url.
 * @param {object} requestOptions - Object containing request method and data.
 * @return {object} - JSON data with API response.
 */
export const getApiResponse = async (url, requestOptions) => {
    try {
        const token = await getAccessToken()
        requestOptions.headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        }
        const response = await fetch(url, requestOptions)
        if (!response.ok) {
            const data = await response.json()
            throw new ApiError(data);
        }
        return response
    } catch (error) {
        console.error(error)
        if (error instanceof ApiError) {
            throw error;
        } else {
            throw new Error("Unexpected error occurred.");
        }
    }
};

/**
 * Function to fetch data from API list endpoint.
 * @param {string} inputUrl - API list url.
 * @param {object} paginationModel - paginationModel object with page number and page size.
 * @param {object} sortModel - sortModel object.
 * @param {object} filterModel - filterModel object.
 * @return {object} - JSON data with API response.
 */
export const getApiObjectsList = async (inputUrl, paginationModel = {}, sortModel = {}, filterModel = {}) => {
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
    const requestOptions = {
        method: "GET",
    }
    const response = await getApiResponse(output_url, requestOptions)
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
    const detailUrl = `${url.origin}${url.pathname}${objectId}/`
    const requestOptions = {
        method: "GET",
    }
    const response = await getApiResponse(detailUrl, requestOptions)
    return await response.json()
}


/**
 * Function to create object in API.
 * @param {string} url - API list url.
 * @param {object} newObject - Payload for API call with new object values.
 * @return {object} - JSON data with API response.
 */
export const createApiObject = async (url, newObject) => {
    const requestOptions = {
        method: "POST",
        body: JSON.stringify(newObject)
    }
    const response = await getApiResponse(url, requestOptions)
    return await response.json()
};

/**
 * Function to update single object from API.
 * @param {string} inputUrl - API list url.
 * @param {object} updatedObject - Payload for API call with updated object values.
 * @return {object} - JSON data with API response.
 */
export const updateApiObject = async (inputUrl, updatedObject) => {
    const url = new URL(inputUrl);
    const detailUrl = `${url.origin}${url.pathname}${updatedObject["id"]}/`
    const requestOptions = {
        method: "PATCH",
        body: JSON.stringify(updatedObject)
    }
    const response = await getApiResponse(detailUrl, requestOptions)
    return await response.json()
};


/**
 * Function to delete single object from API.
 * @param {string} inputUrl - API list url.
 * @param {string} objectId - id of deleted object.
 * @return {object} - JSON data with API response.
 */
export const deleteApiObject = async (inputUrl, objectId) => {
    const url = new URL(inputUrl);
    const detailUrl = `${url.origin}${url.pathname}${objectId}/`
    const requestOptions = {method: "DELETE"}
    return await getApiResponse(detailUrl, requestOptions)
};


/**
 * Function to delete multiple objects from API.
 * @param {string} inputUrl - API list url.
 * @param {array} objectIds - Array containing object ids to be deleted.
 * @return {object} - JSON data with API response.
 */
export const bulkDeleteApiObjects = async (inputUrl, objectIds) => {
    const url = new URL(inputUrl);
    const bulkDeleteUrl = `${url.origin}${url.pathname}bulk_delete/`
    const requestOptions = {
        method: "DELETE",
        body: JSON.stringify({objects_ids: objectIds})
    }
    return await getApiResponse(bulkDeleteUrl, requestOptions)
};

/**
 * Function to delete multiple objects from API.
 * @param {string} inputUrl - API list url.
 * @param {array} objectIds - Array containing object ids to be deleted.
 * @return {object} - JSON data with API response.
 */
export const copyApiObjects = async (inputUrl, objectIds) => {
    const url = new URL(inputUrl);
    const copyUrl = `${url.origin}${url.pathname}copy/`
    const requestOptions = {
        method: "POST",
        body: JSON.stringify({objects_ids: objectIds})
    }
    const response = await getApiResponse(copyUrl, requestOptions)
    return await response.json()
};