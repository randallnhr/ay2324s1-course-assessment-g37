"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const questions_1 = require("./routes/questions");
const utility_1 = require("./utility");
// read environment variables
dotenv_1.default.config();
// database set up
// The URI should look like "mongodb+srv://admin:<password>@<clusterxx.yyyyyy>.mongodb.net/test?retryWrites=true&w=majority"
const mongoDbUri = process.env.MONGO_URI;
if (!mongoDbUri) {
    console.log("MongoDB atlas URI not found in environment");
}
else {
    mongoose_1.default.connect(mongoDbUri);
}
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(questions_1.ROUTE_QUESTIONS, questions_1.router);
// catch 400 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(utility_1.CODE_BAD_REQUEST));
});
// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // respond with 400
    res.status(err.status || utility_1.CODE_INTERNAL_SERVER_ERROR).end();
});
exports.default = app;
