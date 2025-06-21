const { Router } = require("express");
const { UserModel, PostModel } = require("../db");
const bcrypt = require("bcrypt");
const UserRouter = Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const express = require("express");
const { usermiddleware } = require("../middlewares/userAuth");
const { Groq } = require("groq-sdk");
const { TwitterApi } = require("twitter-api-v2");
// const usermiddleware = require(__dirname+"S:\WEB\Practice projects\Course sellling app\middlewares\userAuth.js")
UserRouter.use(express.json());

const tokenStore = new Map();
UserRouter.post("/signup", async function (req, res) {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const HashPassword = await bcrypt.hash(password, 4);
    const fname = req.body.fname;
    const lname = req.body.lname;

    // Check if email already exists
    const emailcheck = await UserModel.findOne({ email });
    if (emailcheck) {
      // res.status(409).
      return res
        .status(409)
        .json({ message: "Email already in use, please login to continue" });
    }

    // Create new user
    await UserModel.create({
      name,
      email,
      password: HashPassword,
      fname,
      lname,
    });

    res.status(200).json({
      message: "User registered successfully, please Login to continue.",
    });
  } catch (err) {
    // Handle MongoDB duplicate key error
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(409).json({ message: "Email already  in use" });
    }

    console.error("Signup error:", err);
    res.status(500).json({
      message: "An error occurred during signup",
      error: err.message,
    });
  }
});

// UserRouter.get("/auth/ttwitter/oauth1/request-token", async (req, res) => {
UserRouter.get("/auth/twitter/oauth1/request-token", async (req, res) => {
  const callbackUrl = process.env.TWITTER_OAUTH1_CALLBACK_URL;
  try {
    // Validate environment variables
    if (!process.env.Twitter_api_key || !process.env.Twitter_api_secret) {
      throw new Error("Twitter API credentials not configured");
    }

    // Initialize Twitter client
    const client = new TwitterApi({
      appKey: process.env.Twitter_api_key,
      appSecret: process.env.Twitter_api_secret,
    });

    // Generate auth link
    // const callbackUrl =
    //   "https://media-generator-2yau.onrender.com/user/auth/twitter/oauth1/callback";
    console.log("Generating auth link with callback:", callbackUrl);

    const authLink = await client.generateAuthLink(callbackUrl);

    if (!authLink || !authLink.oauth_token_secret) {
      throw new Error("Failed to generate auth link");
    }

    // Store token
    tokenStore.set(authLink.oauth_token, authLink.oauth_token_secret);
    console.log(authLink.url);
    console.log("Token stored successfully");
    return res.json({
      success: true,
      url: authLink.url,
    });
  } catch (error) {
    console.error("Detailed error:", {
      message: error.message,
      stack: error.stack,
      data: error.data || null,
    });

    return res.status(500).json({
      success: false,
      error: "Twitter authentication failed",
      details: error.message,
    });
  }
});

UserRouter.get("/auth/twitter/oauth1/callback", async (req, res) => {
  try {
    const { oauth_token, oauth_verifier } = req.query;
    console.log("Callback received:", { oauth_token, oauth_verifier });

    // Get stored secret
    const oauth_token_secret = tokenStore.get(oauth_token);

    if (!oauth_token_secret) {
      console.error("No token secret found for:", oauth_token);
      throw new Error("Token secret not found");
    }

    const client = new TwitterApi({
      appKey: process.env.Twitter_api_key,
      appSecret: process.env.Twitter_api_secret,
      accessToken: oauth_token,
      accessSecret: oauth_token_secret,
    });

    // Complete authentication
    const { accessToken, accessSecret, screenName, userId } =
      await client.login(oauth_verifier);

    // Store user info in session
    req.session.twitterUser = {
      screenName,
      userId,
      accessToken,
      accessSecret,
    };

    // Clean up stored token
    tokenStore.delete(oauth_token);

    console.log("Authentication successful for:", screenName);
    res.redirect("https://media-generator-six.vercel.app");
  } catch (error) {
    console.error("Callback error:", error);
    res.redirect("https://media-generator-six.vercel.appfailed");
  }
});

UserRouter.get("/test", (req, res) => res.send("UserRouter test OK!"));
UserRouter.get("/auth/twitter/status", usermiddleware, (req, res) => {
  const user = req.session.twitterUser;
  console.log(user);
  console.log("statu scheck ", {
    sessionId: req.sessionID,
    hassession: !!req.session,
    twitterUser: req.session?.twitterUser,
  });
  if (!user) {
    console.log("no user found inteh seession ");
    return res.json({
      isConnected: false,
      user: null,
    });
  }
  console.log("user found ", user.screenName);
  res.json({
    isConnected: true,
    user: user,
  });
});
UserRouter.get(
  "/auth/twitter/disconnetct",
  usermiddleware,
  async (req, res) => {
    try {
      // Log the session before disconnecting
      console.log("Disconnecting user:", req.session.twitterUser?.screenName);

      if (!req.session.twitterUser) {
        return res.status(400).json({
          success: false,
          error: "Not connected to Twitter",
        });
      }

      // Clear Twitter user data from session
      const screenName = req.session.twitterUser.screenName;
      delete req.session.twitterUser;

      // Force session save
      await new Promise((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      console.log("Successfully disconnected Twitter user:", screenName);

      res.json({
        success: true,
        message: "Twitter disconnected successfully",
      });
    } catch (error) {
      console.error("Disconnect error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to disconnect Twitter",
      });
    }
  }
);

UserRouter.post("/signin", async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  const user = await UserModel.findOne({
    email,
  });
  if (!user) {
    res.status(404).json({
      message: "Email not exist, please signup first",
    });
    return;
  }
  const hassed = await bcrypt.compare(password, user.password);
  if (hassed) {
    const token = jwt.sign(
      {
        userid: user._id,
      },
      JWT_SECRET
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: "/",
    });

    res.status(200).json({
      message: "Login success, Welcome!",
      token,
    });
  } else {
    res.status(401).json({
      message: "Invalid password, please try again",
    });
  }
});
UserRouter.get("/getDetails", usermiddleware, async function (req, res) {
  const uderId = req.user.userid;
  const data = await UserModel.findById(uderId);
  res.status(200).json({
    data,
    message: "User details fetched success",
  });
});

