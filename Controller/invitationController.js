const db = require("./../firebase");
const sendEmail = require("./../utils/sendEmail");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
function convertDurationtoSeconds(duration) {
  const [hours, minutes, seconds] = duration.split(":");
  return Number(hours) * 60 + Number(minutes);
}

const returnMinute = (meetDuration) => {
  if (meetDuration.includes("min")) {
    const result = meetDuration.substr("min", 2);
    const newString = `00:${result}:00`;
    return convertDurationtoSeconds(newString);
  }
  if (meetDuration.includes("hr")) {
    const firstMeter = meetDuration.split("hr")[0];
    if (!meetDuration.includes(":")) {
      return convertDurationtoSeconds(`${firstMeter}:00:00`);
    }
    const secoundMeter = meetDuration.split("hr")[1].split(":")[1];
    const newString = `${firstMeter}:${secoundMeter}:00`;
    return convertDurationtoSeconds(newString);
  }
};
exports.sendInvitation = async (req, res) => {
  const { sender_uid, receiver_uid } = req.body;
  if (!sender_uid || !receiver_uid) {
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
  let description = "";
  let avalabilty = {
    Sunday: [],
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
  };
  let avalabilty_array = {
    Sunday: [],
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
  };
  let duration = 0;
  if (req.body.getData) {
    avalabilty = req.body.getData;
    duration = returnMinute(req.body.meetDuration);
  }
  if (req.body.description) {
    description = req.body.description;
  }

  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < avalabilty[days[i]].length; j++) {
      let start = convertDurationtoSeconds(avalabilty[days[i]][j].FROM);
      let end = convertDurationtoSeconds(avalabilty[days[i]][j].TO);
      avalabilty_array[days[i]] = [];
      for (let k = start; k < end; k += duration) {
        let hours = Math.floor(k / 60);
        let minutes = k - hours * 60;
        const ampm = hours >= 12 ? "pm" : "am";
        hours %= 12;
        hours = hours || 12;
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        const strTime = `${hours}:${minutes} ${ampm}`;
        avalabilty_array[days[i]].push(strTime);
      }
    }
  }
  const senderRef = db.collection("users").doc(sender_uid);
  const doc = await senderRef.get();
  const sender_user = doc.data();
  const receiverRef = db.collection("users").doc(receiver_uid);
  const doc1 = await receiverRef.get();
  const receiver_user = doc1.data();

  let waiting_invitaion = [];
  let pending_invitaion = [];
  if ("waiting_invitaion" in sender_user) {
    waiting_invitaion = [...sender_user?.waiting_invitaion];
  }
  if ("pending_invitaion" in receiver_user) {
    pending_invitaion = [...receiver_user?.pending_invitaion];
  }
  let f = 1;
  for (let i = 0; i < waiting_invitaion.length; i++) {
    if (waiting_invitaion[i].receiver_uid === receiver_uid) {
      f = 0;
    }
  }
  if (f) {
    waiting_invitaion.push({
      receiver_uid,
      avalabilty_slots: avalabilty_array,
      description,
      duration,
    });
  } else {
    res.status(201).json({ data: sender_user });
    return;
  }
  f = 1;
  for (let i = 0; i < pending_invitaion.length; i++) {
    if (pending_invitaion[i].sender_uid === sender_uid) {
      f = 0;
    }
  }
  if (f) {
    pending_invitaion.push({
      sender_uid,
      avalabilty_slots: avalabilty_array,
      description,
      duration,
    });
  } else {
    res.status(201).json({ data: sender_user });
    return;
  }

  try {
    const res2 = await senderRef.update({
      waiting_invitaion: waiting_invitaion,
    });
    const res3 = await receiverRef.update({
      pending_invitaion: pending_invitaion,
    });
    const doc3 = await senderRef.get();
    // sendEmail(receiver_user.email, sender_user.fullName);
    res.status(201).json({ data: doc3.data() });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
exports.acceptInvitationwithSchedule = async (req, res) => {
  // console.log(req.body);
  var t = new Date(req.body.date);
  const str = req.body.bookedSlot;
  const str1 = str.substring(0, str.length - 3);
  const str2 = str.substring(str.length - 2, str.length);
  let [hours, minutes] = str1.split(":");
  hours = Number(hours);
  if (str2 === "am") {
    if (hours === 12) hours = "00";
  } else {
    if (hours >= 1 && hours !== 12) hours += 12;
  }
  hours = String(hours);
  var AppointmentDate = new Date(
    t.getFullYear(),
    t.getMonth(),
    t.getDate(),
    hours,
    minutes,
    0,
    0
  );
  console.log(AppointmentDate);
  const { sender_uid, receiver_uid } = req.body;
  if (!sender_uid || !receiver_uid) {
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
  const senderRef = db.collection("users").doc(sender_uid);
  const doc = await senderRef.get();
  const sender_user = doc.data();
  const receiverRef = db.collection("users").doc(receiver_uid);
  const doc1 = await receiverRef.get();
  const receiver_user = doc1.data();

  let waiting_invitaion = [];
  let pending_invitaion = [];
  let accepted_invitation_sender = [];
  let accepted_invitation_receiver = [];
  if ("accepted_invitaion" in sender_user) {
    accepted_invitation_sender = [...sender_user?.accepted_invitaion];
  }
  if ("accepted_invitaion" in receiver_user) {
    accepted_invitation_receiver = [...receiver_user?.accepted_invitaion];
  }
  for (let i = 0; i < sender_user?.waiting_invitaion.length; i++) {
    if (sender_user?.waiting_invitaion[i].receiver_uid !== receiver_uid) {
      waiting_invitaion.push(sender_user?.waiting_invitaion[i]);
    }
  }
  for (let i = 0; i < receiver_user?.pending_invitaion.length; i++) {
    if (receiver_user?.pending_invitaion[i].sender_uid != sender_uid) {
      pending_invitaion.push(receiver_user?.pending_invitaion[i]);
    }
  }

  // if (!accepted_invitation_sender.includes(receiver_uid)) {
  //   accepted_invitation_sender.push(receiver_uid);
  // }
  // if (!accepted_invitation_receiver.includes(sender_uid)) {
  //   accepted_invitation_receiver.push(sender_uid);
  // }

  let f = 1;
  for (let i = 0; i < accepted_invitation_sender.length; i++) {
    if (accepted_invitation_sender[i].receiver_uid === receiver_uid) {
      f = 0;
    }
  }
  if (f) {
    accepted_invitation_sender.push({
      receiver_uid,
      meeting_time: AppointmentDate,
      description: req.body.description,
      duration: req.body.duration,
      is_accepted: false,
    });
  } else {
    res.status(201).json({ data: receiver_user });
    return;
  }
  f = 1;
  for (let i = 0; i < accepted_invitation_receiver.length; i++) {
    if (accepted_invitation_receiver[i].sender_uid === sender_uid) {
      f = 0;
    }
  }
  if (f) {
    accepted_invitation_receiver.push({
      sender_uid,
      meeting_time: AppointmentDate,
      description: req.body.description,
      duration: req.body.duration,
      is_accepted: true,
    });
  } else {
    res.status(201).json({ data: receiver_user });
    return;
  }

  try {
    const res2 = await senderRef.update({
      accepted_invitaion: accepted_invitation_sender,
      waiting_invitaion: waiting_invitaion,
    });
    const res3 = await receiverRef.update({
      accepted_invitaion: accepted_invitation_receiver,
      pending_invitaion: pending_invitaion,
    });
    const doc3 = await receiverRef.get();
    res.status(201).json({ data: doc3.data() });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
exports.acceptInvitation = async (req, res) => {
  const { sender_uid, receiver_uid } = req.body;
  if (!sender_uid || !receiver_uid) {
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
  const senderRef = db.collection("users").doc(sender_uid);
  const doc = await senderRef.get();
  const sender_user = doc.data();
  const receiverRef = db.collection("users").doc(receiver_uid);
  const doc1 = await receiverRef.get();
  const receiver_user = doc1.data();

  let waiting_invitaion = [];
  let pending_invitaion = [];
  let accepted_invitation_sender = [];
  let accepted_invitation_receiver = [];
  if ("accepted_invitaion" in sender_user) {
    accepted_invitation_sender = [...sender_user?.accepted_invitaion];
  }
  if ("accepted_invitaion" in receiver_user) {
    accepted_invitation_receiver = [...receiver_user?.accepted_invitaion];
  }
  for (let i = 0; i < sender_user?.waiting_invitaion.length; i++) {
    if (sender_user?.waiting_invitaion[i].receiver_uid !== receiver_uid) {
      waiting_invitaion.push(sender_user?.waiting_invitaion[i]);
    }
  }
  for (let i = 0; i < receiver_user?.pending_invitaion.length; i++) {
    if (receiver_user?.pending_invitaion[i].sender_uid != sender_uid) {
      pending_invitaion.push(receiver_user?.pending_invitaion[i]);
    }
  }

  let f = 1;
  for (let i = 0; i < accepted_invitation_sender.length; i++) {
    if (accepted_invitation_sender[i].receiver_uid === receiver_uid) {
      f = 0;
    }
  }
  if (f) {
    accepted_invitation_sender.push({
      receiver_uid,
      description: req.body.description,
      duration: 0,
      is_accepted: false,
    });
  } else {
    res.status(201).json({ data: receiver_user });
    return;
  }
  f = 1;
  for (let i = 0; i < accepted_invitation_receiver.length; i++) {
    if (accepted_invitation_receiver[i].sender_uid === sender_uid) {
      f = 0;
    }
  }
  if (f) {
    accepted_invitation_receiver.push({
      sender_uid,
      description: req.body.description,
      duration: 0,
      is_accepted: true,
    });
  } else {
    res.status(201).json({ data: receiver_user });
    return;
  }

  try {
    const res2 = await senderRef.update({
      accepted_invitaion: accepted_invitation_sender,
      waiting_invitaion: waiting_invitaion,
    });
    const res3 = await receiverRef.update({
      accepted_invitaion: accepted_invitation_receiver,
      pending_invitaion: pending_invitaion,
    });
    const doc3 = await receiverRef.get();
    res.status(201).json({ data: doc3.data() });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
exports.declineInvitation = async (req, res) => {
  const { sender_uid, receiver_uid } = req.body;
  if (!sender_uid || !receiver_uid) {
    res.status(500).json({ message: "Something went wrong" });
    return;
  }
  const senderRef = db.collection("users").doc(sender_uid);
  const doc = await senderRef.get();
  const sender_user = doc.data();
  const receiverRef = db.collection("users").doc(receiver_uid);
  const doc1 = await receiverRef.get();
  const receiver_user = doc1.data();

  let waiting_invitaion = [];
  let pending_invitaion = [];
  for (let i = 0; i < sender_user?.waiting_invitaion.length; i++) {
    if (sender_user?.waiting_invitaion[i].receiver_uid !== receiver_uid) {
      waiting_invitaion.push(sender_user?.waiting_invitaion[i]);
    }
  }
  for (let i = 0; i < receiver_user?.pending_invitaion.length; i++) {
    if (receiver_user?.pending_invitaion[i].sender_uid != sender_uid) {
      pending_invitaion.push(receiver_user?.pending_invitaion[i]);
    }
  }
  try {
    const res2 = await senderRef.update({
      waiting_invitaion: waiting_invitaion,
    });
    const res3 = await receiverRef.update({
      pending_invitaion: pending_invitaion,
    });
    const doc3 = await receiverRef.get();
    res.status(201).json({ data: doc3.data() });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
