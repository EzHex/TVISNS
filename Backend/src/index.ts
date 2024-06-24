import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import router from './router';
import fileUpload from "express-fileupload";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());
app.use('/', router);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});