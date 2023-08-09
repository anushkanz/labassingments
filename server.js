require("dotenv").config();
const express = require("express");
const app = express();
const port = 6002;
app.use(express.json());

var indexRouter = require("./routes/index");
app.use("/", indexRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
