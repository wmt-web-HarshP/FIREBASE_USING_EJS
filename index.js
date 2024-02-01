const express = require("express");
const app = express();
const path = require("path");
var bodyParser = require("body-parser");

//template engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.get("/", (req, res) => {
  res.send("Firebase demo App of nodejs-db-demo Project.");
});

//router
const booksRouter = require("./routes/books");
const userRouter=require("./routes/user");
const uploadRouter=require('./routes/upload')
const messageRouter=require('./routes/messaging')

//router middleware
app.use("/books", booksRouter);
app.use('/users',userRouter)
app.use('/uploads',uploadRouter)
app.use('/messages',messageRouter)

//port requiring
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening at port ${port}`);
});
