const uniqueArray = (arr) => {
  if (!Array.isArray(arr)) {
    return [];
  }

  return [...new Set(arr)];
};

const isEmpty = (arr) => {
  if (!Array.isArray(arr)) {
    return true;
  }

  return arr.length === 0;
};

export {
  uniqueArray,
  isEmpty
};
