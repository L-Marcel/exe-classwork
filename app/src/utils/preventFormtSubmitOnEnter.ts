function handlePreventFormSubmitOnEnter(e) {
  const target: any = e.target;

  if(
    e.key === "Enter" && 
    target.type !== "submit" &&
    (
      target.id === "switch" || 
      target.id === "select" ||
      target.id.includes("react-select")
    )
  ) {
    e.preventDefault();
  };
};

export { handlePreventFormSubmitOnEnter };
