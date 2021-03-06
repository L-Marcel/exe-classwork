function getAlertTags({
  type,
  classroom,
  team
}: AlertTypeTagParams) {
  const _type = `#${type.replace("_RELATION", "").toLowerCase()} ` || "#unknown ";
  const _classroom = classroom? `#${classroom.replace(/(-| )/g, "_").toLowerCase()} `:"";
  const _team = team? `#${team.replace(/(-| )/g, "_").toLowerCase()} `:"";

  return `${_type}${_team}${_classroom}`;
};

export { getAlertTags };

