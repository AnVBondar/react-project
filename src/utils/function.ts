
export function mergeObjects<T>(parent: T, child: T): T {
  const merged: T = { ...child };

  for (const key in parent) {
    if (Object.prototype.hasOwnProperty.call(parent, key)) {
      if (typeof parent[key] === 'object' && parent[key] !== null) {
        if (typeof merged[key] === 'object' && merged[key] !== null) {
          // If the property is an object, recursively merge its values
          merged[key] = mergeObjects(parent[key], merged[key]);
        } else {
          // If the property is not an object, assign its value
          merged[key] = { ...(parent[key] as T[Extract<keyof T, string>]) };
        }
      } else {
        // If the property is not an object, assign its value
        merged[key] = parent[key];
      }
    }
  }

  return merged;
}