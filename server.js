import { serve } from "https://deno.land/std@0.151.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.151.0/http/file_server.ts";

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

serve(async (req) => {
  const pathname = new URL(req.url).pathname;
  console.log(pathname);

  if(req.method == "POST" && pathname === "/move_screen"){//画面遷移API
    const requestJson = await req.json();
    //recomendflag = requestJson.flag;//通知が来てるか来てないか
    const screennum = requestJson.num;//画面の番号受け取り
    return new Response(screennum);//表示する画面の番号を返す
  }
  if(req.method == "POST" && pathname === "/get_image"){//写真取得API
    const requestJson = await req.json();
    const image = requestJson.image;//画像のバイナリデータを受け取る
    return new Response(image);//そのまま返す
  }
  if(req.method == "GET" && pathname === "/api/task/evalute"){//評価する相手をランダムで表示
    const user = userarray[getRandomInt(10)];
    return new Response(JSON.stringify(user));
  }
  if(req.method == "POST" && pathname === "/api/task/evalute"){//評価された回数を保存するAPI
    const requestJson = req.json();
    const user_id = requestJson.id;
    for(let i = 0; i < 10; i++){//ダミーのAPIを探してヒットするとrateが上がる
      if(user_id == userarray[i].id){
        userarray[i].rate++;
      }
    }
  }
  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
