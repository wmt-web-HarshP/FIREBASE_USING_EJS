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
const messagesRouter = require("./messaging");


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

  const message = {
    to: "/USERS/",
    notification: {
      topic: "/topics/newbookadded", // Replace with your FCM topic
      title: req.body.title,
      body: req.body.auther,
      sound: "default",
      click_action: "FCM_PLUGIN_ACTIVITY",
      icon: "fcm_push_icon",
    },
    data: { msg: "notification.topic" },
  };
  console.log(message);
  messagesRouter.sendFCMMessage(message);

  return res.send({
    "books records": book,
  });
});

module.exports = router;
