function getTooltipPayloadName(name: string, isClassroom: boolean = false) {  
  switch(name) {
    case "total additions":
      return "<- total additions";
    case "total deletions":
      return "<- total deletions";
    case "total changes":
      return "<- total changes";
    case "files added":
      return "<- files added";
    case "files removed":
      return "<- files removed";
    case "files modified":
      return "<- files modified";
    case "files":
      return isClassroom? "<- files":"-> files";
    case "sloc":
      return "-> sloc";
    default:
      return "<- " + name;
  };
};

export { getTooltipPayloadName };

