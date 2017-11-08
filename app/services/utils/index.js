export function filterObject(object, callback) {
  return Object.keys(object)
    .filter(key => callback(key))
    .reduce(
      (resultObject, filteredKey) => ({ ...resultObject, [filteredKey]: object[filteredKey] }),
      {},
    );
}