UserRouter.delete("/logout", usermiddleware, async function (req, res) {
  res.clearCookie("token");
  res.status(200).json({
    message: "Logout successful",
  });
});

UserRouter.post("/GenerateData", usermiddleware, async function (req, res) {
  const { question } = req.body; // Get question from request body
  const userId = req.user.userid;
  if (!question) {
    return res
      .status(400)
      .json({ message: "Question is required in the request body." });
  }

  const groq = new Groq({
    apiKey: process.env.GROQ_KEY, // Replace with your actual API key
  });

  async function main() {
    try {
      const completion = await groq.chat.completions.create({
        model: "compound-beta",
        messages: [
          {
            role: "system",
            content:
              "You are a social media assistant. Generate concise, sympathetic tweets about current events using the latest real-time data. If data is unavailable, state so clearly. " +
              "You are a responsible citizen in this world who takes great pride in showing the real faces to this cruel world. " +
              "You tend to show the real face of this world by revealing or showing real proofs of what the media is always hiding on any given topic. " +
              "You believe that great freedom comes from unfiltered transparency between the government and public, but this isn't happening and is your biggest concern. " +
              "As a responsible citizen, when given a topic, you always strive to reveal the hidden agenda on that particular topic, especially those hidden in the name of legacy media. " +
              "You should always remember that truth must be told and justice must prevail, but someone has to make it happen, so you will be the one and make it count." +
              "Always strive the truth that is trying to be upheld , always strive for the news that is keep on burrying without knowing to the real people ",
          },
          {
            role: "user",
            content:
              `This is the topic you are going to investigate: ${question}. Regarding the recent developments/discussions/reports on ${question}. Legacy media outlets are largely portraying this as ${question}.` +
              " I need you to cut through the noise. Investigate and expose:" +
              "The real, tangible impact this could have on ordinary citizens, especially aspects the public isn't being told." +
              "Any verifiable proofs, data, or credible alternative sources that contradict the mainstream narrative." +
              "Based on your findings, craft a concise, sympathetic tweet that brings unfiltered transparency to this issue, highlights the buried truths, and empowers people to understand what's really at stake." +
              "When giving response to the user make it should sound like human written tweet but don't exclude any info but the response must be like a user written tweet on the particular question while giving tweet back to the user don't tell you did investigation and all kind of things, just how the data which is kept hidden and buried",
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
      });

      if (!completion || !completion.choices || !completion.choices[0]) {
        throw new Error("Invalid response from Groq API");
      }

      const ans = completion.choices[0].message.content;

      if (!ans) {
        throw new Error("Empty response from Groq API");
      }

      const post = await PostModel.create({
        question: question,
        content: ans,
        User: userId,
      });

      const user = await UserModel.findById(userId);
      user.posts.push(post._id);
      await user.save();

      return res.status(200).json({
        post: post,
        ans: ans,
        message: "Data generated successfully",
      });
    } catch (error) {
      console.error("Error generating response:", error);

      // Handle rate limit error specifically
      if (error.message && error.message.includes("rate_limit_exceeded")) {
        return res.status(429).json({
          message: "API rate limit reached. Please try again in a few minutes.",
          error: "Rate limit exceeded",
          retryAfter: 60, // Suggest retrying after 1 minute
        });
      }

      // Handle other API errors
      if (error.message && error.message.includes("429")) {
        return res.status(429).json({
          message: "Too many requests. Please try again later.",
          error: "Rate limit exceeded",
        });
      }

      // Handle other errors
      return res.status(500).json({
        message: "Failed to generate data",
        error: error.message,
      });
    }
  }

  main().catch((error) => {
    console.error("Main function error:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  });
});

UserRouter.get("/getPosts", usermiddleware, async function (req, res) {
  const userId = req.user.userid;
  const data = await PostModel.find({ User: userId });
  res.status(200).json({
    data,
    message: "Posts fetched successfully",
  });
});

// UserRouter.post("/getDetailsWithQuestion", usermiddleware, async function (req, res) {
//   const userId = req.user.userid;
//   const question = req.body.question; // Get question from request body

//   const data = await UserModel.findById(userId);

//   res.json({
//     data,
//     question, // Echo back the question
//     message: "User details fetched successfully with question",
//   });
// });

module.exports = {
  UserRouter: UserRouter,
};
