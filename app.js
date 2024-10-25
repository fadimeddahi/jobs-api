require("dotenv").config();
require("express-async-errors");

const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");

const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

// error handler
const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());
// extra packages

// routes
app.get("/", (req, res) => {
  res.send('<h1>Jobs API</h1><a href="/api-docs">API Documentation</a>');
});
app.use("/api-use ", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);


app.use(helmet());
app.use(cors());
app.use(xss());
app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);





const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
