const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const https = require('https');
const mailchimp = require("@mailchimp/mailchimp_marketing");
const app = express()

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: false
}));

app.get("/", function(req, res) {
  //res.send("Server is up and running at port 3000");
  res.sendFile(__dirname + "/signup.html");
})

// app.post("/", function(req, res) {
//
//   const firstName = req.body.firstName;
//   const lastName = req.body.lastName;
//   const email = req.body.email;
//
//   const data = {
//     members: [{
//       email_address: email,
//       status: "subscribed",
//       merge_fields: {
//         FNAME: firstName,
//         LNAME: lastName
//       }
//     }]
//   }
//
//   const jsonData = JSON.stringify(data);
//   const url = "https://us6.api.mailchimp.com/3.0/lists/b64b8fed0b";
//   const options = {
//     method: "POST",
//     auth: "joy1:3731063f275c010082444d6c6f6368ff-us6"
//   }
//
//   const request = https.request(url, options, function(response) {
//
//     if(response.statusCode === 200)
//     {
//       // res.send("Success");
//       res.sendFile(__dirname + "/success.html");
//     }
//     else
//     {
//       //res.send("There is a problem signing up, please try again!");
//       res.sendFile(__dirname + "/failure.html");
//     }
//
//     response.on("data", function(data) {
//       // console.log(JSON.parse(data));
//     });
//   });
//
//   request.write(jsonData);
//   request.end();
// });

app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  mailchimp.setConfig({
    apiKey: "3731063f275c010082444d6c6f6368ff-us6",
    server: "us6",
  });

  const run = async () => {
    const response = await mailchimp.lists.batchListMembers("b64b8fed0b", {
      members: [{
        email_address: email,
             status: "subscribed",
             merge_fields: {
               FNAME: firstName,
               LNAME: lastName
             }
      }],
    });
    if(response.errors.length === 0)
    {
            // res.send("Success");
            res.sendFile(__dirname + "/success.html");
            console.log("Total Erros in success " +response.errors.length);
    }
    else
    {
      res.sendFile(__dirname + "/failure.html");
      console.log("Total Erros in failure " +response.errors.length);
    }

  };

  run();
})

app.post("/faliure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(req, res) {
  console.log("Listening to port 3000");
});




//API Key
//3731063f275c010082444d6c6f6368ff-us6

//Audience ID
// b64b8fed0b
