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
      this.secondsStack.length && this.doRequest(this.secondsStack[0]);
    });
    window.addEventListener("blur", () => {
      this.windowIsBlur = true;
    });
  }
  updateSecondsStack = () => {
    const { doRequest, secondsStack } = this;
    const seconds: number = new Date().getSeconds();
    if (!~secondsStack.indexOf(seconds)) {
      secondsStack.push(seconds);
      doRequest(seconds);
    } else console.log(`Repeated seconds alert!(${seconds})`);
  };
  doRequest = async (seconds: number) => {
    console.log(this.requestInAction, this.windowIsBlur);
    if (!this.requestInAction && !this.windowIsBlur) {
      this.requestInAction = true;
      let result = await this.makeRequest(JSON.stringify({ seconds }));
      this.requestInAction = false;
      this.secondsStack.shift();
      const { id } = result;
      if (this.secondsStack.length) this.doRequest(this.secondsStack[0]);
      console.log(`id: ${id}, seconds: ${seconds}`);
    }
  };
  makeRequest(request: string) {
    return new Promise<HTTPResponse>((resolve) => {
      let xhr = new XMLHttpRequest();
      xhr.open("POST", "https://reqres.in/api/users?delay=5");
      //   xhr.open("POST", "https://jsonplaceholder.typicode.com/posts");
      xhr.onload = () => {
        if (xhr.status === 201) resolve(JSON.parse(xhr.response));
      };
      xhr.send(request);
    });
  }
}
