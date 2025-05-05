//To see how the final website should work, run "node solution.js".
//Make sure you have installed all the dependencies with "npm i".
//The password is ILoveProgramming

import express from "express";
import { dirname } from "path"
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const root = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.sendFile(root + "/public/index.html");
})

app.use(bodyParser.urlencoded({extended: true}));

function passwordCheck(req, res, next){
    if(req.body.password === "ILoveProgramming"){
        res.sendFile(root + "/public/secret.html");
    } else {
    console.log(req.body);
    res.redirect("/");
    }
}

app.post("/check", passwordCheck);

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})