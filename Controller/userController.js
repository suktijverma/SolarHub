const axios = require("axios");

exports.signup = async (req, res) => {
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.password ||
    !req.body.username
  ) {
    res.status(400).json({ message: "Bad Request" });
  }
  var data = JSON.stringify({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    username: req.body.username,
    active: true,
    approved: true,
    "user_fields[1]": "sed dolor",
  });
  var config = {
    method: "post",
    url: `${process.env.DISCOURSE_URL}/users.json`,
    headers: {
      "Api-Key": process.env.DISCOURSE_API_KEY,
      "Api-Username": process.env.DISCOURSE_ADMIN_USERNAME,
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
    // res.status(201).json({ data: "Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
