const express = require("express")
const requests = require("requests")
const bodyParser = require("body-parser")
const https = require("https")

const app = express();




app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function (req, res){
  res.sendFile(__dirname + "/signup.html")
})


app.post("/", function (req, res){
  const firstName= req.body.fName; //getting the fName data specified in the text input
  const lastName = req.body.lName;
  const email = req.body.email;
  console.log(firstName, lastName, email);

  var data = { //data object
    members:[
      {
        email_address: email,
        status: "subscribed",
        merge_fields: { //merge_fields has an object
          FNAME: firstName,
          LNAME: lastName }
      }]
  };
  const jsonData = JSON.stringify(data); //making the json a string
  const url = "https://us1.api.mailchimp.com/3.0/lists/5d94f71afa"
  const options = { //javascript object
    method: "POST", // posting data to their servers
    auth: "Zephireis:" //use enviroment variables for secuirty
  }
  const request = https.request(url, options, function(response){ // options takes a object-type
    if(response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html")
    }else {
      res.sendFile(__dirname + "/failure.html")
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  })
  request.write(jsonData)
  request.end();
});



app.post("/failure", function (req, res){
  res.redirect("/")
});




app.listen(process.env.PORT || 3000, function(){
  console.log("server is running on port 3000");
});

 //0c1b9f925e9119cd7353450ddb8524aa-us1
 //5d94f71afa
