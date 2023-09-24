import bcrypt from "bcrypt";
import MongoStore from "connect-mongo";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Question, User, UserWithoutPassword } from "./types";

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

      if (response.status === 204) {
        // username does not exist
        return done(null, false);
      }

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

    if (response.status === 204) {
      // username does not exist
      return done(null, false);
    }

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

  const userWithoutPassword: UserWithoutPassword = {
    username: user.username,
    displayName: user.displayName,
    role: user.role,
  };

  return res.status(200).json(userWithoutPassword);
});

app.post("/api/auth/sign-up", async (req, res) => {
  try {
    const { username, password, displayName } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const response = await fetch(`${USER_SERVICE_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: hashedPassword,
        displayName: displayName,
        role: "basic",
      }),
    });

    // pass along the status code
    res.sendStatus(response.status);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.delete("/api/auth/log-out", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error(error);
      res.sendStatus(500);
      return;
    }

    // the default name of the session cookie is "connect.sid"
    // source: https://expressjs.com/en/resources/middleware/session.html
    res.clearCookie("connect.sid");
    res.sendStatus(200);
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
    res.sendStatus(401);
    return;
  }

  res.status(200).json({ secret: 42 });
});

// ============================================================================
// user service
// ============================================================================

app.get("/api/users/:username", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.sendStatus(401);
    return;
  }

  try {
    const username = req.params.username;

    const response = await fetch(`${USER_SERVICE_URL}/api/users/${username}`);

    if (response.status !== 200) {
      // pass along the status code
      res.sendStatus(response.status);
      return;
    }

    const json = await response.json();
    const user = json as User;

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post("/api/users", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.sendStatus(401);
    return;
  }

  try {
    const { username, password, displayName } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const response = await fetch(`${USER_SERVICE_URL}/api/users`, {
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

    // pass along the status code
    res.sendStatus(response.status);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.put("/api/users/:username", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.sendStatus(401);
    return;
  }

  const user = req.user as User;

  const oldUsername = user.username;
  const oldHashedPassword = user.password;
  const oldDisplayName = user.displayName;
  const oldRole = user.role;

  try {
    // check whether user is changing password
    if ("oldPassword" in req.body && "newPassword" in req.body) {
      const { oldPassword, newPassword } = req.body;

      // check whether the old password provided by the user is correct
      const isOldPasswordMatch = await bcrypt.compare(
        oldPassword,
        oldHashedPassword
      );

      if (!isOldPasswordMatch) {
        // wrong old password
        res.sendStatus(401);
        return;
      }

      const newHashedPassword = await bcrypt.hash(newPassword, 10);

      const response = await fetch(
        `${USER_SERVICE_URL}/api/users/${oldUsername}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: oldUsername,
            password: newHashedPassword,
            displayName: oldDisplayName,
            role: oldRole,
          }),
        }
      );

      // pass along the status code
      res.sendStatus(response.status);
    } else {
      // user is changing details other than password
      const { username, displayName, role } = req.body;

      if (username !== oldUsername) {
        // the user should not be able to change the details of another person
        res.sendStatus(401);
        return;
      }

      const response = await fetch(
        `${USER_SERVICE_URL}/api/users/${oldUsername}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: oldUsername,
            password: oldHashedPassword,
            displayName: displayName,
            role: role,
          }),
        }
      );

      // pass along the status code
      res.sendStatus(response.status);
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.delete("/api/users/:username", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.sendStatus(401);
    return;
  }

  try {
    const username = req.params.username;

    const response = await fetch(`${USER_SERVICE_URL}/api/users/${username}`, {
      method: "DELETE",
    });

    // pass along the status code
    res.sendStatus(response.status);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

// ============================================================================
// question service
// ============================================================================

app.get("/api/questions", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.sendStatus(401);
    return;
  }

  try {
    const response = await fetch(`${QUESTION_SERVICE_URL}/api/questions`);

    if (response.status !== 200) {
      // pass along the status code
      res.sendStatus(response.status);
      return;
    }

    const json = await response.json();
    const questions = json as Question[];

    res.status(200).send(questions);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get("/api/questions/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.sendStatus(401);
    return;
  }

  try {
    const id = req.params.id;

    const response = await fetch(`${QUESTION_SERVICE_URL}/api/questions/${id}`);

    if (response.status !== 200) {
      // pass along the status code
      res.sendStatus(response.status);
      return;
    }

    const json = await response.json();
    const question = json as Question;

    res.status(200).send(question);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post("/api/questions", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.sendStatus(401);
    return;
  }

  try {
    const json = req.body;
    const question = json as Question;

    const response = await fetch(`${QUESTION_SERVICE_URL}/api/questions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(question),
    });

    // pass along the status code
    res.sendStatus(response.status);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.put("/api/questions", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.sendStatus(401);
    return;
  }

  try {
    const json = req.body;
    const question = json as Question;

    const response = await fetch(`${QUESTION_SERVICE_URL}/api/questions`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(question),
    });

    // pass along the status code
    res.sendStatus(response.status);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.delete("/api/questions/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.sendStatus(401);
    return;
  }

  try {
    const id = req.params.id;

    const response = await fetch(
      `${QUESTION_SERVICE_URL}/api/questions/${id}`,
      { method: "DELETE" }
    );

    // pass along the status code
    res.sendStatus(response.status);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
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
