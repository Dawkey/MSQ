let express = require("express");

let app = express();

app.use("/public",express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/MSQ.html");
});

app.listen("8000",function(){
    console.log("服务启动！8000");
});