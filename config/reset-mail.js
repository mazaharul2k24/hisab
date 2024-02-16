const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    
    user: 'majaharul2k23@gmail.com',
    pass: 'qtgdpsnszqfetvor'
  }
});

const reseMail=async(ufname,uEmail,uPass)=> {
const html=`
<div style="   width:100%;
  margin: auto;" class="mailMain">
  <div style="  background: rgb(79, 70, 229);
    color: white;
    text-align: center;
    font-weight: bold;
    font-family: arial;
    padding: 1px;" class="mailheader">
    <h3>WELCOME TO HISAB </h3>
  </div>
  <div style=" padding: 11px;
    background: aliceblue;
font-family: arial;
margin-top: 10px;;" class="hisabBody">
    <b style=" display: block;">Dear ${ufname},</b>
    <p style='line-height:20px;' class="aaa">
      We at hisab  take the trust and safety of our users seriously.You request to reset your hisab password.
    Your One time password is   </p>
  <b style=" background: #6064f1;
  color: white;
  padding: 10px 30px;
  border-radius: 10px;
  outline: none">${uPass}</b>

  </div>
  <div style=" margin-top: 11px;" class="hisabFooter">
    <b style='display:block'><i> Regard,</i></b>
    <i style="  font-family: monospace;">
      mazaharul islam (expert-web developer)
    </i>
  </div>
</div>


`;

try { 
    const info = await transporter.sendMail({
        from: 'majaharul2k23@gmail.com', // sender address
        to: uEmail, // list of receivers
        subject: "Reset password ", // Subject line
        html:html
      });
    if(!info){
    
        console.log("Mail Not Send...")
    }
      
    
} catch (a) {
    console.log("mail send Error..." + a)
}

}

module.exports={reseMail};