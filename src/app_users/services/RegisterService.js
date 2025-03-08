import axios from "axios";

/**
 * Function to register user with provided credentials.
 * @param {object} payload - User data payload.
 * @return {Promise} - Request response and isError boolean value.
 */
export const registerUser = async (payload) => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/users/register/`;
    try {
        const response = await axios.post(url, payload);
        return {response, isError: false};
    } catch (error) {
        return {response: error, isError: true};
    }
};