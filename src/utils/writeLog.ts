import { writeFileSync } from "node:fs";

function writeLog(data: any) {
  let mime = ".txt";
  let value = data;

  if(Array.isArray(data) || typeof data === "object") {
    value = JSON.stringify(data, null, 2);
    mime = ".json";
  } else if(typeof data !== "string" && typeof data !== "undefined") {
    value = data.toString();
  };

  writeFileSync(`${process.cwd()}/logs/${new Date().getTime()}${mime}`, value);
};

export { writeLog };

