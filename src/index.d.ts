declare type _Req = import("next").NextApiRequest;
declare type Res = import("next").NextApiResponse;
declare type User = import("@prisma/client").User;

declare interface Req extends _Req {
  user: import("@prisma/client").User;
};

declare type WebhookEventType = "installation" | "repository";

declare type WebhookEventData = {
  installation: WebhookEventDataInstallation;
  repository: WebhookEventDataRepository;
  push: WebhookEventDataPush;
};

declare type WebhookEventDataInstallation = {
  _type: "installation";
  action: "created" | "deleted" | "suspend" | "unsuspend";
  installation: {
    id: number;
    account: {
      login: string;
      id: number;
      avatar_url?: string;

    },
    access_tokens_url: string;
    repositories_url: string;
    permissions: {
      contents: string;
      metadata: string;
    },
    events: string[],
  }
};

declare type WebhookEventDataRepository = {
  _type: "repository";
};

declare type WebhookEventDataPush = {
  _type: "push";
};

declare type ServerCookieParams = {
  req: Req;
  res: Res;
};

declare type GithubUser = {
  id: number;
  name?: string;
  avatar_url:? string;
  login: string
};

declare type ApiHandleMethodsFunctions = { 
  [method: string]: (req: Req, res: Res) => Promise<any> 
};

declare type ErrorWithContext<T = any> = { 
  statusCode: number;
  message: string;
  details: T | T[];
};

declare interface AppContext {
  user: User | null;
  setUser: (user: User) => void;
  signOut: () => void;
  search: string;
  setSearch: (search: string) => void;
  page: number;
  setPage: (page: number) => void;
};

//Fake enums to sqlite dabase
declare type AlertTypes = "CLASSROOM" | "CLASSROOM_RELATION" | "TEAM" | "TEAM_RELATION" | "REPOSITORY" | "COMMIT";
declare type ClassroomRoles = "OWNER" | "ADMIN" | "OBSERVER" | "STUDENT";
declare type TeamRoles = "LEADER" | "MEMBER";

declare interface WithUserProps {
  user: User;
};
