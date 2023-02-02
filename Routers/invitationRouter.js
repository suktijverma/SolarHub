const router = require("express").Router();
const Invitation = require("./../Controller/invitationController");

router.post("/sendInvitation", Invitation.sendInvitation);
router.post("/accpetInvitation", Invitation.acceptInvitation);
router.post(
  "/acceptInvitationwithSchedule",
  Invitation.acceptInvitationwithSchedule
);
router.post("/declineInvitation", Invitation.declineInvitation);
module.exports = router;
