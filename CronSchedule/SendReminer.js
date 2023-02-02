const db = require("./../firebase");
const SendReminder = async () => {
  //   cron.schedule("*/1 * * * *", () => {});
  db.collection("users").onSnapshot((snap) => {
    snap.forEach((doc) => {
      let user = doc.data();
      if (user.accepted_invitaion) {
        let arr = [...user.accepted_invitaion];
        for (let i = 0; i < arr.length; i++) {
          //   const time = new Date(arr[i].meeting_time);
          if (arr[i].duration) {
            let t1 = new Date();
            let t2 = new Date(arr[i].meeting_time * 1000);
            let t3 = new Date(arr[i].meeting_time * 1000 + 30 * 60 * 1000);
            if (t2 >= t1 && t2 <= t3) {
              console.log("Send Email");
            }
          }
        }
      }
    });
  });
};
module.exports = SendReminder;
