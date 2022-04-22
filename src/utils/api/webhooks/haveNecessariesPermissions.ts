function haveNecessaryPermissions(data: WebhookEventDataInstallation) {
  const { events, permissions } = data.installation;

  if(
    permissions.contents !== "read" || 
    permissions.metadata !== "read" ||
    !events.includes("push") || 
    !events.includes("repository")
  ) {
    return false;
  };

  return true;
};

export {
  haveNecessaryPermissions
};