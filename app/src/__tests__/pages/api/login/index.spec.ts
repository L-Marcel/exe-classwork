import login from "../../../../pages/api/login";
import { Cookies } from "../../../../services/cookies";
import { Github } from "../../../../services/github";
import { Prisma } from "../../../../services/prisma";
import { githubUser, token } from "../../../lib/data/login";

describe("🔒 Should be able to make a valid login request:", () => {
  let 
  json: jest.Mock, 
  redirect: jest.Mock, 
  status: jest.Mock;

  let 
  getCookies: jest.SpyInstance, 
  checkIfTokenIsValid: jest.SpyInstance, 
  findUniqueUser: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks();
    getCookies = jest.spyOn(Cookies, "get");
    checkIfTokenIsValid = jest.spyOn(Github, "checkIfTokenIsValid");
    findUniqueUser = jest.spyOn(Prisma.user, "findUnique");
    json = jest.fn();
    redirect = jest.fn();
    status = jest.fn(() => ({
      json,
      redirect
    }))
  });

  it("Should be able to redirect to Oauth autorize;", async() => {
    getCookies.mockReturnValue(token);
    checkIfTokenIsValid.mockResolvedValue(githubUser);
    
    await login({
      method: "GET",
      headers: {
        cookie: `token=${token}`      
      }
    } as Req, { status } as any);

    //Should verify the user
    expect(getCookies).toBeCalledTimes(1);
    expect(checkIfTokenIsValid).toBeCalledTimes(1);

    //Should redirect
    expect(status).toBeCalledWith(300);
    expect(redirect).toBeCalledTimes(1);
    expect(redirect).toBeCalledWith(`https://github.com/login/oauth/authorize?client_id=${Github.clientId}`);
  });

  it("Should be able to redirect to installation;", async() => {
    const user = { 
      githubId: githubUser.id.toString() 
    };

    getCookies.mockReturnValue(token);
    checkIfTokenIsValid.mockResolvedValue(githubUser);
    findUniqueUser.mockResolvedValue(user);
    
    await login({
      method: "GET",
      headers: {
        cookie: `token=${token}`      
      }
    } as Req, { status } as any);

    //Should verify the user
    expect(getCookies).toBeCalledTimes(1);
    expect(checkIfTokenIsValid).toBeCalledTimes(1);

    //Should find him in database, but without installation id
    expect(findUniqueUser).toBeCalledTimes(1);

    //Should redirect
    expect(status).toBeCalledWith(300);
    expect(redirect).toBeCalledTimes(1);
    expect(redirect).toBeCalledWith(`https://github.com/apps/${Github.appName}/installations/new/permissions?target_id=${user?.githubId}`);
  });

  it("Should be able to authorize.", async() => {
    const user = { 
      githubId: githubUser.id.toString(),
      installationId: "123"
    };;

    getCookies.mockReturnValue(token);
    checkIfTokenIsValid.mockResolvedValue(githubUser);
    findUniqueUser.mockResolvedValue(user);
    
    await login({
      method: "GET",
      headers: {
        cookie: `token=${token}`      
      }
    } as Req, { status } as any);

    //Should verify the user
    expect(getCookies).toBeCalledTimes(1);
    expect(checkIfTokenIsValid).toBeCalledTimes(1);
    
    //Should find him in database
    expect(findUniqueUser).toBeCalledTimes(1);

    //Should redirect
    expect(status).toBeCalledWith(300);
    expect(redirect).toBeCalledTimes(1);
    expect(redirect).toBeCalledWith(`/app/${user.githubId}`);
  });
});