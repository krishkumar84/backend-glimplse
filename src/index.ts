import express, { Express, Response, json, urlencoded } from "express";
import cors from "cors";
import router from "./router/index";
import db from "./utils/db";

const app: Express = express();

app.use(cors({ origin: ['http://localhost:5173', 'https://dashboard.glimpse.net.in/'], credentials: true }));
app.use(json());
app.use(urlencoded({ extended: false }));

app.use("/", router);

app.get("/ping", (_req, res: Response) => {
    return res.status(200).json({
        message: "✅ server running"
    });
});

app.listen(process.env.PORT, () => {
    console.log("✅ server started");
    db.connect();
});
