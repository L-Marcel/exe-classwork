function getChangedOrder(order: "asc" | "desc" | "none") {
  switch(order) {
    case "asc":
      return "desc";
    case "desc": 
      return "none";
    case "none":
      return "asc";
    default:
      return "none";
  };
};

export { getChangedOrder };

