export const getFontColor = (currentValue, maxValue) => {
  if (maxValue <= 0 && currentValue <= 0) {
    return "rgb(0 0 0 / 87%)";
  } else if (currentValue > maxValue) {
    return "#BD0000";
  }
  return "#008000";
};
