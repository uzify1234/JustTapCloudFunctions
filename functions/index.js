const functions = require("firebase-functions");
var vCardsJS = require('vcards-js');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

var config = {
    apiKey: "AIzaSyBW4EQtK0UfiqcSKu3ej_AHVjoVm5K3qjg",
    authDomain: "nfcapp-5495e.firebaseapp.com",
    projectId: "nfcapp-5495e",
    storageBucket: "nfcapp-5495e.appspot.com",
    messagingSenderId: "44712465681",
    appId: "1:44712465681:web:0e87729fefa70a6965a8b0",
    measurementId: "G-PWTN5MMEN3"
};
admin.initializeApp(config);
const firestore = admin.storage();


exports.createvcard = functions.runWith({
    timeoutSeconds: 540
  }).https.onRequest(async (req, res) => {
    return cors(req, res, () => {



      var mobilenumbers = req.query.mobilenumbers.split(",");
      var emailids = req.query.emailids.split(",");

    
  var cardid = req.query.cardid;
  
  var vCard = vCardsJS();
vCard.firstName = req.query.firstname ?? "";
vCard.middleName = "";
vCard.lastName = req.query.lastname ?? "";
vCard.organization = '';
vCard.workAddress.label = 'Work Address';
vCard.workAddress.street = req.query.address ?? "";
if(mobilenumbers.length > 0) {
vCard.workPhone =  mobilenumbers[0] ?? "";
}
if(mobilenumbers.length > 1) {
  vCard.homePhone =  mobilenumbers[1] ?? "";
}
if(mobilenumbers.length > 2) {
  vCard.cellPhone =  mobilenumbers[2] ?? "";
}
if(mobilenumbers.length > 3) {
  vCard.pagerPhone =  mobilenumbers[3] ?? "";
}

var urlarrays = [];
if(req.query.website && req.query.website !== "") {
  urlarrays.push(req.query.website ?? "");
  vCard.url = req.query.website ?? "";
}
if(req.query.facebook && req.query.facebook !== "") {
  var facbk = req.query.facebook ?? "";
  var fburl = "https://www.facebook.com/"+facbk;
  urlarrays.push(fburl);
  vCard.socialUrls['facebook'] = fburl;
  // vCard.url = fburl;
}
if(req.query.instagram && req.query.instagram !== "") {
  var igg = req.query.instagram ?? "";
  var igurl = "https://www.instagram.com/"+igg;
  urlarrays.push(igurl);
  vCard.socialUrls['instagram'] = igurl;
  // vCard.url = igurl;
}
if(req.query.twitter && req.query.twitter !== "") {
  var twt = req.query.twitter ?? "";
  var twturl = "https://twitter.com/"+twt;
  urlarrays.push(twturl);
  vCard.socialUrls['twitter'] = twturl;
  // vCard.url = twturl;
}
if(req.query.linkedin && req.query.linkedin !== "") {
  var lnn = req.query.linkedin ?? "";
  var linkurl = "https://www.linkedin.com/in/"+lnn;
  urlarrays.push(linkurl);
  vCard.socialUrls['linkedIn'] = linkurl;
  // vCard.url = linkurl;
}
// vCard.birthday = new Date(1985, 0, 1);
vCard.title = req.query.designation ?? "";
// vCard.url = urlarrays;
vCard.note = req.query.about ?? "";
vCard.email = emailids;
vCard.organization = req.query.company ?? "";
// var facbk = req.query.facebook ?? "";
// if(facbk !== "") {
//   vCard.socialUrls["facebook"] = "URL:https://www.facebook.com/"+facbk;
// }

// var insgm = req.query.instagram ?? "";
// if(insgm !== "") {
//   vCard.socialUrls["instagram"] = "URL:https://www.instagram.com/"+insgm;
// }

// var twtrr = req.query.twitter ?? "";
// if(twtrr !== "") {
//   vCard.socialUrls["twitter"] = "URL:https://twitter.com/"+twtrr;
// }

// var lnkdn = req.query.linkedin ?? "";
// if(lnkdn !== "") {
//   vCard.socialUrls["linkedin"] = "URL:https://www.linkedin.com/in/"+lnkdn;
// }
var pim = req.query.profileimage ?? "";
if(pim !== "") {
  vCard.photo.attachFromUrl(pim);
}
if(emailids.length > 1) {
  // vCard.workEmail =  emailids[1] ?? "";
}

// vCard.saveToFile('./eric-nesseklr.vcf');
var metadata = {
    contentType: 'text/vcard',
  };


res.set('Content-Type', `text/vcard; name="${req.query.firstname}.vcf"`);
res.set('Content-Disposition', `inline; filename="${req.query.firstname}.vcf"`);

const bucket = admin.storage().bucket();

const file = bucket.file(`vcardss/${cardid}.vcf`);
const options = { resumable: false, metadata: { contentType: "text/vcard" } };

// res.send("Check done");

return file.save(vCard.getFormattedString(), options)
.then(snap => {
    res.send("Contact card uploaded");
})
.catch(err => {
    console.log(`Unable to upload image ${err}`)
})
});
});
