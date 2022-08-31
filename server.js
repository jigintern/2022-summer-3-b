import { serve } from "https://deno.land/std@0.138.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";

class User  {
  name;
  id;
  rate;
  image;
  constructor(name,id,rate,image){
    this.name = name;
    this.id = id;
    this.rate = rate;
    this.image = image;
  }
}
const userarray = [];
for(let i = 0; i<10;i++){
  userarray.push(new User("user"+i,i,0,"picture/"));
}
function getRandomInt(max){
  return Math.floor(Math.random() * max);
}
// function rateSort(data[], l, r)
// {
// 	const i, j;
//   const pivot, tmp;
// 	i = l;
// 	j = r - 1;
// 	pivot = data[r];
	
// 	if (l >= r){
// 		return ;
// 	}
	
// 	while (1){
// 		while (data[i].per > pivot.per){
// 			i++;
// 		}
// 		while (i < j && data[j].per <= pivot.per){
// 			j--;
// 		}
// 		if (i >= j){
// 			break;
// 		}
		
// 		tmp = data[i];
// 		data[i] = data[j];
// 		data[j] = tmp;
// 	}
// 	data[r] = data[i];
// 	data[i] = pivot;
	
// 	func1(data, l, i - 1);
// 	func1(data, i + 1, r);
// }

serve(async (req) => {
  const pathname = new URL(req.url).pathname;

  if(req.method == "POST" && pathname === "/move_screen"){//画面遷移API
    const requestJson = await req.json();
    recomendflag = requestJson.flag;//通知が来てるか来てないか
    const screennum = requestJson.num;//画面の番号受け取り
    if(recomendflag == true){
      return new Response(screennum + 1);//通知表示画面
    }
    return new Response(screennum);//表示する画面の番号を返す
  }
  
  if(req.method == "POST" && pathname === "/get_image"){//写真取得API
    //const requestJson = await req.json();
    const image = "data:image/jpeg;base64,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";
    //image = requestJson.image;//画像のバイナリデータを受け取る
    return new Response(image);//カチガラスの画像が固定でバイナリデータで返される
  }
  if(req.method == "POST" && pathname === "/api/task/evalute"){//評価するAPI
    const requestJson = req.json();
    const requestid = requestJson.id;
    for(let i = 0; i < 10; i++){
      if(requestid == userarray[i].id){
        userarray[i].rate++;
      }
    }
  }
  if(req.method == "GET" && pathname === "/api/task/evalute"){//評価する相手をランダムで表示
    const user = userarray[getRandomInt(10)];
    return new Response(JSON.stringify(user));
  }
  // if(req.method == "POST" && pathname === ""){
  //   const requestJson = req.json();
  //   const user_rate = requestJson.rate;
  //   const i = 1;
  //   while(i < 10){
  //     if(userarray[i].rate >userarray[i-1].rate){
  //     }
  //     i++;
  //   }
  // }
  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
