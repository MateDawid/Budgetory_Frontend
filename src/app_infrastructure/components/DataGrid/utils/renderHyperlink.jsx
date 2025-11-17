import React from "react";

/**
 * Renders a hyperlink for a DataGrid cell.
 * @param {string} url - Base url for hyperlink.
 * @param {object} cellParams - DataGrid cell params.
 * @return {JSX.Element|null} The hyperlink element or null if no value.
 */

const renderHyperlink = (url, cellParams) => {
    if (!cellParams.value || cellParams.value === -1) {
        return <span></span>;
    }
    return (
        <a
            href={`${url}${cellParams.value}/`}
            target="_blank"
            rel="noopener noreferrer"
            style={{

                fontWeight: 'bold',
                color: 'inherit',
                textDecoration: 'none',

            }}
        >
            {cellParams.formattedValue}
        </a>
    );
};

export default renderHyperlink;