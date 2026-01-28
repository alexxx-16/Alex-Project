// PART ONE: imports
import express from "express";
import { resolve } from "node:path";
import pg from "pg";
import bcrypt from "bcrypt";
import morgan from "morgan";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
// { LocalStrategy } breaks things. dont use
import "dotenv/config";

// PART TWO: app setup/config
const db = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const app = express();
const port = process.env.PORT || 3001;
const __dirname = import.meta.dirname;
const saltRounds = 10;

app.set("view engine", "ejs");
app.set("views", resolve(__dirname, "views"));

// PART THREE: middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 },
  }),
);

// PART FOUR: passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  "local",
  new Strategy(async function verify(username, password, cb) {
    try {
      // ONE: able to look for user in database
      const result = await db.query("SELECT * FROM web_user WHERE email = $1", [
        username,
      ]);

      // 1. user can be found in database
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;

        bcrypt.compare(password, storedHashedPassword, (err, result) => {
          // result is boolean

          // I. technical safety check
          if (err) {
            return cb(err);
          }
          // II. passwords match
          if (result) {
            return cb(null, user);
          }
          // III. passwords dont match
          if (!result) {
            return cb(null, false);
          }
        });
      } else {
        // 2. user not in database
        return cb("User not found");
      }
    } catch (err) {
      // TWO: database errors
      return cb(err);
    }
  }),
);

// save only the id instead of the whole user data
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

// retrieve user id on very user request
passport.deserializeUser(async (id, cb) => {
  try {
    const result = await db.query("SELECT * FROM web_user WHERE id = $1", [id]);
    const user = result.rows[0];
    cb(null, user);
  } catch (err) {
    cb(err);
  }
});

// PART FIVE: routes
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/secrets", (req, res) => {
  console.log(req.user);
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});

app.post("/register", async (req, res) => {
  const { username: email, password } = req.body;

  try {
    // ONE: get to database
    const checkResult = await db.query(
      "SELECT * FROM web_user WHERE email = $1",
      [email],
    );

    // 1. cant register: user already exists
    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      // 2. can register: user doesnt exists
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        // I. hashing failed
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          // II. hashing successful
          console.log("Successfully hashing Password");
          const result = await db.query(
            "INSERT INTO web_user (email, password) VALUES ($1, $2) RETURNING *",
            [email, hash],
          );
          const user = result.rows[0];

          // passport saves login state in session
          req.login(user, (err) => {
            console.log(err);
            res.redirect("/secrets");
          });
        }
      });
    }
  } catch (err) {
    // TWO: error getting database
    console.log(err);
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secrets",
    failureRedirect: "/login",
  }),
);

// PART SIX: server listen
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
