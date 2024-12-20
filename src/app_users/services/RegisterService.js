import axios from "axios";

/**
 * Function to register user with provided credentials.
 * @param {string} email - User email.
 * @param {string} password_1 - User password 1.
 * @param {string} password_2 - User password 2.
 * @return {Promise} - Request response and isError boolean value.
 */
export const registerUser = async (email, password_1, password_2) => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/users/register/`;
    try {
        const response = await axios.post(url, {'email': email, 'password_1': password_1, 'password_2': password_2});
        return {response, isError: false};
    } catch (error) {
        return {response: error, isError: true};
    }
};