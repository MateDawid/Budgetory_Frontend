import axios from "axios";
import {Navigate} from "react-router-dom";
import React from "react";

/**
 * Function to log in user with provided credentials. Adds token key in localStorage.
 * @param {string} email - User email.
 * @param {string} password - User password.
 * @return {Promise} - Request response and isError boolean value.
 */
export const logIn = async (email, password) => {
    const url = `${process.env.BACKEND_URL}/api/users/login/`;
    try {
        const response = await axios.post(url, {'email': email, 'password': password});
        window.localStorage.setItem(
            'budgetory.auth', JSON.stringify(response.data)
        );
        return {response, isError: false};
    } catch (error) {
        return {response: error, isError: true};
    }
};

/**
 * Function to check if user is logged in by checking localStorage content.
 * @return {boolean} - true if token in localStorage, false otherwise.
 */
export const isLoggedIn = () => {
    return window.localStorage.getItem('budgetory.auth') !== null;
};

/**
 * Gets and parses User token from localStorage.
 * @return {string} - Parsed JWT access token.
 * @returns {undefined} - undefined if token not present in localStorage.
 */
export const getAccessToken = () => {
    const auth = JSON.parse(window.localStorage.getItem('budgetory.auth'));
    if (auth) {
        return auth.access;
    }
    return undefined;
};