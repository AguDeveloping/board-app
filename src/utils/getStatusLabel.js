export function getStatusLabel(status) {
  switch (status) {
    case "todo":
      return "To Do";
    case "doing":
      return "Doing";
    case "done":
      return "Done";
    default:
      return status;
  }
}