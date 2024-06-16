import express, { Express, Response } from "express";
import carRouter from "./routes/carRouter"

const app: Express = express();
const port = 8000;

app.use(express.json());  

app.get("/", (_, res: Response) => {
  res.send("Express + TypeScript Server");
}); 
app.use('/cars',carRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
