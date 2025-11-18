/**
 * Function calculating font color basing on current and maximum value of specified param.
 * @param {string} currentValue - Actual value of paramether.
 * @param {string} maxValue - Maximum value of paramether.
 * @returns {string} Calculated color value.
 */
export const getFontColor = (currentValue, maxValue) => {
  const current = Number(currentValue);
  const max = Number(maxValue);

  if (max <= 0 && current <= 0) {
    return 'rgb(0 0 0 / 87%)';
  } else if (current > max) {
    return '#BD0000';
  }
  return '#008000';
};
