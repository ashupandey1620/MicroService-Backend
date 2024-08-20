import express, {Request, Response} from 'express';
import "./database/index"
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from "./routes/authRoutes";

import morgan from 'morgan';
import candidatesRoutes from "./routes/ManagementRoutes";
dotenv.config();
const app = express();
const host = "0.0.0.0";
const port = process.env.PORT || 3000;
// const port = 80;
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
// const port = parseInt(process.env.PORT || '80', 10);
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: 'Hello World',
    });
});

app.use(morgan('tiny'));
app.use('/api', authRoutes);
app.use('/api', candidatesRoutes);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

