export const getFontColor = (currentValue, maxValue) => {

  const current = Number(currentValue)
  const max = Number(maxValue)

  if (max <= 0 && current <= 0) {
    return "rgb(0 0 0 / 87%)";
  } else if (current > max) {
    return "#BD0000";
  }
  return "#008000";
};
