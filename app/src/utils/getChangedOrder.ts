function getChangedOrder(order: "asc" | "desc" | "percent-asc" | "percent-desc" | "none", havePercent = false) {
  switch(order) {
    case "asc":
      return havePercent? "percent-desc":"none";
    case "desc": 
      return "asc";
    case "none":
      return "desc";
    case "percent-desc":
      return "percent-asc";
    case "percent-asc":
      return "none";
    default:
      return "none";
  };
};

export { getChangedOrder };

