const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  serverTimestamp,
} = require("firebase/firestore");
const { pick } = require("lodash");
const express = require("express");
const router = express.Router();
const config = require("../config/firebase.config");
const firebaseConfig = config.firebaseConfig;
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const bookRef = collection(db, "books");


router.get("/", async (req, res) => {
  res.render("book");
});

router.get("/books", async (req, res) => {
  try {
    const querySnapshot = await getDocs(bookRef);
    const books = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      books.push(doc.data());
    });
    return res.send({
      "books records": books,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/create", async (req, res) => {
  const bookdata = pick(req.body, ["title", "auther"]);
  const createdAt = serverTimestamp();
  const book = { ...bookdata, createdAt };
  const newBookRef = await addDoc(bookRef, book);
  console.log(`book added successfully !!!${newBookRef}`);
  return res.send({
    "books records": book,
  });
});

module.exports = router;
