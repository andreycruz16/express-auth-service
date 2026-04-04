import express from "express";
import authRoutes from "@/features/auth/auth.route";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use("/auth", authRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
