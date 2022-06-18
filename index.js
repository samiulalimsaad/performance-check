const express = require("express");
const cluster = require("cluster");
const cors = require("cors");

// Check the number of available CPU.
const numCPUs = require("os").cpus().length;

const app = express();
app.use(cors());
const PORT = 5000;

console.log({ numCPUs });

// For Master process
if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // This event is firs when worker died
    cluster.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
}

// For Worker
else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    app.listen(PORT, (err) => {
        err
            ? console.log("Error in server setup")
            : console.log(`Worker ${process.pid} started`);
    });
}

app.get("/hello", (req, res) => {
    if (req.query.name === "aaa") {
        return res.json({ message: "aaa" });
    }
    let message = "hello ";
    for (let i = 0; i < 1000000; i++) {
        message = i + " hello " + req.query.id;
        console.log(message);
    }
    // for (let i = 0; i < 1000000; i++) {}
    console.log(message);
    res.json({ message });
});

app.get("/", (req, res) => {
    const message = "hello ";
    res.json({ message });
});
