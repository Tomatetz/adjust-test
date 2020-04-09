import Adjuster from "./adjuster";

let adjaster = new Adjuster();

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("clicker").onclick = () => {
    adjaster.updateSecondsStack();
  };
});
