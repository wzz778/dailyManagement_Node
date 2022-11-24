var pagenumber = document.getElementById("page_number");
var teamf = document.getElementsByClassName("team_fade");
var fade = document.getElementsByClassName("fade");
var teamadd = document.getElementById("team_add");
// var registermain = document.getElementById("register_main");
var teamdelete = document.getElementById("team_delete");
// var teamall = document.getElementsByName("team_all")[0];
var teama = document.getElementsByName("team_a");
var teamrevise = document.getElementById("team_revise_b");
var backfade = document.getElementById("backfade");
var tri = document.getElementsByClassName('team_reivse_input');
var team_back_max = document.getElementsByClassName('team_back_max')[0];
var ts= document.getElementsByClassName('team_sex');
let team_b = document.getElementsByClassName('team_b')[0];
let a=team_b.getElementsByTagName('a');
let teampage= document.getElementById("teampage");
let teamTbody = document.getElementsByClassName("team_main")[0].getElementsByTagName("tbody")[0];
function teamchangepage() {
    let p = teampage.value;
    if (0 < p) {
        //获取用户数与总页数；
        $.post('http://127.0.0.1/api/showbypage',
            { 'page': p},
            function (date) {
                if (date.status== 1) {
                    teamTbody.innerHTML='';
                    pagenumber.innerHTML=`一个有${date.number}条数据，共${date.allpage}页`;
                    for (let n = 0; n < date.data.length; n++) {
                        let learnn= date.data[n].learn;
                        let learn=learnn ==0? '前端':"后端";
                        teamTbody.innerHTML += "<tr><td class='ms'><input type='checkbox' name='team_a' value='all'></td>" +
                            "<td class='ms'>"+ date.data[n].username +"</td>" +
                            "<td class='ms'>"+ date.data[n].class+"</td>" +
                            "<td class='ms'>"+ learn+"</td>" +
                            "<td class='ml'>"+ date.data[n].email+"</td>" +
                            "<td class='ml'  style='display: none;'>" + date.data[n]._id+"</td>" +
                            "<td class='ml'><a class='mr team_revise' href='javascript:;' onclick='updata(this)'><i class='fa fa-pencil-square-o' aria-hidden='true'></i>修改</a>" +
                            "<a class='md team_delete' href='javascript:;' onclick='deleteone(this)'><i class='fa fa-minus-square-o' aria-hidden='true'></i>删除</a></td></tr>";
                        let ms = document.getElementsByClassName("ms");
                        let ml = document.getElementsByClassName("ml");
                        for (let i of ms) {
                            if (i.innerHTML == "null" || i.innerHTML == "undefined") {
                                i.innerHTML = " ";
                            }
                        }
                        for (let i of ml) {
                            if (i.innerHTML == "null" || i.innerHTML == "undefined") {
                                i.innerHTML = " ";
                            }
                        }
                    }
                } else {
                    swal('请输入合理的页数！');
                }
            })
    }else if (p=="") { }
    else {
        swal("请输入合理的页数！");
    }
}
teamchangepage();
a[2].onclick=function(){
    let n = parseInt(a[1].innerHTML);
    if (n > 1 && n < 11) {
        a[1].innerHTML -= 1;
        teampage.value = a[1].innerHTML;
        teamchangepage();
    }
}
a[0].onclick =function(){
    let n = parseInt(a[1].innerHTML);
    if (n > 0 ) {
       a[1].innerHTML = n + 1;
        teampage.value = a[1].innerHTML;
        teamchangepage();
    }
}
function updata(event){
    teamf[0].style.display = "none";
    teamf[1].style.display = "block";
    backfade.classList.add('fade');
    backfade.style.display = 'block';
    let us = event.parentNode.parentNode.children[1].innerHTML;
    let sexn = event.parentNode.parentNode.children[3].innerHTML;
    let sex = sexn == "前端" ? 0 : 1;
    let classs= event.parentNode.parentNode.children[2].innerHTML;
    let email= event.parentNode.parentNode.children[4].innerHTML;
    let id = event.parentNode.parentNode.children[5].innerHTML;
    tri[0].value = us;
    tri[1].value =email;
    tri[2].value = classs;
    if (sex == 0) {
        ts[0].checked = true;
    } else {
        ts[1].checked = true;
    }
    document.getElementById('team_revise_b').onclick=function(){
        for(let i of tri){
            if( i.value==''){
                return swal('请输入完整内容！');
            }
        }
        let sex = ts[0].checked == true ? 0:1;
        swal({
            title: "你是否确定修改该成员的信息?",
            text: "你将无法恢复该用户信息！",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定修改！",
            cancelButtonText: "取消修改！",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {
                    $.post('http://127.0.0.1/api/updata',
                        {
                            "_id": id, "username": tri[0].value, 'email':tri[1].value, 'class':tri[2].value,'learn':sex
                        },
                        function (date) {
                            if (date.status== 1) {
                                swal("修改成功！", "已完成修改操作", "success");
                                teamf[1].style.display = "none";
                                backfade.classList.remove('fade');
                                backfade.style.display = 'none';
                            }else {
                                swal("修改失败！",date.msg, "error");
                            }
                            teamchangepage();
                        })
                } else {
                    swal("取消！", "你已经取消修改:", "error");
                }
            });
    }
}   
function deleteone(event){
        let us = event.parentNode.parentNode.children[1].innerHTML;
        let id = event.parentNode.parentNode.children[5].innerHTML;
        console.log(us);
        console.log(id);
        // swal({
        //     title: "你确定？",
        //     text: "您将无法恢复这个虚构的文件！",
        //     type: "warning",
        //     showCancelButton: true,
        //     confirmButtonColor: "#DD6B55",
        //     confirmButtonText: "是的，删除！",
        //     closeOnConfirm: false
        // }, function() {
        //     swal("删除!", "您的虚构文件已被删除！", "success");
        // })
        swal({
            title: "你是否确定删除" + us + "的信息?",
            text: "你将无法恢复该用户信息！",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#007ACC",
            confirmButtonText: "确定删除！",
            cancelButtonText: "取消删除！",
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function (isConfirm) {
            if (isConfirm) {
                swal("删除！", "你所选的用户信息已经被删除。", "success");
                $.post(`http://127.0.0.1/api/deletebyid`,
                    { "_id": id },
                    function (date) {
                        // if (sessionStorage.getItem("teamfind") == "1") {
                            console.log(date);
                            teamchangepage();
                        // } else {
                        //     changepage();
                        // }
                    })
            } else {
                swal("取消！", "你已经取消删除:", "error");
            }
        });
}
function adduser() {
    let input = document.getElementsByClassName("registerinput");
    let have = 0;
    for (let n of input) {
        if (n.value == '') {
            swal("请输入完整内容！");
            have = 1;
            break;
        };
    }
    if (have == 0) {
        var mailLimit = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        var passLimit = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;
        var mailJudge = mailLimit.test(input[2].value);
        var passJudge = passLimit.test(input[1].value);
        if (mailJudge == true) {
            if (passJudge == true) {
                $.post('http://127.0.0.1/api/adduser',
                    {
                        "username": input[0].value, "password": input[1].value,"email": input[2].value
                    },
                    function (date) {
                        if (date.status == 1) {
                            swal("添加成功!");
                            for (let n of input) {
                                n.value = "";
                                backfade.classList.remove('fade');
                                backfade.style.display = 'none';
                            }
                            teamchangepage();
                        } else {
                            swal(date.msg);
                        }
                    })
            } else {
                swal("添加失败！", "请输入的字母加数字6~12位的密码!","error"); 
            }
        } else {
            swal("添加失败！", '您的邮箱格式输入错误!',"error"); 
        }
    }
}
for (let i = 0; i < teamf.length; i++) {
    fade[i].onclick = () => {
        teamf[i].style.display = "none";
        backfade.classList.remove('fade');
        backfade.style.display = 'none';
    }
}
teamadd.onclick = () => {
    teamf[0].style.display = "block";
    backfade.classList.add('fade');
    backfade.style.display = 'block';
}
function teamdeletef() {
    let teamd = document.getElementsByClassName("team_delete");
    swal({
        title: "你确定删除选中人的信息?",
        text: "你将无法恢复该用户信息！",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定删除！",
        cancelButtonText: "取消删除！",
        closeOnConfirm: false,
        closeOnCancel: false
    },
        function (isConfirm) {
            if (isConfirm) {
                for (let i in teama) {
                    if (teama[i].checked) {
                        var id = teamd[i].parentNode.parentNode.children[5].innerHTML;
                        $.post(`http://127.0.0.1/api/deletebyid`,
                            { "_id": id },
                            function (date) {
                                // if (sessionStorage.getItem("teamfind") == "1") {
                                //     teamfind();
                                // } else {
                                    teamchangepage();
                                // }
                            })
                    }
                }
                swal("删除！", "你所勾选的用户信息被删除。", "success");
            } else {
                swal("取消！", "你已经取消删除:", "error");
            }
        });

}
// //批量删除
teamdelete.onmousemove = function () {
    let c = false;
    for (let i of teama) {
        if (i.checked) {
            c = true;
        }
    }
    if (!c) {
        teamdelete.style.cursor = "not-allowed";
        teamdelete.onclick = () => {
            swal("请勾选你要删除的对象！");
        };
    } else {
        teamdelete.style.cursor = "pointer";
        teamdelete.onclick = teamdeletef;
    }
}
function s() {
    const teamall = document.getElementsByName("team_all")[0];
    if (teamall.checked) {
        for (let n of teama) {
            n.checked = true;
        }
    }
    else if (teamall.checked == false) {
        for (let n of teama) {
            n.checked = false;
        }
    }
}
// //实现全选功能
function teamfind() {
    sessionStorage.setItem("teamfind", '1');
    let name = document.getElementsByClassName("team_find_input")[0].value;
    if (name == '') {
        swal("请输入搜索内容!");
    } else {
        $.post('http://127.0.0.1/api/showbyname', { 'name': name },
            function (date) {
                if (date.length == 0) {
                    teamTbody.innerHTML = `   
                    <div id="emptymeaage" style="padding-top: 200px;width: 100%;height: 200px;text-align: center;font-size: 16px;">
                        <i class="fa fa-files-o" aria-hidden="true" style="padding-bottom: 10px;color: #68b0f3;font-size: 40px;"></i></br>
                        什么都没有呢 . . .
                    </div>`;
                } else {
                    teamTbody.innerHTML =''
                    for (let n = 0; n < date.length; n++) {
                        teamTbody.innerHTML += "<tr><td class='ms'><input type='checkbox' name='team_a' value='all'></td>" +
                            "<td class='ms'>" + date[n].username + "</td>" +
                            "<td class='ms'>" + date[n].class+ "</td>" +
                            "<td class='ms'>" + date[n].learn + "</td>" +
                            "<td class='ml'>" + date[n].email+"</td>" +
                            "<td class='ml'  style='display: none;'>" + date[n]._id+"</td>" +
                            "<td class='ml'><a class='mr team_revise' href='javascript:;' onclick='updata(this)'><i class='fa fa-pencil-square-o' aria-hidden='true'></i>修改</a>" +
                            "<a class='md team_delete' href='javascript:;' onclick='deleteone(this)'><i class='fa fa-minus-square-o' aria-hidden='true'></i>删除</a></td></tr>";
                        let ms = document.getElementsByClassName("ms");
                        let ml = document.getElementsByClassName("ml");
                        for (let i of ms) {
                            if (i.innerHTML == "null" || i.innerHTML == "undefined") {
                                i.innerHTML = " ";
                            }
                        }
                        for (let i of ml) {
                            if (i.innerHTML == "null" || i.innerHTML == "undefined") {
                                i.innerHTML = " ";
                            }
                        }
                    }
                    //获取一页的用户信息
                }
            })
        team_b.style.display = 'none';
        team_back_max.style.display = 'block';
    }
}
// //查找页面栏目
// sessionStorage.setItem("teamfind", '0');
function backpagen1() {
    sessionStorage.setItem("teamfind", '0');
    document.getElementsByClassName("team_find_input")[0].value = '';
    teamchangepage();
    team_b.style.display = ' flex';
    team_back_max.style.display = 'none';
}
if(userstatus==0){
    swal('该功能普通成员禁止访问！');
    setTimeout(function () {
        window.location.assign("http://127.0.0.1/login");
        sessionStorage.setItem("tousers", '0');
    }, 200)
}