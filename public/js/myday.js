var teamadd = document.getElementById("team_add");
let id = sessionStorage.getItem('userid');
let learntime = document.getElementById("learntime");
let account = sessionStorage.getItem('useraccount');
let teamTbody = document.getElementsByClassName("team_main")[0].getElementsByTagName("tbody")[0];
var teamdelete = document.getElementById("team_delete");
var teama = document.getElementsByName("team_a");
function getTime() {
    var result = 0;
    var time = new Date();
    var h = time.getHours();
    h = h < 10 ? '0' + h : h;
    var m = time.getMinutes();
    m = m < 10 ? '0' + m : m;
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    var dates = time.getDate();
    var result = year + '-' + month + '-' + dates + ' ' + h + ':' + m;
    let alltime = time.getTime();
    return { result, alltime };
}
function retime(s1, s2) {
    let total = Math.abs(s2 - s1);
    let end = parseInt(total % (60 * 60 * 1000) / (60 * 1000))
    return end;
}
function resort(array) {
    var arr = array;
    var temp;
    for (i = 0; i < arr.length / 2; i++) {
        temp = arr[i];
        arr[i] = arr[arr.length - 1 - i];
        arr[arr.length - 1 - i] = temp;
    }
    return arr;
}
function showmyday() {
    $.post('http://127.0.0.1/api2/mytime',
        { 'useraccount': account },
        function (date) {
            teamTbody.innerHTML = '';
            date.items = resort(date.items)
            for (let n = 0; n < date.items.length; n++) {
                teamTbody.innerHTML += "<tr><td class='ms'><input type='checkbox' name='team_a' value='all'></td>" +
                    "<td class='ms'>" + date.username + "</td>" +
                    "<td class='ml'>" + date.items[n].begintime + "</td>" +
                    "<td class='ml'style='display: none;'>" + date.items[n].rebegintime + "</td>" +
                    "<td class='ml'>" + date.items[n].endtime + "</td>" +
                    "<td class='ml'>" + date.items[n].time + "</td>" +
                    "<td class='ml'  style='display: none;'>" + date.items[n]._id + "</td>" +
                    "<td class='ml'><a class='mr team_revise' href='javascript:;' onclick='end(this)'><i class='fa fa-pencil-square-o' aria-hidden='true'></i>结束</a>" +
                    "<a class='md team_delete' href='javascript:;' onclick='delettime(this)'><i class='fa fa-minus-square-o' aria-hidden='true'></i>删除</a></td></tr>";
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
        })
    $.post(`http://127.0.0.1/api2/mylearntime`,
        { "useraccount": account },
        function (date) {
            learntime.innerHTML = `${sessionStorage.getItem('username')} , 您的总学习时长是 <span>${date}</span> min`
        })
}
showmyday()
function add() {
    swal({
        title: "你是否确定添加此签到？",
        text: "你是否确定添加此签到？",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "确定签到！",
        cancelButtonText: "取消签到！",
        closeOnConfirm: false,
        closeOnCancel: false
    },
        function (isConfirm) {
            if (isConfirm) {
                // let time = getTime();
                swal("签到成功！", "你的签到成功了！", "success");
                $.post(`http://127.0.0.1/api2/addtime`,
                    { "userid": account, 'begintime': getTime().result, 'rebegintime': getTime().alltime },
                    function (date) {
                        showmyday();
                    })
            } else {
                swal("取消！", "你已经取消删除:", "error");
            }
        });
}
function end(event) {
    let id = event.parentNode.parentNode.children[6].innerHTML;
    let begintime = event.parentNode.parentNode.children[2].innerHTML;
    let rebegintime = event.parentNode.parentNode.children[3].innerHTML;
    let endtime = getTime().result;
    let reendtime = getTime().alltime;
    let alltime = retime(reendtime, rebegintime)
    if (event.parentNode.parentNode.children[4].innerHTML != '') {
        swal('你已经退签过了！');
    } else {
        swal({
            title: "你是否确定退出此签到？",
            text: "你是否确定退出此签到？",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "确定退签！",
            cancelButtonText: "取消退签！",
            closeOnConfirm: false,
            closeOnCancel: false
        },
            function (isConfirm) {
                if (isConfirm) {
                    let endtime = getTime();
                    console.log(parseInt());
                    let time;
                    swal("退签成功！", "你的退签成功了！", "success");
                    $.post(`http://127.0.0.1/api2/endtime`,
                        { "_id": id, 'endtime': getTime().result, "reendtime": reendtime, 'time': alltime },
                        function (date) {
                            showmyday();
                        })
                } else {
                    swal("取消！", "你已经取消退签:", "error");
                }
            });
    }
}
function delettime(event) {
    let id = event.parentNode.parentNode.children[6].innerHTML;
    swal({
        title: "你是否确定删除此签到？",
        text: "你是否确定删除此签到？",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "删除签到！",
        cancelButtonText: "取消删除！",
        closeOnConfirm: false,
        closeOnCancel: false
    },
        function (isConfirm) {
            if (isConfirm) {
                swal("删除成功！", "你的退签删除了！", "success");
                $.post(`http://127.0.0.1/api2/deletetime`,
                    { "_id": id },
                    function (date) {
                        if (date.status == 1) {
                            swal("删除成功！", "你的退签删除成功了！", "success");
                            showmyday();
                        } else {
                            swal("删除失败！", "你的退签删除失败了！", "error");
                        }
                    })
            } else {
                swal("取消！", "你已经取消删除:", "error");
            }
        });
}
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
function teamdeletef() {
    let teamd = document.getElementsByClassName("team_delete");
    swal({
        title: "你确定删除选中人的签到?",
        text: "你将无法恢复该签到信息！",
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
                        var id = teama[i].parentNode.parentNode.children[6].innerHTML;
                        $.post(`http://127.0.0.1/api2/deletetime`,
                            { "_id": id },
                            function (date) {
                                if (date.status == 1) {
                                } else {
                                    swal("删除失败！", "你的退签删除失败了！", "error");
                                }
                            })
                    }
                }
                showmyday();
                swal("删除！", "你所勾选的签到被删除。", "success");
            } else {
                swal("取消！", "你已经取消删除:", "error");
            }
        });
}