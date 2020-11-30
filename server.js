const express = require("express");
const app = express();

const axios = require('axios');
const FormData = require('form-data');
const formidable = require('formidable');
const fs = require('fs');

app.use(express.static("public"));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post("/beam", (request, response) => {
  new Promise( (resolve, reject) => {
    let data = new FormData();
    let config = {
      method: 'post',
      url: 'https://api.einstein.ai/v2/vision/ocr',
      headers: { 
        'Authorization': 'Bearer KBJVKUJXGNGTORSGLA3ESQJTGVAUSVKPKZHTGNSUKBJFSV2NIZCVGVCOGVIUWQ2LIFBEIVCGLFETIS2FK5KTONSGINDFURCJGRDVITJSIJIE6WC2INGEQRSEIJEFKMS2IVGEIRKGKVMFOQSEIY3ECQKZK5HFQRK2LJLES7COIE', 
        ...data.getHeaders()
      },
      data : data
    };
    
    let form = new formidable.IncomingForm()

    form.parse(request, function(err, fields, files) {
      if (err) {
        return response.status(400).json({ error: err.message });
      }

      let imageBase64 = fields.image.split(',')[1];
      //console.log(imageBase64);
      
      //Salesforce OCR
      let getEinsteinOCR = new Promise( (resolveEinstein, rejectEinstein) => {
        //data.append('sampleLocation', 'image.jpg');
        data.append('sampleBase64Content',imageBase64);
        data.append('modelId', 'OCRModel');

        axios(config)
        .then(response => {
          console.log(response.data);
          resolveEinstein(response.data);
        })
        .catch(error => {
          console.log(error);
        });
      }).then(data =>{
        response.json(data);
        resolve();
      });
    }); 
  });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});



//getGoogleOCR();
//googleVisionCall();
//Google OCR
//function getGoogleOCR(){
//fs.writeFile('image.jpg', imageBase64, {encoding: 'base64'}, function(err) {
    //console.log('File created');
//});  
//}

/*async function googleVisionCall() {
  // Imports the Google Cloud client library
  const vision = require('@google-cloud/vision');
  const projectId = 'beam-290317';
  const keyFilename = 'beam-auth.json';
  
  // Creates a client
  //const client = new vision.ImageAnnotatorClient(GetProcessEnv());
  const client = new vision.ImageAnnotatorClient({projectId, GetProcessEnv});

  // Performs label detection on the image file
  const image = "image.jpg";//'https://global-uploads.webflow.com/5ace2bae31f6d3c07d267cb9/5b11c973541a84bb5d131cd2_Jim-Beam-Black-Extra-Aged-01a.jpg';
  
  const [result] = await client.labelDetection(image);
  const labels = result.labelAnnotations;
  console.log('Labels:');
  labels.forEach(label => console.log(label.description));
 
  console.log("")

  const [result2] = await client.textDetection(image);
  const detections = result2.textAnnotations;
  console.log('Text:');
  console.log(detections[0].description)
  //detections.forEach(text => console.log(text));
  //process.exit(1);
}

function GetProcessEnv(){
  let googleVisionConfig = {
      "type": "service_account",
      "project_id": "beam-290317",
      "private_key_id": "19364ce49ae5b3e0e1a44a007c7b53a5a28af6de",
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDZAnzKw/kk3W4n\nyheAOOa+3FF0AW66aiky4vwi+vjPav+P2hb9wYOhlZrjjjO6QFUmBEWIYqxp6Kea\nrJ7kDsYc/VwhqbBqPxs2c/wiGeWcC7x8JwQJ39TVh4VmtxTKVOS51rsS224ptKNu\naWsmv49/khaxSPgwlwF+cjYqBqJETi3K5E5dm58fZo31l16uMOdaGAbccSwCzJs4\nBIgEdAhZNLa5gB8zli0rqbgtudSsMXjtr1pnZ5oDSHrOmUTk2wzBlr3cPRn1Rzb+\n2NNbilOtDx8mQKCfcuQOAHH1t6DwsvWDv21jKiNfMLKcT44uZn35kG/+a/bWsVR6\n1rjxOfthAgMBAAECggEAMbOyJTaRP3I/onlUvJdLsfb/6NPTKnraCL+YA+L7TXYy\nJh5LGb9SiJWdLfUJv+SwG87qpfwDhRY2HOTgV1dS5JzalxMoRo1BjE0wOBc6UW0W\ntFCzSherxWQOl6Hi7xxWboHRwtXi+0ZWEBmw4uUI1qz86YnO3kIXo4BBC4sNaxsY\nv8GGrLXon2usvKgkXwabbSXTGAeIOFrj9DOOD/7AuysuOj+vPaNw4o96w7CYXWj6\nSHAAFXqbJ5j8+NH3eqARGabtGNEZtuMjeHdXUtAz3kDnWvmyHG8SDLdY5SWDfMJX\nIfUFP76VigtvsS6+tW4aXzJoeNzzyNXrMtZIFBM2YQKBgQDw5uBAPpnZ57lk+uWK\nFTzZ7pgH7qOTO7Znl/htx/lfm2cO3SsIQC9ttW5dHYKMnn8Y3LhJ5WQFph+U8l1m\nV50EetkWd4TbrP5NTl8c+pBS9EevAWnWeM/r0TPjSx6DD9ftSURtKuEH4jSsD2OY\nesTDhLusrh6+xjpWblZXWt93XQKBgQDmnEbNYAu99p9XtIOgjxQkjRPcchLE0P50\nllWJwF7y7uyR+K4GUP08ItNC/tSZPJNxMyOaoWsGsvrFSbZ96ASydXjOUWjkmxc9\n4Yv3FX93SE2ixB4Yq9o4eKxlyyH1JUjNR78zk86g4k927y/XegoKuwR0h9fvjH75\nQq2P50an1QKBgAVN4BQqDLMqkf9yMsmmjA90XG6YR4u/XdXMF9E6/Peo8Uz3e7IT\nz7eHriVot+4msz+15GzkGx6wuLNL3tiZB0EI/2yqNwerOHI1TozRy4m4DTgCPPVW\n9aUIly7jAYn7OFLmMRaCQjAtP+Gl+RhrY5e2fXdg4hZrQO+UQFxuCMuVAoGBAK7M\nji5mOwBGzAki3xL44P/Dn+Zc4TUmZXnh6fx8QHxL9i2/HcnT4d+PVitWFbgBXpFT\nfg1bhVCSodqhQR62m7jZqjRZKPT/SeKx7/Hd7bxwpchWd6mjuclMTwDptFepZ0GS\nvK9PvjPc1vcD3nOqIap4j6v0vAzrpeMyU3TcjYXxAoGBALzL9k32stYekQ1M7C8G\nhrQJrfVjpB2qPmEvVeExqYzyAqWuLpCC7e1kQvAtg1dDqSGQBg6T0bjuG/nkXvew\n2FwXdTFMoqfZ7LI86pBCvb0iKeWfQ6g9gts8Pwh05iU4vmtYPII0TgZsh5bzSmnU\njHp+IeJVOd3GyLRngNsrKbt6\n-----END PRIVATE KEY-----\n",
      "client_email": "beam-776@beam-290317.iam.gserviceaccount.com",
      "client_id": "110788166125850219689",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/beam-776%40beam-290317.iam.gserviceaccount.com"
    }

  return googleVisionConfig;
}*/


//quickstart();

//app.get("/", (request, response) => {
//  response.sendFile(__dirname + "/views/index.html");
//});