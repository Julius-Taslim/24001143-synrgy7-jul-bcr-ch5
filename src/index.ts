import express, { Express, Response } from "express";
import carRouter from "./routes/carRouter"
import userRouter from "./routes/userRouter"
import orderRouter from "./routes/orderRouter"

const app: Express = express();
const port = 8000;

app.use(express.json());  

app.get("/", (_, res: Response) => {
  res.send("Express + TypeScript Server");
}); 
app.use('/cars',carRouter);
app.use('/users',userRouter);
app.use('/orders',orderRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
