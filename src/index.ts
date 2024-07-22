// const express = require("express");
import dotenv from "dotenv";
import express, {Request, Response, NextFunction, RequestHandler} from "express";

dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(express.json());

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

// Middleware Auth
const isAuthorized: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (authorization === "test") {
    next();
  } else {
    res.status(403).json({ message: "Unauthorized" });
  }
} 

// CREATE
app.post("/users", isAuthorized, (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name,
    };

    users.push(newUser);
    res.json(newUser);
});

// READ
app.get("/users", isAuthorized, (req, res) => {
    res.json(users);
});

// UPDATE
app.put("/users/:id", isAuthorized,(req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find((user) => user.id === id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name;
    res.json(user);
});

// DELETE
app.delete("/users/:id", isAuthorized, (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "User not found" });
    }

    users.splice(index, 1);
    res.sendStatus(204);
});

// GET one user
app.get("/users/:id", isAuthorized, (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find((user) => user.id === id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});