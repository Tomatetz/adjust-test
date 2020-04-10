import { SecondsStack, HTTPResponse } from "./model";

class Adjuster {
  secondsStack: SecondsStack;
  lastAdded: Date;
  requestIsPending: boolean; // Flag to avoid double fetching on window focus
  windowIsBlur: boolean;
  constructor() {
    this.secondsStack = new Array();
    window.addEventListener("focus", () => {
      this.windowIsBlur = false;
      this.secondsStack.length && this.fetchData(this.secondsStack[0]);
    });
    window.addEventListener("blur", () => {
      this.windowIsBlur = true;
    });
  }
  updateSecondsStack = () => {
    const { fetchData, secondsStack } = this;
    const currentDate = new Date();
    const seconds: number = currentDate.getSeconds();
    if (
      !this.lastAdded || // Check for initial call or
      seconds !== this.lastAdded.getSeconds() || // Not the same second or
      currentDate.getTime() - this.lastAdded.getTime() > 1000 // More than a second has passed
    ) {
      this.lastAdded = currentDate;
      secondsStack.push(seconds);
      fetchData(seconds);
    } else {
      this.updateOutput(`Repeated seconds alert (${seconds})`, "repeat");
    }
  };
  fetchData = async (seconds: number) => {
    if (!this.requestIsPending && !this.windowIsBlur) {
      this.requestIsPending = true;
      let result = await this.makeRequest(JSON.stringify({ seconds }));
      this.updateOutput(`id: ${result.id}, seconds: ${seconds}`, "response");
      this.requestIsPending = false;
      this.secondsStack.shift(); // Remove utilized seconds from stack
      if (this.secondsStack.length) this.fetchData(this.secondsStack[0]); // Fetch next
    }
  };
  makeRequest = (request: string) => {
    return new Promise<HTTPResponse>((resolve) => {
      let xhr = new XMLHttpRequest();
      // xhr.open("POST", "https://reqres.in/api/users?delay=4"); // Request with delay to debug window blur
      xhr.open("POST", "https://jsonplaceholder.typicode.com/posts");
      xhr.onload = () => {
        if (xhr.status === 201) resolve(JSON.parse(xhr.response)); // RESTfull POST should return code 201
      };
      xhr.send(request);
    });
  };
  updateOutput = (value: string, className: string) => {
    document.getElementById(
      "output"
    ).innerHTML += `<li class=${className}>${value}</li>`; // Output log factory
  };
}
const adjaster = new Adjuster();

export default adjaster;
