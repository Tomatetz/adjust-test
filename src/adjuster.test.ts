import Adjuster from "./adjuster";

let adjaster = new Adjuster();
test("adjaster initial values", () => {
  expect(adjaster.secondsStack).toStrictEqual([]);
  expect(adjaster.requestInAction).toStrictEqual(false);
  expect(adjaster.requestInAction).toStrictEqual(false);
});
test("http response", async () => {
  const response = await adjaster.makeRequest(
    JSON.stringify(new Date().getSeconds())
  );
  expect(response).toEqual({ id: expect.any(Number) });
});
test("output", () => {
  document.addEventListener("DOMContentLoaded", () => {
    adjaster.updateOutput("test");
    expect(document.getElementById("output")).toMatchInlineSnapshot(
      "<li>test</li>"
    );
  });
});
