var cron = require("node-cron");
const axios = require("axios");

const getPost = async (id) => {
  try {
    const response1 = await axios.get(
      `${process.env.DISCOURSE_URL}/t/${id}/posts.json`,
      {
        headers: {
          "Api-Key": process.env.DISCOURSE_API_KEY,
          "Api-Username": process.env.DISCOURSE_ADMIN_USERNAME,
        },
      }
    );
    return response1.data.post_stream.posts;
  } catch (error) {
    console.log(error);
  }
};
const getUserData = async (user_name) => {
  try {
    const response1 = await axios.get(
      `${process.env.DISCOURSE_URL}/u/${user_name}.json`,
      {
        headers: {
          "Api-Key": process.env.DISCOURSE_API_KEY,
          "Api-Username": process.env.DISCOURSE_ADMIN_USERNAME,
        },
      }
    );
    return response1.data.user;
  } catch (error) {
    console.log(error);
  }
};
const TopicCron = async () => {
  // cron.schedule("*/1 * * * *", () => {
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
    temp.category_slug = response1.data.category_list.categories[i].slug;
    data.push(temp);
  }
  const user_data = new Map();
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < 1000; j++) {
      const response2 = await axios.get(
        `${process.env.DISCOURSE_URL}/c/${data[i].category_slug}/${data[i].category_id}.json?page=${j}`,
        {
          headers: {
            "Api-Key": process.env.DISCOURSE_API_KEY,
            "Api-Username": process.env.DISCOURSE_ADMIN_USERNAME,
          },
        }
      );
      if (response2.data.topic_list.topics.length === 0) {
        break;
      }
      for (let k = 0; k < response2.data.topic_list.topics.length; k++) {
        const res = await getPost(response2.data.topic_list.topics[k].id);
        for (let l = 0; l < res.length; l++) {
          const res1 = await getUserData(res[l].username);
          if (user_data.has(res[l].user_id)) {
            user_data.set(res[l].user_id, {
              count: user_data.get(res[l].user_id).count + 1,
              user_id: res1.id,
              username: res1.username,
              name: res1.name,
              avatar_template: `${process.env.DISCOURSE_URL}${res1.avatar_template}`,
            });
          } else {
            user_data.set(res[l].user_id, {
              count: 1,
              user_id: res1.id,
              username: res1.username,
              name: res1.name,
              avatar_template: `${process.env.DISCOURSE_URL}${res1.avatar_template}`,
            });
          }
        }
      }
    }
  }
  let user_data_list = [];
  const obj = Object.fromEntries(user_data);
  for (const item of Object.entries(obj)) {
    user_data_list.push(item[1]);
  }
  // });
};
module.exports = TopicCron;
