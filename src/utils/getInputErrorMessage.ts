function getInputErrorMessage(errors: InputErrors, base: InputErrors, objectName?: string) {
  const entries = Object.entries(errors);
    
  let _errors: InputErrors = {};

  for(let e in entries) {
    const [key, value] = entries[e];
    
    if(!value?.message && typeof value === "object") {
      _errors = getInputErrorMessage(value as any, _errors, key + ".");
    } else if(value?.message) {
      const message: string = value.message?.replaceAll(`${(objectName? objectName:"")+key} `, "");

      _errors[(objectName? objectName:"")+key] = {
        message: `${message[0].toUpperCase()}${message.slice(1, message.length)}.`
      };
    };
  };

  return { ...base, ..._errors }
};

export { getInputErrorMessage };

