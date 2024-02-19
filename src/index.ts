import express, { Express, json, urlencoded } from "express";
import router from "./router";

const app: Express = express();

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(router);

app.listen(process.env.PORT, () => {
    console.log("✅ server started");
});
