const accountSid = 'AC1732ee2e4c9b4773f8039328ec1399bf';
const authToken = '580514f73f8614900540ba20bfadbc25';
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'This is the test message from neelesh',
     from: '+15042734015',
     to: '+919953025397'
   })
  .then(message => console.log(message.sid))
  .done();