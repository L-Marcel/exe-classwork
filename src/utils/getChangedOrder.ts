function getChangedOrder(order: "asc" | "desc" | "none") {
  switch(order) {
    case "asc":
      return "none";
    case "desc": 
      return "asc";
    case "none":
      return "desc";
    default:
      return "none";
  };
};

export { getChangedOrder };

