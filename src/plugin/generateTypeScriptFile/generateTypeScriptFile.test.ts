import generateTypeScriptFile from "./index";

describe("plugin/generateTypeScriptFile", () => {
  it("pages router works as expected", () => {
    const pagesDir = __dirname + "/mocks/pages";
    expect(
      generateTypeScriptFile({ pagesRouterDir: pagesDir })
    ).toMatchSnapshot();
  });
  it("app router works as expected", () => {
    const pagesDir = __dirname + "/mocks/app";
    expect(
      generateTypeScriptFile({ appRouterDir: pagesDir })
    ).toMatchSnapshot();
  });
  it("works for projects not using API routes", () => {
    const pagesDir = __dirname + "/mocks/pages-no-api-routes";
    expect(
      generateTypeScriptFile({ pagesRouterDir: pagesDir })
    ).toMatchSnapshot();
  });
});
