const express = require("express");
const config = require("../config");
const app = express();
const game = require("./components/game/network");
const server = app.listen(config.api.port, () => {
  console.log("server listening on ", config.api.port);
  game(server);
});
