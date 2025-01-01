import axios from "axios";

/**
 * Function to calculate token expiration time.
 * @param {string} tokenLifetime - Number of seconds after which token expires.
 * @return {string} - Time when token expires.
 */
const calculateTokenExpirationTime = (tokenLifetime) => {
    const numberTokenLifetime = parseInt(tokenLifetime)
    return (new Date().getTime() + numberTokenLifetime * 1000).toString()
}

/**
 * Function to log in User with provided credentials. Adds token key in localStorage.
 * @param {string} email - User email.
 * @param {string} password - User password.
 * @return {Promise} - Request response and isError boolean value.
 */
export const logIn = async (email, password) => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/api/users/login/`;
    try {
        const response = await axios.post(url, {'email': email, 'password': password});
        window.localStorage.setItem(
            'budgetory.accessTokenExpiresIn',
            calculateTokenExpirationTime(process.env.REACT_APP_ACCESS_TOKEN_LIFETIME)
        )
        window.localStorage.setItem(
            'budgetory.refreshTokenExpiresIn',
            calculateTokenExpirationTime(process.env.REACT_APP_REFRESH_TOKEN_LIFETIME)
        )
        window.localStorage.setItem('budgetory.accessToken', response.data.access);
        window.localStorage.setItem('budgetory.refreshToken', response.data.refresh);
        return {response, isError: false};
    } catch (error) {
        return {response: error, isError: true};
    }
};

/**
 * Function to remove User tokens from localStorage.
 */
export const removeTokens = () => {
    window.localStorage.removeItem('budgetory.accessToken');
    window.localStorage.removeItem('budgetory.accessTokenExpiresIn');
    window.localStorage.removeItem('budgetory.refreshToken');
    window.localStorage.removeItem('budgetory.refreshTokenExpiresIn');
};

/**
 * Function to get User access token.
 * @return {string} - User access token.
 */
export const getAccessToken = async () => {
    if (window.localStorage.getItem('budgetory.accessTokenExpiresIn') <= (new Date()).getTime()) {
        await refreshToken()
        return window.localStorage.getItem('budgetory.accessToken')
    } else {
        return window.localStorage.getItem('budgetory.accessToken')
    }
}

/**
 * Function to refresh User access token.
 */
const refreshToken = async () => {
    if (window.localStorage.getItem('budgetory.refreshTokenExpiresIn') <= (new Date()).getTime()) {
        removeTokens();
    } else {
        const url = `${process.env.REACT_APP_BACKEND_URL}/api/users/token/refresh/`;
        try {
            const response = await axios.post(url, {'refresh': window.localStorage.getItem('budgetory.refreshToken')});
            window.localStorage.setItem(
                'budgetory.accessTokenExpiresIn',
                (new Date().getTime() + parseInt(process.env.REACT_APP_ACCESS_TOKEN_LIFETIME) * 1000).toString()
            );
            window.localStorage.setItem(
                'budgetory.accessToken',
                response.data.access
            );
        } catch (error) {
            removeTokens();
        }
    }

}
