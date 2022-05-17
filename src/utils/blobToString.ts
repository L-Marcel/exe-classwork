function blobToString(content: string, encoding: any) {
  return Buffer.from(content || "", encoding || "base64").toString("utf-8");
};

export { blobToString };
