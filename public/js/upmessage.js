let changeHead = document.getElementsByClassName('changeHead')[0];
let mr_input = document.getElementsByClassName('mr_input');
let getmessage = document.getElementsByClassName('getmessage');
let to = document.getElementsByClassName('to');
let usershead = document.getElementById('usershead');
let head = sessionStorage.getItem("userhead");
let name = sessionStorage.getItem("username");
let userto = sessionStorage.getItem("userto");
let classt = sessionStorage.getItem("userclass")
let email = sessionStorage.getItem("useremail");
console.log(head);
function checkFile(img) {
    let file = img;
    console.log(img);
    if (file == null || file == "") {
        swal("请选择要上传的文件!");
        return false;
    }
    //定义允许上传的文件类型
    var allow_ext = ".jpg|.png|.gif";
    //提取上传文件的类型
    var ext_name = file.substring(file.lastIndexOf("."));
    //判断上传文件类型是否允许上传
    if (allow_ext.indexOf(ext_name + "|") == -1) {
        swal("该文件不允许上传，请上传" + allow_ext + "类型的文件,当前文件类型为：" + ext_name);
        return false;
    }
}
function upimg() {
    let formData = new FormData();
    let headname = $('#file')[0].value;
    let ishead = checkFile(headname);
    if (ishead != false) {
        let changemyhead = new Promise((resolve, reject) => {
            formData.append('img', $('#file')[0].files[0]);
            formData.append('id', sessionStorage.getItem("id"));
            resolve();
        });
        changemyhead.then(() => {
            $.ajax({
                // 类型
                type: "POST",
                url: "http://127.0.0.1/api/updataimg",
                data: formData,
                dataType: "json",
                contentType: false,
                processData: false,
                success: function (date) {
                    if (date.status == 1) {
                        swal("上传成功！", '图片上传成功！', "success");
                        changeHead.style.backgroundImage = `url(${date.url})`

                    } else if (date.msg = '图片上传尺寸过大！') {
                        swal("上传失败！", '图片上传尺寸过大！', "error");
                    } else {
                        swal("上传失败！", '图片上传格式错误！', "error");
                    }
                },
                error: function (returndata) {
                    console.log(returndata);
                }
            })
        })
    }
}
function upmessage() {
    let username = mr_input[0].value;
    let userclass = mr_input[1].value;
    let email = mr_input[2].value;
    let id = sessionStorage.getItem("userid");
    let learn = 0;
    if (to[1].checked) {
        learn = 1;
    }
    let img = changeHead.style.backgroundImage.split('"')[1].split('"')[0];
    if (username != '' && userclass != '' && img != '' && email != '') {
        $.post('http://127.0.0.1/api/updata',
            { "username": username, "class": userclass, "email": email, "head": img, "learn": learn, "_id": id },
            function (date) {
                if (date.status == 1) {
                    swal("修改成功！", '你成功的修改了该账号的信息！', "success");
                    setTimeout(function () {

                        window.location.assign("http://127.0.0.1/");
                    }, 500);
                } else if (date.msg == '用户名已存在！') {
                    swal("修改失败！", '用户名已存在！', "error");
                } else {
                    swal("修改失败！", '你的修改失败！', "error");
                }
            })
    } else {
        swal("修改失败！", '请输入完整信息！', "error");
    }
}
$.post('http://127.0.0.1/api/showbyid',
    { "_id": userid },
    function (date) {
        usershead.src = date.head;
        changeHead.style.backgroundImage = `url(${date.head})`
        getmessage[0].innerHTML = date.username;
        mr_input[0].value = date.username;
        if (date.learn== 0) {
            getmessage[1].innerHTML = "前端";
            to[0].checked='true';
        } else {
            getmessage[1].innerHTML = "后端";
            to[1].checked='true';
        }
        getmessage[2].innerHTML = date.class;
        mr_input[1].value = date.class;
        getmessage[3].innerHTML = date.email;
        mr_input[2].value = date.email;
        let userhead=document.getElementsByClassName('userhead');
        let username=document.getElementsByClassName('username');
        sessionStorage.setItem("userhead", date.head);
        sessionStorage.setItem("username", date.username);
        for (n of userhead) {
            n.src= date.head;
        }
        for (n of username) {
            n.innerText = date.username;
        }
    })
// usershead.src = head;
// changeHead.style.backgroundImage = `url(${head})`
// getmessage[0].innerHTML = name;
// mr_input[0].value = name;
// if (userto == 0) {
//     getmessage[1].innerHTML = "前端";
// } else {
//     getmessage[1].innerHTML = "后端";
// }
// getmessage[2].innerHTML = classt;
// mr_input[1].value = classt;
// getmessage[3].innerHTML = email;
// mr_input[2].value = email;
