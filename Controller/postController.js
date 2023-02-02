const axios = require("axios");
exports.getLatestTopics = async (req, res) => {
  var config = {
    method: "get",
    url: `${process.env.DISCOURSE_URL}/latest.json`,
    headers: {
      "Api-Key": process.env.DISCOURSE_API_KEY,
      "Api-Username": process.env.DISCOURSE_ADMIN_USERNAME,
    },
  };
  try {
    axios(config)
      .then(function (response) {
        res.status(201).json({ data: response.data });
      })
      .catch(function (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error);
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
exports.getLatestPost = async (req, res) => {
  var config = {
    method: "get",
    url: `${process.env.DISCOURSE_URL}/t/${req.query.id}/posts.json`,
    headers: {
      "Api-Key": process.env.DISCOURSE_API_KEY,
      "Api-Username": process.env.DISCOURSE_ADMIN_USERNAME,
    },
  };
  try {
    axios(config)
      .then(function (response) {
        res.status(201).json({ data: response.data });
      })
      .catch(function (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error);
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
exports.createTopic = async (req, res) => {
  if (!req.body.raw || !req.body.title || !req.body.username) {
    res.status(400).json({ message: "Bad Request" });
  }
  var data = JSON.stringify({
    raw: req.body.raw,
    title: req.body.title,
  });
  var config = {
    method: "post",
    url: `${process.env.DISCOURSE_URL}/posts.json`,
    headers: {
      "Api-Key": process.env.DISCOURSE_API_KEY,
      "Api-Username": req.body.username,
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    axios(config)
      .then(function (response) {
        res.status(201).json({ data: response.data });
      })
      .catch(function (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error);
      });
    // res.status(201).json({ data: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
exports.createPost = async (req, res) => {
  if (!req.body.raw || !req.body.topic_id || !req.body.username) {
    res.status(400).json({ message: "Bad Request" });
  }
  var data = JSON.stringify({
    raw: req.body.raw,
    topic_id: req.body.topic_id,
  });
  var config = {
    method: "post",
    url: `${process.env.DISCOURSE_URL}/posts.json`,
    headers: {
      "Api-Key": process.env.DISCOURSE_API_KEY,
      "Api-Username": req.body.username,
      "Content-Type": "application/json",
    },
    data: data,
  };
  console.log(config);
  try {
    axios(config)
      .then(function (response) {
        res.status(201).json({ data: response.data });
      })
      .catch(function (error) {
        res.status(500).json({ message: "Something went wrong" });
        console.log(error);
      });
    // res.status(201).json({ data: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
