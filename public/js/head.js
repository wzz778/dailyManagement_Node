let column = document.getElementsByClassName("column_a");
let userhead = document.getElementsByClassName("userhead");
let username= document.getElementsByClassName("username");
let userid=sessionStorage.getItem("userid");
let userstatus=sessionStorage.getItem("userstatus");
function noteam(){
    if(userstatus==0){
        swal('该功能普通成员禁止访问！');
    }else{
        window.location.assign("http://127.0.0.1/team");
    }
}
function dropdown() {
    let dropdown = document.getElementById('head-cord-fade');
    if (dropdown.style.display == 'none') {
        dropdown.style.display = 'block'
    } else {
        dropdown.style.display = 'none'
    }
}
function slow() {
    let nav = document.getElementById('nav');
    let head = document.getElementById('head');
    let body = document.getElementById('body');
    if (nav.className == 'nav1') {
        nav.className = 'nav2'
        head.className = 'head2'
        body.className = 'body2'
    } else {
        nav.className = 'nav1'
        head.className = 'head1'
        body.className = 'body1'
    }
}
function outland() {
    $.get('http://127.0.0.1/api/outlogin',
        function (date) {
            swal("退出登录成功！", '您的操作成功!', "success");
        });
    swal("退出登录成功！", '您的操作成功!', "success");
    setTimeout(function () {
        window.location.assign("http://127.0.0.1/login");
        sessionStorage.setItem("tousers", '0');
    }, 1000)
    }
$.post('http://127.0.0.1/api/showbyid',
    { "_id": userid},
    function (date) {
        sessionStorage.setItem("userhead", date.head);
        sessionStorage.setItem("username", date.username);
        sessionStorage.setItem("useremail",date.email);
        sessionStorage.setItem("userto", date.learn);
        sessionStorage.setItem("userstatus", date.status);
        sessionStorage.setItem("userclass", date.class);
        sessionStorage.setItem("useraccount", date.account);
        for(n of userhead){
            n.src=date.head;
        }
        for(n of username){
            n.innerText=date.username;
        }
    })
    if(sessionStorage.getItem("tousers")!=1){
        alert('请先登录！');
        window.location.assign("http://127.0.0.1/login");
    }
