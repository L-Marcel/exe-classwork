declare type _Req = import("next").NextApiRequest;
declare type Res = import("next").NextApiResponse;
declare type User = import("@prisma/client").User;
declare type _Classroom = import("@prisma/client").Classroom;
declare type _ClassroomRelation = import("@prisma/client").ClassroomRelation;
declare type Team = import("@prisma/client").Team;
declare type _TeamRelation = import("@prisma/client").TeamRelation;

declare interface TeamRelation extends _TeamRelation {
  role: TeamRoles;
  user: User;
  classroom: Partial<Classroom>;
};

declare interface ClassroomRelation extends _ClassroomRelation {
  role: ClassroomRoles;
  user: User;
  classroom: Partial<Classroom>;
};

declare interface Classroom extends _Classroom {
  users: ClassroomRelation[];
};

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
  classroom: Classroom | null;
  setClassroom: (classroom: Classroom) => void;
  signOut: () => void;
  inputErrors: InputErrors;
  addInputErrors: (errors: InputErrors) => void;
  removeInputError: (name: string) => void;
  resetInputErrors: () => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

declare interface SearchContext {
  search: string;
  setSearch: (search: string) => void;
  page: number;
  setPage: (page: number) => void;
  count: number;
  setCount: (count: number) => void;
};

//Fake enums to sqlite dabase
declare type AlertTypes = "CLASSROOM" | "CLASSROOM_RELATION" | "TEAM" | "TEAM_RELATION" | "REPOSITORY" | "COMMIT";
declare type ClassroomRoles = "OWNER" | "ADMIN" | "OBSERVER" | "STUDENT";
declare type TeamRoles = "LEADER" | "MEMBER";

declare interface WithUserProps {
  user: User;
};

declare interface WithClassroomProps {
  user: User;
  classroom: Classroom;
};

declare type InputErrors = {
  [key: string]: {
    message: string;
  };
};

declare type MatrixOfElements = [ 
  JSX.Element[], 
  JSX.Element[]?, 
  JSX.Element[]?, 
  JSX.Element[]?
];

declare type PaginatedData<T> = { 
  items: T[], 
  count: number 
};

declare type GithubRepository = {
  name: string;
  full_name: string;
  description: string;
  git_url: string;
  ssh_url: string;
  homepage: string;
};