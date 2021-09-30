const express = require("express");

const snippetsController = require("./controllers/snippets");
const app = express();
const port = 5000;

app.get("/snippets", snippetsController.getSnippets);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
