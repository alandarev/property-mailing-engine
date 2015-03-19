var nodemailer = require('nodemailer'),
    util = require('util');
var transport = require('nodemailer-direct-transport');

var transporter = nodemailer.createTransport(transport({debug: true}));

function notify(user, entries)  {
  var htmlCode = formatEntries(entries);

  transporter.sendMail({
    from: {name: "Property Finder", address: "properties@alandarev.com"},
    to: user,
    subject: util.format("%d new properties found", entries.length),
    text: "HTML Only",
    html: htmlCode
  }, function(err, info)  {
    if(err) console.error(err);
  });
}

function formatEntries(entries) {
  return "<html><body><b>HELLO WORLD</b></body></html>";
}


exports.notify = notify;
