const { initializeApp } = require("firebase/app");
const {
  //for authorization
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} = require("firebase/auth");

const express = require("express");
const router = express();
const { pick } = require("lodash");
const config = require("../config/firebase.config");
const firebaseConfig = config.firebaseConfig;
const app = initializeApp(firebaseConfig);

const auth = getAuth();

router.get("/", async (req, res) => {
  res.render("user");
});

router.post("/signup", async (req, res) => {
  const userdata = pick(req.body, ["email", "password"]);
  const registerUser = await createUserWithEmailAndPassword(
    auth,
    userdata.email,
    userdata.password
  )
    .then(() => {
      console.log("user created");
      return res.send({
        "user details": userdata,
      });
    })
    .catch((err) => {
      console.log(err);
    });
  if (!registerUser) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

router.post("/login", async (req, res) => {
  const loginData = pick(req.body, "email", "password");
  const authUser = await signInWithEmailAndPassword(
    auth,
    loginData.email,
    loginData.password
  )
    .then(() => {
      console.log("user created");
      return res.send({
        "user details": loginData,
      });
    })
    .catch((err) => {
      console.log(err);
    });
  if (!authUser) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
});

router.post("/logout", async (req, res) => {
  signOut(auth);
  console.log("user signout");
  res.send({ MSG: "RELOGIN REQUIRED" });
});

module.exports = router;
