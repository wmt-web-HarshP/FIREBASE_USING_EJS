require("dotenv/config");
const express = require("express");
const router = express.Router();
const FCM = require("fcm-node");
const server_key = process.env.SERVER_KEY;
// admin.initializeApp({
//   credential: admin.credential.applicationDefault(),
// });

router.post("/fcm", async (req, res) => {
  try {
    let fcm = new FCM(server_key);

    let message = {
      to: "/topics/" + req.body.topic,
      Notification: {
        title: req.body.title,
        body: req.body.body,
        sound: "default",
        click_action: "FCM_PLUGIN_ACTIVITY",
        icon: "fcm_push_icon",
      },
      data: req.body.data,
    };
    console.log(message);
    // console.log(Notification);
    fcm.send(message, (error, response) => {
      if (error) {
        console.log("Error : ", error);
      } else {
        res.json(response);
      }
    });
  } catch (error) {
    next(error);
  }
});

router.sendFCMMessage = (message) => {
  let fcm = new FCM(server_key);
  fcm.send(message, (error, response) => {
    if (error) {
      console.error("Error sending FCM message:", error);
    } else {
      console.log("FCM message sent successfully:", response);
    }
  });
};

module.exports = router;
