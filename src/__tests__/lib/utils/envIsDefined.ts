function envIsDefined() {
  let isDefined = true;

  const variables = [
    "GITHUB_WEBHOOK_SECRET",
    "GITHUB_APP_ID",
    "GITHUB_CLIENT_ID",
    "GITHUB_CLIENT_SECRET",
    "GITHUB_PRIVATE_KEY",
    "SECRET",
    "NEXT_PUBLIC_URL",
    "APP_NAME"
  ];

  for(let v in variables) {
    if(!process.env[variables[v]]) {
      console.warn(`You need define ${variables[v]} in .env.test`);
      isDefined = false;
    };
  };
  
  return true;
};

export { envIsDefined };