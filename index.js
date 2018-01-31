		
var https = require("https");
var fs = require("fs");
var fetch = require('node-fetch');
var colors = require('colors');  
var pn={page:1,count:1,max:900}

getImageData()

function getImageData(){
	fetch(`https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&fp=result&queryWord=${encodeURIComponent('网络头像')}&cl=2&lm=-1&ie=utf-8&oe=utf-8&word=${encodeURIComponent('非主流')}&pn=${pn.page}&width=180&height=180`)
		.then(res=>res.json())
		.then(data=>{
			var imgArr = data.data
			var selfObj = {length:imgArr.length,now:0}
	  	syncArrMap(imgArr,selfObj)
		})
}


function asyncAppendFile(url){
    return new Promise(function (resolve, reject){
    	fs.appendFile('./img.txt', url+'\r\n',function(err){
		  	if(err){
		  		console.log(err)
		  		reject(err);
		  	}
		  	resolve()
			});
    });
}

function asyncWriteFile(imgUrl){
    return new Promise(function (resolve, reject){
    	fs.writeFile(`./downImg/head${pn.count}.jpg`, imgUrl, "binary", function(err){
				if(err){
			    console.log("down fail");
			    reject(err);
			  }else{
			  	console.log(`文件：head${pn.count}.jpg 下载成功！`.green)
					resolve()
			  }
			});
    });
}

function syncArrMap(imgArr, selfObj){
	if(imgArr[selfObj.now].thumbURL){
		https.get(imgArr[selfObj.now].thumbURL, function(res){
	    var imgUrl = "";
	    res.setEncoding("binary");
	    res.on("data", function(url){
	        imgUrl += url;
	    });
	    res.on("end", function(){
	    	if(pn.count>pn.max) return;
	    	asyncAppendFile(imgArr[selfObj.now].thumbURL)
	    	.then((data) => asyncWriteFile(imgUrl))
	    	.then((data) => {
	    		pn.count ++
	    		selfObj.now += 1
					if(selfObj.now>=selfObj.length-1){
						pn.page++
						getImageData()
					}else{
						syncArrMap(imgArr, selfObj)
					}
	    	})
						
	    });
		});
	}else{
		selfObj.length -= 1
	}
}

	


