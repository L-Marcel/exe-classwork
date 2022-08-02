function getRawString(obj: any) {
  if(obj === null || obj === undefined) {
    return "";
  } else if(typeof obj === "object") {
    return JSON.stringify(obj, null, 2);
  } else if(typeof obj !== "string") {
    return String(obj);
  };

  return obj;
};

export { getRawString };

