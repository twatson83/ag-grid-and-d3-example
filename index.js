require("babel-register");

delete process.env.BROWSER;

require("./server/app")(function (app) {
  if (process.env.NODE_ENV === "development"){
    require("./webpack/server")(app);
  }
});