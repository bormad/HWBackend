const express = require("express");
const chalk = require("chalk");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { auth } = require("./middlewares/auth");

const {
  addNote,
  getNotes,
  removeNote,
  patchNote,
} = require("./notes.controller");

const { addUser, loginUser } = require("./user.controller");

const port = 3000;
const app = express();

app.set("view engine", "ejs");
app.set("views", "pages");

app.use(express.static(path.resolve(__dirname, "public")));

app.use(express.json());
app.use(cookieParser());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/login", async (req, res) => {
  res.render("login", {
    title: "Express app",
    error: undefined,
  });
});

app.post("/login", async (req, res) => {
  try {
    const token = await loginUser(req.body.email, req.body.password);

    res.cookie("token", token);

    res.redirect("/");
  } catch (e) {
    res.render("login", {
      title: "Express app",
      error: e.message,
    });
  }
});

app.get("/register", async (req, res) => {
  res.render("register", {
    title: "Express app",
    error: undefined,
  });
});

app.post("/register", async (req, res) => {
  try {
    await addUser(req.body.email, req.body.password);
    res.redirect("/login");
  } catch (e) {
    if (e.code === 11000) {
      res.render("register", {
        title: "Express app",
        error: "Пользователь с таким email уже существует",
      });
      return;
    }
    res.render("register", {
      title: "Express app",
      error: e.message,
    });
  }
});

app.use(auth);

app.get("/", async (req, res) => {
  res.render("index", {
    title: "Express app",
    userEmail: req.user.email,
    notes: await getNotes(),
  });
});

app.post("/", async (req, res) => {
  await addNote(req.body.title, req.user.email);
  res.render("index", {
    title: "Express app",
    userEmail: req.user.email,
    notes: await getNotes(),
  });
});

app.delete("/:id", async (req, res) => {
  try {
    await removeNote(req.params.id, req.user.email);
    res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: false,
    });
  } catch (e) {
    res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: e.message,
    });
  }
});

app.put("/:id", async (req, res) => {
  try {
    await patchNote(
      { id: req.params.id, title: req.body.title },
      req.user.email
    );
    res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: false,
    });
  } catch (e) {
    res.render("index", {
      title: "Express App",
      notes: await getNotes(),
      userEmail: req.user.email,
      created: false,
      error: e.message,
    });
  }
});

mongoose
  .connect(
    "mongodb+srv://admin:123@cluster0.wpnqajf.mongodb.net/notes?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(port, () => {
      console.log(chalk.green(`Server has been started on port ${port}`));
    });
  });
