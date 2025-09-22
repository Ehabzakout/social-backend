import express from "express";
import bootstrap from "./app.controller";
import envConfig from "./config/env/env-config";
const app = express();
const port = envConfig.PORT;

bootstrap(app, express);
app.listen(port, () => {
	console.log("Server is running on port: ", port);
});
