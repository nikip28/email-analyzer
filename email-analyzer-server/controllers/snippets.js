const fs = require("fs");
const { google } = require("googleapis");
const { Base64 } = require("js-base64");

const getRepetedSnippets = require("../utils");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";

function getSnippets(req, res) {
  // Load client secrets from a local file.
  fs.readFile("credentials.json", (err, content) => {
    if (err) return res.status(500).send();

    const credentials = JSON.parse(content);
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    if (req.query.code) {
      oAuth2Client.getToken(req.query.code, async (err, token) => {
        if (err) return res.status(500).send();
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log("Token stored to", TOKEN_PATH);
        });
        try {
          const data = await listMessages(oAuth2Client, "");
          res.send({ snippets: data });
        } catch (error) {
          console.log("errr", error);
          res.status(500).send();
        }
      });
    } else {
      // Authorize a client with credentials, then call the Gmail API.
      authorize(oAuth2Client, res);
    }
  });
}

/**
 * Create an OAuth2 client with the given credentials.
 * @param {Object} credentials The authorization client credentials.
 */
function authorize(oAuth2Client, res) {
  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, async (err, token) => {
    if (err) return getNewToken(oAuth2Client, res);
    oAuth2Client.setCredentials(JSON.parse(token));
    try {
      const data = await listMessages(oAuth2Client, "");
      res.send({ snippets: data });
    } catch (error) {
      console.log("errr", error);
      res.status(500).send();
    }
  });
}

/**
 * Get and store new token after prompting for user authorization
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
function getNewToken(oAuth2Client, res) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  res.send({ authUrl });
}

function listMessages(auth, query) {
  return new Promise((resolve, reject) => {
    const gmail = google.gmail({ version: "v1", auth });
    gmail.users.messages.list(
      {
        userId: "me",
        q: query,
        maxResults: 5,
      },
      async (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        if (!res.data.messages) {
          resolve([]);
          return;
        }
        try {
          const promises = [];
          const gmail = google.gmail({ version: "v1", auth });

          res.data.messages.forEach((element) => {
            promises.push(getMail(element.id, gmail));
          });

          const values = await Promise.all([...promises]);
          const data = getRepetedSnippets(values);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}

function getMail(msgId, gmail) {
  return new Promise((resolve, reject) => {
    console.log(msgId);
    //This api call will fetch the mailbody.
    gmail.users.messages.get(
      {
        userId: "me",
        id: msgId,
      },
      (err, res) => {
        if (err) {
          reject(err);
          return;
        }
        console.log("no error");
        console.log(res.data.labelIds.INBOX);
        var body = res.data.payload.parts[0].body.data;
        var htmlBody = Base64.decode(
          body.replace(/-/g, "+").replace(/_/g, "/")
        );
        resolve(htmlBody);
      }
    );
  });
}

module.exports = { getSnippets };
