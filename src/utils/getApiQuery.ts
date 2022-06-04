import { Prisma as P } from "@prisma/client";

function getApiQuery(query: string = ""): P.StringFilter {
  return {
    contains: query.toLowerCase() ?? "",
    mode: "insensitive" as any
  };
};

function getApiClassroomRole(query: string = ""): P.EnumClassroomRolesFilter {
  const realQuery = query.toUpperCase().replace(/ /g, "_");
  let result: ClassroomRoles | undefined = undefined;

  if(("OWNER" as ClassroomRoles).includes(realQuery)) {
    result = "OWNER";
  } else if(("ADMIN" as ClassroomRoles).includes(realQuery)) {
    result = "ADMIN";
  } else if(("OBSERVER" as ClassroomRoles).includes(realQuery)) {
    result = "OBSERVER";
  } else if(("STUDENT" as ClassroomRoles).includes(realQuery)) {
    result = "STUDENT";
  };
  
  return {
    equals: result
  } as P.EnumClassroomRolesFilter;
};

function getApiAlertsType(query: string = ""): P.EnumAlertTypesFilter {
  const realQuery = query.toUpperCase().replace(/ /g, "_");
  let result: AlertTypes | undefined = undefined;

  if(("CLASSROOM" as AlertTypes).includes(realQuery)) {
    result = "CLASSROOM";
  } else if(("CLASSROOM_RELATION" as AlertTypes).includes(realQuery)) {
    result = "CLASSROOM_RELATION";
  } else if(("COMMIT" as AlertTypes).includes(realQuery)) {
    result = "COMMIT";
  } else if(("REPOSITORY" as AlertTypes).includes(realQuery)) {
    result = "REPOSITORY";
  } else if(("TEAM" as AlertTypes).includes(realQuery)) {
    result = "TEAM";
  } else if(("TEAM_RELATION" as AlertTypes).includes(realQuery)) {
    result = "TEAM_RELATION";
  };
  
  return {
    equals: result
  } as P.EnumAlertTypesFilter;
};

export { getApiQuery, getApiClassroomRole, getApiAlertsType };

