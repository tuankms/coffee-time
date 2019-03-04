
const getKeyValue = (obj) => {
  if (!obj) {
    return null;
  }
  return obj['.key'];
};

export { getKeyValue };
