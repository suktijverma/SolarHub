const router = require("express").Router();
const postController = require("./../Controller/postController");
// register
router.get("/latestTopics", postController.getLatestTopics);
router.get("/allPostforTopics", postController.getLatestPost);
router.post("/createTopic", postController.createTopic);
router.post("/createPostforTopic", postController.createPost);

module.exports = router;
