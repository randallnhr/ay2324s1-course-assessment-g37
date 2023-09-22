import bcrypt from "bcrypt";
import MongoStore from "connect-mongo";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Question, User } from "./types";

dotenv.config();

// ============================================================================
// Global constants
// ============================================================================

if (
  process.env.AUTH_MONGODB_URI === undefined ||
  process.env.AUTH_SESSION_SECRET === undefined
) {
  throw new Error("dotenv is not configured!");
}

const PORT = process.env.PORT !== undefined ? Number(process.env.PORT) : 8080;

const useLocalhost = process.env.USE_LOCALHOST === "1";
const USER_SERVICE_URL = useLocalhost ? "http://localhost:3219" : "";
const QUESTION_SERVICE_URL = useLocalhost ? "http://localhost:3001" : "";

// ============================================================================
// set up passport
// ============================================================================

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const response = await fetch(`${USER_SERVICE_URL}/api/users/${username}`);
      const json = await response.json();
      const user = json as User;

      // check for correct password
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (isPasswordMatch) {
        return done(null, user);
      }

      // wrong password
      return done(null, false);
    } catch (error) {
      console.error(error);
      return done(error, false);
    }
  })
);

// convert user (expressUser) to username (id)
passport.serializeUser((expressUser, done) => {
  const user = expressUser as User;
  return done(null, user.username);
});

// convert username (id) to user (expressUser)
passport.deserializeUser(async (username: string, done) => {
  try {
    const response = await fetch(`${USER_SERVICE_URL}/api/users/${username}`);
    const json = await response.json();
    const user = json as User;

    return done(null, user);
  } catch (error) {
    console.error(error);
    return done(error, false);
  }
});

// ============================================================================
// initialise express server
// ============================================================================

const app = express();
app.use(cors());
app.use(express.json());

// express-session middleware must be set up before passport middleware
app.use(
  session({
    secret: process.env.AUTH_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: MongoStore.create({
      mongoUrl: process.env.AUTH_MONGODB_URI,
      dbName: "main-db",
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ============================================================================
// authentication
// ============================================================================

app.post("/api/auth/log-in", passport.authenticate("local"), (req, res) => {
  const expressUser = req.user;
  const user = expressUser as User;

  return res.status(200).send({ username: user.username });
});

app.post("/api/auth/sign-up", async (req, res) => {
  try {
    const { username, password, displayName } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await fetch(`${USER_SERVICE_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: hashedPassword,
        displayName: displayName,
      }),
    });

    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.send(error);
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

app.get("/api/auth/current-user", (req, res) => {
  const expressUser = req.user;

  if (expressUser === undefined) {
    res.status(200).json({ username: null });
    return;
  }

  const user = expressUser as User;

  const userProfileInfo = {
    username: user.username,
    displayName: user.displayName,
    role: user.role,
  };

  res.status(200).json(userProfileInfo);
});

app.get("/api/auth/secret", (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).send();
    return;
  }

  res.status(200).send({ secret: 42 });
});

// ============================================================================
// user service
// ============================================================================

app.get("/api/users/:username", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).send();
    return;
  }

  try {
    const username = req.params.username;

    const response = await fetch(`${USER_SERVICE_URL}/api/users/${username}`);
    const json = await response.json();
    const user = json as User;

    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

app.post("/api/users", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).send();
    return;
  }

  try {
    const { username, password, displayName } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await fetch(`${USER_SERVICE_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: hashedPassword,
        displayName: displayName,
      }),
    });

    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

app.put("/api/users", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).send();
    return;
  }

  try {
    const { username, password, displayName } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await fetch(`${USER_SERVICE_URL}/api/users`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: hashedPassword,
        displayName: displayName,
      }),
    });

    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

app.delete("/api/users/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).send();
    return;
  }

  try {
    const id = req.params.id;

    await fetch(`${USER_SERVICE_URL}/api/users/${id}`, {
      method: "DELETE",
    });

    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

// ============================================================================
// question service
// ============================================================================

app.get("/api/questions", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).send();
    return;
  }

  try {
    const response = await fetch(`${QUESTION_SERVICE_URL}/api/questions`);
    const json = await response.json();
    const questions = json as Question[];

    res.status(200).send(questions);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

app.get("/api/questions/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).send();
    return;
  }

  try {
    const id = req.params.id;

    const response = await fetch(`${QUESTION_SERVICE_URL}/api/questions/${id}`);
    const json = await response.json();
    const question = json as Question;

    res.status(200).send(question);
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

app.post("/api/questions", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).send();
    return;
  }

  try {
    const json = req.body;
    const question = json as Question;

    await fetch(`${QUESTION_SERVICE_URL}/api/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(question),
    });

    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

app.put("/api/questions", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).send();
    return;
  }

  try {
    const json = req.body;
    const question = json as Question;

    await fetch(`${QUESTION_SERVICE_URL}/api/questions`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(question),
    });

    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

app.delete("/api/questions/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).send();
    return;
  }

  try {
    const id = req.params.id;

    await fetch(`${QUESTION_SERVICE_URL}/api/questions/${id}`, {
      method: "DELETE",
    });

    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

// ============================================================================
// miscellaneous
// ============================================================================

app.get("/", (req, res) => {
  res.send("rainbow");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
