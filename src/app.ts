import adjaster from "./adjuster";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("clicker").onclick = () => {
    adjaster.updateSecondsStack();
  };
});
