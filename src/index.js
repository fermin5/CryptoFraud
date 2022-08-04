const express = require ("express")
const bodyParser = require('body-parser');
const path = require('path');

//Init
const app = express();

//Settings
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set('view-engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//Server init
const server = app.listen(app.get("port"), () => {
  console.log("Port: ", app.get("port"));
  console.log('Node version: ' + process.version);

});


app.use(require("./routes/index.js"));
