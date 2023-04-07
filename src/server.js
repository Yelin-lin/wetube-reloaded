import express from "express";

const POST = 4000;

const app = express();

const handleListening = (req, res)=> {
    return res.end();
};

app.listen(4000, handleListening);
