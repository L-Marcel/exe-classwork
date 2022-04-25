import github from "../../../../pages/api/login/github";
import { Cookies } from "../../../../services/cookies";
import { Github } from "../../../../services/github";
import { Prisma } from "../../../../services/prisma";
import { githubUser } from "../../../lib/data/login";

describe("🔑 Should be able to get or initialize the installation:", () => {
  let 
  json: jest.Mock, 
  redirect: jest.Mock, 
  status: jest.Mock;

  let 
  setCookies: jest.SpyInstance,
  checkIfTokenIsValid: jest.SpyInstance, 
  findUniqueUser: jest.SpyInstance,
  getAccessToken: jest.SpyInstance,
  createUser: jest.SpyInstance,
  updateUser: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks();
    setCookies = jest.spyOn(Cookies, "set");
    getAccessToken = jest.spyOn(Github, "getAccessToken");
    checkIfTokenIsValid = jest.spyOn(Github, "checkIfTokenIsValid");
    createUser = jest.spyOn(Prisma.user, "create");
    updateUser = jest.spyOn(Prisma.user, "update");
    findUniqueUser = jest.spyOn(Prisma.user, "findUnique");
    json = jest.fn();
    redirect = jest.fn();
    status = jest.fn(() => ({
      json,
      redirect
    }))
  });

  it("Should be able to register a new installation;", async() => {
    getAccessToken.mockResolvedValue({
      data: {
        access_token: "123",
        refresh_token: "1234"
      }
    });

    checkIfTokenIsValid.mockResolvedValue(githubUser);
    createUser.mockReturnValue({});
    
    await github({
      query: {
        code: "123",
        installation_id: "123"
      } as any,
      method: "GET"
    } as Req, { status } as any);
    
    //Should verify the user
    expect(setCookies).toBeCalledTimes(2);
    expect(checkIfTokenIsValid).toBeCalledTimes(1);
    expect(getAccessToken).toBeCalledTimes(1);

    //Should create an user
    expect(createUser).toBeCalledWith({
      data: {
        avatarUrl: githubUser.avatar_url,
        githubId: githubUser.id.toString(),
        name: githubUser.name,
        username: githubUser.login,
        installationId: "123"
      }
    });
    
    //Should redirect
    expect(status).toBeCalledWith(300);
    expect(redirect).toBeCalledTimes(1);
    expect(redirect).toBeCalledWith(`https://github.com/apps/${Github.appName}/installations/new/permissions?target_id=${githubUser.id}`);
  });

  it("Should be able to update user installation;", async() => {
    getAccessToken.mockResolvedValue({
      data: {
        access_token: "123",
        refresh_token: "1234"
      }
    });

    checkIfTokenIsValid.mockResolvedValue(githubUser);
    findUniqueUser.mockResolvedValue({
      id: "1",
      avatarUrl: githubUser.avatar_url,
      githubId: githubUser.id.toString(),
      name: githubUser.name,
      username: githubUser.login
    });

    updateUser.mockResolvedValue({});

    await github({
      query: {
        code: "123",
        installation_id: "123"
      } as any,
      method: "GET"
    } as Req, { status } as any);
    
    //Should verify the user
    expect(setCookies).toBeCalledTimes(2);
    expect(checkIfTokenIsValid).toBeCalledTimes(1);
    expect(getAccessToken).toBeCalledTimes(1);

    //Should find him, but without installation id
    expect(findUniqueUser).toBeCalledTimes(1);
    
    //Should update him with the installation id passed by Github
    expect(updateUser).toBeCalledWith({
      data: {
        installationId: "123"
      },
      where: {
        id: "1"
      },
    });
    
    //Should redirect
    expect(status).toBeCalledWith(300);
    expect(redirect).toBeCalledTimes(1);
    expect(redirect).toBeCalledWith(`/app/${githubUser.id}`);
  });

  it("Should be able to redirect to github installation page;", async() => {
    getAccessToken.mockResolvedValue({
      data: {
        access_token: "123",
        refresh_token: "1234"
      }
    });

    checkIfTokenIsValid.mockResolvedValue(githubUser);
    findUniqueUser.mockResolvedValue({
      id: "1",
      avatarUrl: githubUser.avatar_url,
      githubId: githubUser.id.toString(),
      name: githubUser.name,
      username: githubUser.login
    });

    await github({
      query: {
        code: "123"
      } as any,
      method: "GET"
    } as Req, { status } as any);
    
    //Should verify the user
    expect(checkIfTokenIsValid).toBeCalledTimes(1);
    expect(getAccessToken).toBeCalledTimes(1);

    //Should find him, but without installation id
    expect(findUniqueUser).toBeCalledTimes(1);

    //In this case, installation id should not find in query

    //Should redirect
    expect(status).toBeCalledWith(300);
    expect(redirect).toBeCalledTimes(1);
    expect(redirect).toBeCalledWith(`https://github.com/apps/${Github.appName}/installations/new/permissions?target_id=${githubUser.id}`);
  });

  it("Should be able to redirect to application;", async() => {
    getAccessToken.mockResolvedValue({
      data: {
        access_token: "123",
        refresh_token: "1234"
      }
    });

    checkIfTokenIsValid.mockResolvedValue(githubUser);
    findUniqueUser.mockResolvedValue({
      id: "1",
      avatarUrl: githubUser.avatar_url,
      githubId: githubUser.id.toString(),
      name: githubUser.name,
      username: githubUser.login,
      installationId: "123"
    });

    await github({
      query: {
        code: "123"
      } as any,
      method: "GET"
    } as Req, { status } as any);
    
    //Should verify the user
    expect(setCookies).toBeCalledTimes(2);
    expect(checkIfTokenIsValid).toBeCalledTimes(1);
    expect(getAccessToken).toBeCalledTimes(1);

    //Should find him
    expect(findUniqueUser).toBeCalledTimes(1);
    
    //Should redirect
    expect(status).toBeCalledWith(300);
    expect(redirect).toBeCalledTimes(1);
    expect(redirect).toBeCalledWith(`/app/${githubUser.id}`);
  });

  it("Should be able to redirect to login on error.", async() => {
    getAccessToken.mockRejectedValue(new Error());
    
    await github({
      method: "GET",
      query: {
        code: "123"
      } as any,
    } as Req, { status } as any);
    
    //Should throw a new error
    expect(getAccessToken).toBeCalledTimes(1);
    
    //Should redirect
    expect(status).toBeCalledWith(300);
    expect(redirect).toBeCalledTimes(1);
    expect(redirect).toBeCalledWith("/");
  });
});