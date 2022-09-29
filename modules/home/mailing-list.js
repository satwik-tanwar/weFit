const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
  apiKey: "768b0dfa39c70286899731b65eda09a9-us17",
  server: "us17",
});

exports.mailingList= async (req) =>{
  const firstName=req.body.firstName;
  const lastName=req.body.lastName;
  const email=req.body.email;
  const data={
    members: [
        {
            email_address: email,
            status: "subscribed",
            merge_fields:{
                FNAME: firstName,
                LNAME: lastName
            }
        }
    ]
  };
  const response= await mailchimp.lists.batchListMembers("251f4f4737",data);
  return response.error_count;
  
}