require("babel-register");

delete process.env.BROWSER;

require("./server/app")(function (app) {
  require("./webpack/server")(app);
});