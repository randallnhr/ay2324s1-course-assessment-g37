import bcrypt from "bcrypt";
import MongoStore from "connect-mongo";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

dotenv.config();

const PORT = process.env.PORT || 8080;

if (
  process.env.MONGODB_URI === undefined ||
  process.env.SESSION_SECRET === undefined
) {
  throw new Error("dotenv is not configured!");
}

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const response = await fetch(`/api/users/${username}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();

      // check for correct password
      const isPasswordMatch = await bcrypt.compare(password, json.password);

      if (isPasswordMatch) {
        return done(null, json);
      }

      // wrong password
      return done(null, false);
    } catch (error) {
      console.error(error);
      return done(error, false);
    }
  })
);

// convert {expressUser / json} to {id / username}
passport.serializeUser((expressUser, done) => {
  const json = expressUser as any;
  return done(null, json.username);
});

// convert {id / username} to {expressUser / json}
passport.deserializeUser(async (username: string, done) => {
  try {
    const response = await fetch(`/api/users/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    return done(null, json);
  } catch (error) {
    console.error(error);
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
  const json = expressUser as any;

  return res.status(200).send({ username: json.username });
});

app.post("/api/auth/sign-up", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await fetch(`/api/users/${username}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: hashedPassword,
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

app.get("/api/auth/secret", passport.authenticate("local"), (req, res) => {
  res.send("secret");
});

app.put("/api/users", passport.authenticate("local"), async (req, res) => {
  const expressUser = req.user;
  const json = expressUser as any;

  const { newPassword } = req.body;
  const newHashedPassword = await bcrypt.hash(newPassword, 10);

  try {
    await fetch(`/api/users/${json.username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: json.username,
        password: newHashedPassword,
      }),
    });

    res.status(200).send();
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
