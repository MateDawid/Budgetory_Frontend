import axios from "axios";

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
        // TODO - handle invalid dates -> navigate to error page
        window.localStorage.setItem(
            'budgetory.accessTokenExpiresIn',
            (new Date().getTime() + parseInt(process.env.REACT_APP_ACCESS_TOKEN_LIFETIME) * 1000).toString()
        )
        window.localStorage.setItem(
            'budgetory.refreshTokenExpiresIn',
            (new Date().getTime() + parseInt(process.env.REACT_APP_REFRESH_TOKEN_LIFETIME) * 1000).toString()
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
const getAccessToken = () => {
    if (window.localStorage.getItem('budgetory.accessTokenExpiresIn') <= (new Date()).getTime()) {
        refreshToken()
    }
    return window.localStorage.getItem('budgetory.accessToken')
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

/**
 * Function to check if User is logged in by checking localStorage content.
 * @return {boolean} - true if token in localStorage, false otherwise.
 */
export const isLoggedIn = () => {
    return getAccessToken() !== null;
};
