import login from "../../../pages/api/login";
import { Cookies } from "../../../services/cookies";
import { Github } from "../../../services/github";
import { Prisma } from "../../../services/prisma";

const token = "fake-token";
const githubUser: GithubUser = {
  avatar_url: "",
  id: 1,
  login: "",
  name: ""
};
const prismaUserWithoutInstallation = {
  githubId: githubUser.id.toString()
} as User;
const prismaUser = {
  githubId: githubUser.id.toString(),
  installationId: "1"
} as User;

describe("🔑 Should be able to make a valid login request:", () => {
  let json: any, redirect: any, status: any;
  let getCookies: any, checkIfTokenIsValid: any, findUniqueUser: any;

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

    expect(getCookies).toBeCalledTimes(1);
    expect(checkIfTokenIsValid).toBeCalledTimes(1);

    expect(redirect).toBeCalledTimes(1);
    expect(redirect).toBeCalledWith(`https://github.com/login/oauth/authorize?client_id=${Github.clientId}`);
  });

  it("Should be able to redirect to installation;", async() => {
    const user = prismaUserWithoutInstallation;

    getCookies.mockReturnValue(token);
    checkIfTokenIsValid.mockResolvedValue(githubUser);
    findUniqueUser.mockResolvedValue(user);
    
    await login({
      method: "GET",
      headers: {
        cookie: `token=${token}`      
      }
    } as Req, { status } as any);

    expect(getCookies).toBeCalledTimes(1);
    expect(checkIfTokenIsValid).toBeCalledTimes(1);
    expect(findUniqueUser).toBeCalledTimes(1);

    expect(redirect).toBeCalledTimes(1);
    expect(redirect).toBeCalledWith(`https://github.com/apps/${Github.appName}/installations/new/permissions?target_id=${user?.githubId}`);
  });

  it("Should be able to authorize.", async() => {
    const user = prismaUser;

    getCookies.mockReturnValue(token);
    checkIfTokenIsValid.mockResolvedValue(githubUser);
    findUniqueUser.mockResolvedValue(user);
    
    await login({
      method: "GET",
      headers: {
        cookie: `token=${token}`      
      }
    } as Req, { status } as any);

    expect(getCookies).toBeCalledTimes(1);
    expect(checkIfTokenIsValid).toBeCalledTimes(1);
    expect(findUniqueUser).toBeCalledTimes(1);

    expect(redirect).toBeCalledTimes(1);
    expect(redirect).toBeCalledWith(`/app/${user.githubId}`);
  });
});