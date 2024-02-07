require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb')
const url = require('url')
const dns = require('dns')
let Url;
// functions
// test valid url
const testValidURL = (url) => {
  const regex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)
  return regex.test(url)
}
// create&save url
const createAndSaveUrl = (url,number) => {

  // what happens to my url argument?
  let u = new Url({
    original_url:url,
    short_url: number
  })
  newUrl.save(newUrl)
}
//connect mongodb
const client = new MongoClient  (process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true})
const db = client.db("urlshort")
const urls = db.collection("urls")
// Basic Configuration
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.urlencoded({extended:true}))
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {

  let u = req.body.url;
  console.log(u)
  const dnslook = dns.lookup(url.parse(u).hostname,
  async (err,addy) => {
    if(!addy){
      res.json({ error: 'invalid url' })
    }
    else{
      // I accidentally names "original_url" property as "u"
      // db.collection.updateMany() really saved time from having to change properties manually in Atlas.
      let updateMany = await urls.updateMany({},{ $rename: {'u':'original_url'}})
      let count = await urls.countDocuments({})
      let originalU = {
      original_url:u,
      short_url:count
    }
    //output values into table
    const output = await urls.insertOne(originalU)
    console.log(output)
    res.json({original_url:u, short_url:count})
    }
    
  })

});

app.get('/api/shorturl/:shorturl', async function(req,res){
  let shawty = req.params.shorturl
  console.log(shawty)
  // find original url by short(num)
  const origin = await urls.findOne({short_url:+shawty})
  res.redirect(origin.original_url)
})
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
