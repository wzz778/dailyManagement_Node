const nodemailer = require("nodemailer");
// let testAccount = nodemailer.createTestAccount();
let transporter = nodemailer.createTransport({
    host: "smtp.qq.com",
    port: 465,
    secure: true , // true for 465, false for other ports
    auth: {
        user:'2295908251@qq.com', // generated ethereal user
        pass: 'ifzswkiamdyheahb', // generated ethereal password
    },
});
function send(mail,code){
    let info = {
        from: '"阿泽" <2295908251@qq.com>', //  发送人
        to:mail, // 发送地址
        subject: "验证码验证", // Subject line
        text: `您的验证码是：${code},有效期3分钟！`, // plain text body
    };
    return new Promise((res,rej)=>{
        transporter.sendMail(info,function(err,data){
            if(err){
                rej();
            }else{
                res();
            }
        });
    })
}
module.exports = {send};