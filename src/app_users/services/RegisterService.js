import axios from "axios";

/**
 * Function to register user with provided credentials.
 * @param {string} email - User email.
 * @param {string} password - User password.
 * @return {Promise} - Request response and isError boolean value.
 */
export const registerUser = async (email, password) => {
    const url = `${process.env.REACT_APP_BASE_URL}/api/users/create/`;
    try {
        const response = await axios.post(url, {'email': email, 'name': email, 'password': password});
        return {response, isError: false};
    } catch (error) {
        return {response: error, isError: true};
    }
};