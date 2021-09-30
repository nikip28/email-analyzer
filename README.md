# Email Analyzer

## Run Server

1. Browse to server folder.

2. Under this folder create credentials.json file having configuration from google clound project. Add "http://localhost:3000" in redirect_uris array.

3. Run below commands to install dependencies and start the server:

```bash
$ npm install
$ npm start
```

Local server will run on http://localhost:5000

### Notes:

1. delete token.json file if you want to login with other google account.
2. It will analyse lastest 10 emails. you can change the count before running the server.

## Run Client

1. Browse to client folder.

2. Run below commands to install dependencies and start the client app:

```bash
$ npm install
$ npm start
```

Local server will run on http://localhost:3000
