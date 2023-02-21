const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const rformat = require("./utils/response-formater");
const rcode = require("./utils/response-code");
const fs = require("fs");
const rateLimit = require('express-rate-limit')

global.__root = `${__dirname}/`;
const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use('/api', apiLimiter)
app.use(cors());

// Frontend static files
app.use(express.static(path.join(__dirname, "public", "web")));
// Images static files
app.use(
    "/public/images",
    express.static(path.join(__dirname, "public", "images")),
);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE",
    );
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, X-Requested-With, Content-Type, Accept",
    );
    next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, "./public/images/"); // './public/images/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
        );
    },
});

var upload = multer({
    storage: storage,
}).single("image");

const uploadImage = (_req, _res) => {
    if(!fs.existsSync("./public/images/")){
        fs.mkdirSync("./public/images/");
    }
}


app.post("/api/upload", uploadImage, upload, function (req, res) {
    res.set("Access-Control-Allow-Origin", "*");

    if (!req.file) {
        return res
            .status(rcode.INTERNAL_SERVER_500)
            .json(rformat.failure("Unable to upload post"));
    } else {
        var imgsrc = req.file.filename;
        return res.status(rcode.OK).json(rformat.success(imgsrc));
    }
});

app.get("/api", function (req, res) {
    res.status(200).send("API WORKS");
});
// app.use('/api/blog', require('./articles/article.controler'));

var postController = require(`${__root}post/post.controler`);
app.use("/api/post", postController);

var brandController = require(`${__root}brand/brand.controler`);
app.use("/api/brand", brandController);

var gossipController = require(`${__root}gossip/gossip.controler`);
app.use("/api/gossip", gossipController);

var billboardController = require(`${__root}billboard/billboard.controler`);
app.use("/api/billboard", billboardController);

var pollController = require(`${__root}poll/poll.controler`);
app.use("/api/poll", pollController);

var articleController = require(`${__root}articles/article.controler`);
app.use("/api/article", articleController);

// app.use(require('./articles/article.controler'));

var validationController = require(`${__root}validation/validation.controler`);
app.use("/api/author", validationController);

var adminController = require(`${__root}admin/admin.controler`);
app.use("/api/admin", adminController);

// var pollControler = require(__root + 'poll/poll.controler');
// app.use('/api/poll', pollControler);

module.exports.app = app;
module.exports.upload = upload;
