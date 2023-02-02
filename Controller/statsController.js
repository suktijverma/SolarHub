const axios = require("axios");
const db = require("./../firebase");
exports.getLatestStats = async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.DISCOURSE_URL}/admin/users/list/active.json`,
      {
        headers: {
          "Api-Key": process.env.DISCOURSE_API_KEY,
          "Api-Username": process.env.DISCOURSE_ADMIN_USERNAME,
        },
      }
    );
    const noUsers = response.data.length;
    const response1 = await axios.get(
      `${process.env.DISCOURSE_URL}/categories.json`
      // {
      //   headers: {
      //     "Api-Key": process.env.DISCOURSE_API_KEY,
      //     "Api-Username": process.env.DISCOURSE_ADMIN_USERNAME,
      //   },
      // }
    );
    let topics = 0;
    let post = 0;
    for (let i = 0; i < response1.data.category_list.categories.length; i++) {
      topics += response1.data.category_list.categories[i].topic_count;
      post += response1.data.category_list.categories[i].post_count;
    }
    res
      .status(201)
      .json({ total_users: noUsers, total_topics: topics, total_posts: post });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.getTopContributors = async (req, res) => {
  try {
    let data = [];
    for (let i = 0; i < 1000; i++) {
      const response = await axios.get(
        `${process.env.DISCOURSE_URL}/directory_items.json?period=all&page=${i}`
        // {
        //   headers: {
        //     "Api-Key": process.env.DISCOURSE_API_KEY,
        //     "Api-Username": process.env.DISCOURSE_ADMIN_USERNAME,
        //   },
        // }
      );
      if (response.data.directory_items.length === 0) {
        break;
      } else {
        for (let j = 0; j < response.data.directory_items.length; j++) {
          let temp = {};
          temp.count =
            response.data.directory_items[j].topic_count +
            response.data.directory_items[j].post_count;
          temp.user_id = response.data.directory_items[j].id;
          temp.username = response.data.directory_items[j].user.username;
          temp.name = response.data.directory_items[j].user.name;
          temp.avatar_template = `${process.env.DISCOURSE_URL}${response.data.directory_items[j].user.avatar_template}`;
          data.push(temp);
        }
      }
    }

    data.sort(function (a, b) {
      return b.count - a.count;
    });
    res.status(201).json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
