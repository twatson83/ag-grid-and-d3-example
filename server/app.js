import express from "express";
import http from "http";
import routes from "./routes";
import bodyParser from "body-parser";
import initSocketServer from "./socketServer";

export default function(callback) {
  let app = express(),
      server = http.createServer(app);

  app.use(bodyParser.json());
  app.use(express.static('client/public'));
  app.use(routes);

  server.listen(3001, () => callback(app));

  initSocketServer(server);
}