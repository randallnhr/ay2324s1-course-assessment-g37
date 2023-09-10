import bcrypt from "bcrypt";
import MongoStore from "connect-mongo";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import mongodb, { MongoClient, ServerApiVersion } from "mongodb";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { UserDocument } from "./types";

dotenv.config();

const PORT = process.env.PORT || 8080;

if (
  process.env.MONGODB_URI === undefined ||
  process.env.SESSION_SECRET === undefined
) {
  throw new Error("dotenv is not configured!");
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

(async function init() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("main-db").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error(error);
  }
})();

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const users = client.db("main-db").collection("users");
      const userDocument = await users.findOne({ username });

      // check if user exists
      if (userDocument === null) {
        return done(null, false);
      }

      // check for correct password
      const isPasswordMatch = await bcrypt.compare(
        password,
        userDocument.password
      );

      if (isPasswordMatch) {
        return done(null, userDocument);
      }

      // wrong password
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

// convert {expressUser / userDocument} to id
passport.serializeUser((expressUser, done) => {
  const userDocument = expressUser as UserDocument;
  return done(null, userDocument._id);
});

// convert id to {expressUser / userDocument}
passport.deserializeUser(async (_id: string, done) => {
  try {
    const users = client.db("main-db").collection("users");
    const userDocument = await users.findOne({
      _id: new mongodb.ObjectId(_id),
    });

    if (userDocument === null) {
      return done(`User with _id="${_id}" does not exist`, false);
    }

    return done(null, userDocument);
  } catch (error) {
    return done(error, false);
  }
});

const app = express();
app.use(cors());
app.use(express.json());

// express-session middleware must be set up before passport middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      dbName: "main-db",
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("rainbow");
});

app.post("/api/auth/log-in", passport.authenticate("local"), (req, res) => {
  const expressUser = req.user;
  const userDocument = expressUser as UserDocument;

  return res.status(200).send({ username: userDocument.username });
});

app.post("/api/auth/sign-up", async (req, res) => {
  try {
    const { username, password } = req.body;

    // check whether this username already exists
    const users = client.db("main-db").collection("users");
    const userDocument = await users.findOne({ username });

    if (userDocument) {
      // this username already exists
      res.status(409).send("Duplicated username");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserDocument = {
      username,
      password: hashedPassword,
    };

    const result = await users.insertOne(newUserDocument);

    if (result.acknowledged) {
      res.status(200).send();
    } else {
      throw new Error("Database failed to acknowledge request");
    }
  } catch (error) {
    console.error(error);
    res.status(503).send(error);
  }
});

app.delete("/api/auth/log-out", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error(error);
      res.send(error);
    } else {
      // the default name of the session cookie is "connect.sid"
      // source: https://expressjs.com/en/resources/middleware/session.html
      res.clearCookie("connect.sid");
      res.status(200).send();
    }
  });
});

app.get("/api/auth/secret", passport.authenticate("local"), (req, res) => {
  res.send("secret");
});

app.post(
  "/api/auth/change-password",
  passport.authenticate("local"),
  async (req, res) => {
    const expressUser = req.user;
    const userDocument = expressUser as UserDocument;

    const { newPassword } = req.body;
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    try {
      const users = client.db("main-db").collection("users");

      const result = await users.updateOne(
        { _id: new mongodb.ObjectId(userDocument._id) },
        {
          $set: { password: newHashedPassword },
        }
      );

      if (result.acknowledged) {
        res.status(200).send();
      } else {
        throw new Error("Database failed to acknowledge request");
      }
    } catch (error) {
      console.error(error);
      res.status(503).send(error);
    }
  }
);

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
