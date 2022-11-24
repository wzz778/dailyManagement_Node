let teamTbody = document.getElementsByClassName("team_main")[0].getElementsByTagName("tbody")[0];
$.get('http://127.0.0.1/api2/getlearnsort',
    function (data) {
        let arr=[];
        for (let n = 0; n < data.length; n++) {
            arr[n]=data[n].items;
        }
        let l=data.length;
        for(let left=0;left<l;left++) {
        	for(let right=0;right<l-1-left;right++) {
        		if(arr[right]<arr[right+1]) {
        			let t=arr[right];
        			arr[right]=arr[right+1];
        			arr[right+1]=t;
                    let newdata=data[right];
                    data[right]=data[right+1];
        			data[right+1]=newdata;
        		}
        	}
        }
        teamTbody.innerHTML = '';
        for (let n = 0; n < data.length; n++) {
            let to=data[n].learn==0?'前端':"后端";
                teamTbody.innerHTML +=
                    `
                <tr class="tmt">
                    <td class="ml sorta">${n+1}</th>
                    <td class="ml">${data[n].username}</th>
                    <td class="ml">${to}</th>
                    <td class="ml">${data[n].class}</th>
                    <td class="ml">${data[n].items}</th>
                </tr>
                `
        }
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
        let sorta=document.getElementsByClassName('sorta');
        sorta[0].style.color="red"
        sorta[1].style.color="#CBCB41"
        sorta[2].style.color="#62a4eb"
    })