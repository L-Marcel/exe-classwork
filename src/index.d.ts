declare type _Req = import("next").NextApiRequest;
declare type Res = import("next").NextApiResponse;
declare type User = import("@prisma/client").User;
declare type _Classroom = import("@prisma/client").Classroom;
declare type _ClassroomRelation = import("@prisma/client").ClassroomRelation;
declare type _Team = import("@prisma/client").Team;
declare type _TeamRelation = import("@prisma/client").TeamRelation;
declare type _Repository = import("@prisma/client").Repository;
declare type _Commit = import("@prisma/client").Commit;
declare type _Tree = import("@prisma/client").Tree;
declare type _Alert = import("@prisma/client").Alert;
declare type _Visualization = import("@prisma/client").Visualization;

declare interface Visualization extends _Visualization {};

declare interface Alert extends _Alert {
  type: AlertTypes;
  classroom?: Partial<Classroom>;
  commit?: Partial<Commit>;
  repository?: Partial<Repository>;
  team?: Partial<Team>;
};

declare interface Tree extends _Tree {
  files?: Tree[];
};

declare interface Commit extends _Commit {
  tree?: string;
};

declare interface CommitChart extends Commit {
  methods: number;
  classes: number;
};

declare interface Repository extends _Repository {
  owner: User;
  commits?: Commit[];
  alerts?: Alerts[];
};

declare interface TeamRelation extends _TeamRelation {
  role: TeamRoles;
  user: User;
  classroom: Partial<Classroom>;
};

declare interface Team extends _Team {
  users: TeamRelation[];
  repository?: Repository;
};

declare interface ClassroomRelation extends _ClassroomRelation {
  role: ClassroomRoles;
  user: User;
  classroom: Partial<Classroom>;
};

declare interface Classroom extends _Classroom {
  users: ClassroomRelation[];
  teams: Team[];
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
  repository: Repository | null;
  setRepository: (repository: Repository) => void;
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

declare interface WithRepositoryProps {
  user: User;
  repository: Repository;
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

declare interface SelectOption {
  value: any;
  label: string;
  color: string;
  isFixed?: boolean;
  isDisabled?: boolean;
};


declare interface RepositoryInputData extends Repository {
  owner: Partial<User>;
};

declare interface TeamInputData extends Team {
  leader: TeamRelation;
  repository?: RepositoryInputData;
};

declare type ModalDisclosureData = {
  title: string;
  text?: string;
  body?: import("react").ReactNode;
  options: JSX.Element[];
};

declare type RepositoriesLinkInput = {
  repository: import("@prisma/client").Prisma.RepositoryCreateInput;
  classroomId?: string;
  teamId?: string;
};

declare type GithubRepositoryCommitRef = {
  sha: string;
  commit: {
    message: string;
    tree: {
      sha: string
    }
  };
};

declare type GithubRepositoryCommit = {
  sha: string;
  html_url: string;
  stats: {
    total: number;
    additions: number;
    deletions: number;
  };
  committer?: {
    login: string;
    id: number;
  };
  files: {
    status: "added" | "removed" | "modified" | "renamed" | "copied" | "changed" | "unchanged";
    filename: string;
    raw_url: string;
  }[];
};

declare type GithubTreesFile = {
  url: string;
  path: string;
  content: string;
  commit: string;
};

declare type TaskEventTypes = "@commits:refresh";

declare type InstallationLimit = {
  limit: number;
  used: number;
  remaining: number;
  reset: number;
  isFetching: boolean;
};

declare type AlertTypeTagParams = {
  type: AlertTypes;
  classroom?: string;
  team?: string;
};