const axios = require("axios");
exports.getAllCategories = async (req, res) => {
  try {
    const response1 = await axios.get(
      `${process.env.DISCOURSE_URL}/categories.json`,
      {
        headers: {
          "Api-Key": process.env.DISCOURSE_API_KEY,
          "Api-Username": process.env.DISCOURSE_ADMIN_USERNAME,
        },
      }
    );
    let data = [];
    for (let i = 0; i < response1.data.category_list.categories.length; i++) {
      let temp = {};
      temp.category_id = response1.data.category_list.categories[i].id;
      temp.category_name = response1.data.category_list.categories[i].name;
      temp.category_slug = response1.data.category_list.categories[i].slug;
      data.push(temp);
    }
    res.status(201).json({ Categories: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
exports.getAllCategoriesData = async (req, res) => {
  try {
    const response1 = await axios.get(
      `${process.env.DISCOURSE_URL}/categories.json`,
      {
        headers: {
          "Api-Key": process.env.DISCOURSE_API_KEY,
          "Api-Username": process.env.DISCOURSE_ADMIN_USERNAME,
        },
      }
    );
    let data = [];
    for (let i = 0; i < response1.data.category_list.categories.length; i++) {
      let temp = {};
      temp.category_id = response1.data.category_list.categories[i].id;
      temp.category_name = response1.data.category_list.categories[i].name;
      temp.category_slug = response1.data.category_list.categories[i].slug;
      temp.topic_count = response1.data.category_list.categories[i].topic_count;
      temp.post_count = response1.data.category_list.categories[i].post_count;
      temp.description = response1.data.category_list.categories[i].description;
      data.push(temp);
    }
    for (let i = 0; i < data.length; i++) {
      const response2 = await axios.get(
        `${process.env.DISCOURSE_URL}/c/${data[i].category_slug}/${data[i].category_id}.json`,
        {
          headers: {
            "Api-Key": process.env.DISCOURSE_API_KEY,
            "Api-Username": process.env.DISCOURSE_ADMIN_USERNAME,
          },
        }
      );
      let temp1 = [];
      let temp3 = [];
      for (
        let i = 0;
        i < Math.min(3, response2.data.topic_list.topics.length);
        i++
      ) {
        let temp4 = {};
        temp4.id = response2.data.topic_list.topics[i].id;
        temp4.title = response2.data.topic_list.topics[i].title;
        temp4.created_at = response2.data.topic_list.topics[i].created_at;
        temp3.push(temp4);
      }
      for (let j = 0; j < response2.data.users.length; j++) {
        let temp2 = {};
        temp2.user_id = response2.data.users[j].id;
        temp2.username = response2.data.users[j].username;
        temp2.name = response2.data.users[j].name;
        temp2.avatar_template = `${process.env.DISCOURSE_URL}${response2.data.users[j].avatar_template}`;
        temp1.push(temp2);
      }
      data[i].users = temp1;
      data[i].latest_topics = temp3;
    }
    res.status(201).json({ Categories: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
