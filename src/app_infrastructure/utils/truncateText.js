/**
 * Truncate text if it exceeds a certain length.
 * @param {string} text - Input text.
 * @param {number} maxLength - Maximum length.
 * @return {string} - Output text.
 */
const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
};

export default truncateText;