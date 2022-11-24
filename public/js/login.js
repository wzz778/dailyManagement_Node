let name = document.getElementById('name');
let pass = document.getElementById('pass');
let regname = document.getElementById('regname');
let regpass = document.getElementById('regpass');
let emailtext= document.getElementById('reregpass');
let code = document.getElementById('code');
let codebutton = document.getElementById('code-max').getElementsByTagName('button')[0];
function login() {
    let username = name.value;
    let password = pass.value;
    if (username != '' && password != '') {
        $.post('http://127.0.0.1/api/login',
            { "username": username, "password": password },
            function (date) {
                if (date.status == 1) {
                    swal("登录成功！", '您输入了正确的用户名和密码！', "success");
                    sessionStorage.setItem("userid", date.data._id);
                    setTimeout(function () {
                        window.location.assign("http://127.0.0.1/");
                        sessionStorage.setItem("tousers", '1');
                    }, 1000)
                } else {
                    swal("登录失败！", '请您输入正确的用户名和密码！', "error");
                }
            })
    } else {
        swal("登录失败！", '请输入完整信息！', "error");
    }
}
let curCount;
function getcode() {
    let email= emailtext.value;
    if (email == '') {
        swal("请求失败！", '请输入您的邮箱！', "error");
    } else {
        var mailLimit = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        var mailJudge = mailLimit.test(email);
        if (mailJudge == true) {
            $.post('http://127.0.0.1/api/sendcode',
                { "email": email },
                function (date) {
                    console.log(date);
                    if (date.status == 1) {
                        swal("验证码发送成功！");
                        curCount = 60;　　 //设置button效果，开始计时
                        codebutton.innerHTML = "验证码(" + curCount + ")" ;
                        codebutton.onclick=null;
                        InterValObj = window.setInterval(SetRemainTime, 1000);
                    } else {
                        swal("验证码发送失败！");
                    }
                })
        } else {
            swal("请求失败！", '请输入正确格式的邮箱！', "error");
        }
    }
}
function SetRemainTime() {
    var yzm = document.getElementsByClassName("get_yzm")[0]
    if (curCount == 0) {
        window.clearInterval(InterValObj); //停止计时器
        codebutton.onclick= getcode;
        codebutton.innerHTML = "重新发送验证码";
    } else {
        curCount--;
        codebutton.innerHTML = "验证码(" + curCount + ")";
    }
}
function reg() {
    let username = regname.value;
    let password = regpass.value;
    let code =  document.getElementById('code').value;
    let email= emailtext.value;
    if (username != ''&& password!= '' &&code!= '' &&email!= '') {
        $.post('http://127.0.0.1/api/register',
            { "username": username, "password": password ,"email":email,"code":code},
            function (date) {
                if(date.status==1){
                    swal("注册成功！", '你成功的注册了该账号！', "success");
                    sessionStorage.setItem("userid", date.data._id);
                    setTimeout(function () {
                        window.location.assign("http://127.0.0.1/index");
                        sessionStorage.setItem("tousers", '1');
                    }, 1000)
                }else if(date.msg== '验证码错误！') {
                    swal("注册失败！", '验证码输入错误！', "error");
                } else if(date.msg== '用户名已存在！') {
                    swal("注册失败！", '你要注册的用户名已存在！', "error");
                }else{
                    swal("注册失败！", '你的注册失败！', "error");
                }
            })
    } else {
        swal("注册失败！", '请输入完整信息！', "error");
    }
}