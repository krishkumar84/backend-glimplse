import express, { Express, json, urlencoded } from "express";
import router from "./router";
import db from "./utils/db";

const app: Express = express();

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(router);

app.listen(process.env.PORT, () => {
    console.log("✅ server started");
    db.connect();
});
