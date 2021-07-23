import express from "express";
import { createPod } from "./createPod.js";
var app = express();

app.listen(3000, () => {
 console.log("Server running on port 3000");
});


app.get("/create-new-pod", (req, res, next) => {
    createPod("my-pod", "add-item-app", "docker.io/karamkhanna/add_item_app:latest");
    res.json(["Completed"]);


});

app.get("/test", (req, res, next) => {
    res.json(["Server running"]);
});

