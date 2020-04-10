import { SecondsStack, HTTPResponse } from "./model";

class Adjuster {
  secondsStack: SecondsStack;
  requestInAction: boolean; // Flag to avoid double fetching on window focus
  windowIsBlur: boolean;
  constructor() {
    this.secondsStack = new Array();
    this.requestInAction = false;
    this.windowIsBlur = false;
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
    const seconds: number = new Date().getSeconds();
    ~secondsStack.indexOf(seconds) // Bitwise NOT, ~-1 = 0
      ? this.updateOutput(`Repeated seconds alert (${seconds})`, "repeat")
      : (secondsStack.push(seconds), fetchData(seconds)); // Put seconds to stack, attempt to fetch
  };
  fetchData = async (seconds: number) => {
    if (!this.requestInAction && !this.windowIsBlur) {
      this.requestInAction = true;
      let result = await this.makeRequest(JSON.stringify({ seconds }));
      this.updateOutput(`id: ${result.id}, seconds: ${seconds}`, "response");
      this.requestInAction = false;
      this.secondsStack.shift(); // Remove utilized seconds from stack
      if (this.secondsStack.length) this.fetchData(this.secondsStack[0]); // Fetch next
    }
  };
  makeRequest(request: string) {
    return new Promise<HTTPResponse>((resolve) => {
      let xhr = new XMLHttpRequest();
      // xhr.open("POST", "https://reqres.in/api/users?delay=4"); // Request with delay to debug window blur
      xhr.open("POST", "https://jsonplaceholder.typicode.com/posts");
      xhr.onload = () => {
        if (xhr.status === 201) resolve(JSON.parse(xhr.response)); // RESTfull POST should return code 201
      };
      xhr.send(request);
    });
  }
  updateOutput(value: string, className: string) {
    document.getElementById(
      "output"
    ).innerHTML += `<li class=${className}>${value}</li>`; // Log output factory
  }
}
const adjaster = new Adjuster();
Object.freeze(adjaster);
export default adjaster;
