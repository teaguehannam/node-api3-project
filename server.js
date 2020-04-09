const express = require("express");
const helmet = require("helmet");
const userRouter = require("./users/userRouter");
const server = express();

server.use(helmet());
server.use(express.json());
server.get("/", (req, res) => {
	res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use("/api/users", logger, userRouter);

function logger(req, res, next) {
	const method = req.method;
	const endpoint = req.originalUrl;

	console.log(`${method} to ${endpoint}`);
	next();
}

module.exports = server;