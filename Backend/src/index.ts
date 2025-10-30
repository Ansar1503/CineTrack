import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import EntryRoutes from "./routes/EntryRoutes";
import { ROUTES } from "./constants/RouteConstants";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();
app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(ROUTES.ENTRY.BASE, EntryRoutes);
app.use(errorHandler);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);
