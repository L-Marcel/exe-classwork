function serialize(obj: Object) {
  if(obj === null || obj === undefined) {
    return obj;
  } else if(Array.isArray(obj)) {
    return obj.map(item => serialize(item));
  };

  return Object.entries(obj).reduce((pre, cur) => {
    let [key, value] = cur;

    if(value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        value = value.map(item => serialize(item));
      } else if (typeof value === "object" && typeof value.getMonth === 'function') {
        value = JSON.parse(JSON.stringify(value));
      } else if (typeof value === 'object') {
        value = serialize(value);
      };
    }; 

    pre[key] = value;

    return pre;
  }, {});
};

export { serialize };