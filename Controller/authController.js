const axios = require("axios");
const qs = require("query-string");

const urlToGetLinkedInAccessToken =
  "https://www.linkedin.com/oauth/v2/accessToken";
const urlToGetUserProfile =
  "https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams))";
const urlToGetUserEmail =
  "https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))";

exports.getLinkedinAuth = async function (req, res) {
  let user = {};
  const code = req.query.code;
  const accessToken = await getAccessToken(code);
  const userProfile = await getUserProfile(accessToken);
  const userEmail = await getUserEmail(accessToken);
  let resStatus = 400;
  if (!(accessToken === null || userProfile === null || userEmail === null)) {
    user = userBuilder(userProfile, userEmail);
    console.log(user);
    resStatus = 200;
  }
  console.log(user);
  res.status(resStatus).json({ user });
};

/**
 * Get access token from LinkedIn
 * @param code returned from step 1
 * @returns accessToken if successful or null if request fails
 */
function getAccessToken(code) {
  let accessToken = null;
  const config = {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  };
  const parameters = {
    grant_type: "authorization_code",
    code: code,
    redirect_uri: process.env.REDIRECT_URI,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  };
  // console.log(parameters);
  return axios
    .post(urlToGetLinkedInAccessToken, qs.stringify(parameters), config)
    .then((response) => {
      // console.log(response.data);
      accessToken = response.data["access_token"];
      return accessToken;
    })
    .catch((err) => {
      console.log("Error getting LinkedIn access token");
    });
}

/**
 * Get user first and last name and profile image URL
 * @param accessToken returned from step 2
 */
function getUserProfile(accessToken) {
  let userProfile = {};
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  return axios
    .get(urlToGetUserProfile, config)
    .then((response) => {
      userProfile.firstName = response.data["localizedFirstName"];
      userProfile.lastName = response.data["localizedLastName"];
      userProfile.profileImageURL =
        response.data.profilePicture[
          "displayImage~"
        ].elements[0].identifiers[0].identifier;
      return userProfile;
    })
    .catch((error) => {
      console.log(error);
      console.log("Error grabbing user profile");
    });
}

/**
 * Get user email
 * @param accessToken returned from step 2
 */
function getUserEmail(accessToken) {
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  return axios
    .get(urlToGetUserEmail, config)
    .then((response) => {
      const email = response.data.elements[0]["handle~"];
      return email;
    })
    .catch((error) => console.log("Error getting user email"));
}

/**
 * Build User object
 */
function userBuilder(userProfile, userEmail) {
  return {
    firstName: userProfile.firstName,
    lastName: userProfile.lastName,
    profileImageURL: userProfile.profileImageURL,
    email: userEmail.emailAddress,
  };
}
