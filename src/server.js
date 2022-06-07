import fs from "fs";
import path from "path";
import express from "express";
import userRouter from "./routers/user.js";

const PORT = process.env.PORT || 5500;

let app = express();

app.use(express.json());
app.use(userRouter);
app.use((error, req, res, next) => {
  if (error.status != 500) {
    return res.status(error.status).json({
      status: error.status,
      message: error.message,
    });
  }

  fs.appendFileSync(
    path.join(process.cwd(), "src", "log.txt"),
    `${req.url}___${error.name}___${new Date(Date.now())}___${error.status}___${error.message}\n`
  );

  res.status(error.status).json({
    status: error.status,
    message: "InternalServerError",
  });

  process.exit();
});

app.listen(5500, console.log(`localhost:${PORT}`));
