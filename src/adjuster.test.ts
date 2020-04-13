import adjaster from "./adjuster";

test("Adjaster initial values", () => {
  expect(adjaster.secondsStack).toStrictEqual([]);
  expect(adjaster.requestIsPending).toStrictEqual(false);
  expect(adjaster.windowIsBlur).toStrictEqual(false);
});
test("Http response", async () => {
  const response = await adjaster.makeRequest(
    JSON.stringify(new Date().getSeconds())
  );
  expect(response).toEqual({ id: expect.any(Number) });
});
test("Seconds stack update", () => {
  adjaster.updateSecondsStack();
  expect(adjaster.secondsStack.length).toEqual(1);
  adjaster.updateSecondsStack();
  expect(adjaster.secondsStack.length).toEqual(1);
  expect(adjaster.lastAdded.getSeconds()).toEqual(adjaster.secondsStack[0]);
});
test("Output update", () => {
  document.addEventListener("DOMContentLoaded", () => {
    adjaster.updateOutput("test", "test-class");
    expect(document.getElementById("output")).toMatchInlineSnapshot(
      "<li class='test-class'>test</li>"
    );
  });
});
