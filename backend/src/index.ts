import express from "express";
import api from "./routes/api";

const app = express();
const port = Number(process.env.PORT ?? 3000);

app.use(express.json());

app.use("/api", api)

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
