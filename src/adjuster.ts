import { SecondsStack, HTTPResponse } from "./model";

export default class Adjuster {
  secondsStack: SecondsStack;
  requestInAction: boolean;
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
    if (!~secondsStack.indexOf(seconds)) {
      secondsStack.push(seconds);
      fetchData(seconds);
    } else this.updateOutput(`Repeated seconds alert!(${seconds})}`);
  };
  fetchData = async (seconds: number) => {
    if (!this.requestInAction && !this.windowIsBlur) {
      this.requestInAction = true;
      let result = await this.makeRequest(JSON.stringify({ seconds }));
      this.updateOutput(`id: ${result.id}, seconds: ${seconds}`);
      this.requestInAction = false;
      this.secondsStack.shift();
      if (this.secondsStack.length) this.fetchData(this.secondsStack[0]);
    }
  };
  makeRequest(request: string) {
    return new Promise<HTTPResponse>((resolve) => {
      let xhr = new XMLHttpRequest();
      // xhr.open("POST", "https://reqres.in/api/users?delay=4");
      xhr.open("POST", "https://jsonplaceholder.typicode.com/posts");
      xhr.onload = () => {
        if (xhr.status === 201) resolve(JSON.parse(xhr.response));
      };
      xhr.send(request);
    });
  }
  updateOutput(value) {
    document.getElementById("output").innerHTML += `<li>${value}</li>`;
  }
}
