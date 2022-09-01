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
const userArray = [];
for(let i = 0; i<10;i++){
  userArray.push(new User("user"+i,i,0,""));
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
    const userId = requestJson.id;
    userArray.push(new User("user" + id, userId,image))
    return new Response();//そのまま返す
  }
  if(req.method == "GET" && pathname === "/api/task/evalute"){//評価する相手をランダムで表示
    const user = userArray[getRandomInt(userArray.length)];
    return new Response(JSON.stringify(user));
  }
  if(req.method == "POST" && pathname === "/api/task/evalute"){//評価された回数を保存するAPI
    const requestJson = await req.json();
    const userid = requestJson.id;
    for(let i = 0; i < userArray.length; i++){//ダミーのAPIを探してヒットするとrateが上がる
      if(userid == userArray[i].id){
        userArray[i].rate++;
      }
    }
    return new Response();
  }
  if(req.method == "POST" && pathname === "/api/habipower"){
    const requestJson = await req.json();
    const userId = requestJson.id;
    let countrate = 0;//順位
    let habipower = 0;//ハビパワー(resの値)
    const userrate = 0;
    for (let m = 0; m < userArray.length; m++){//ユーザーのレートを探す
      if(userId == userArray[m].id){
        userrate = userArray[m].rate;
        break;
      }
    }

    for(let i = 0; i < userArray.length; i++){//今回順位を表示するユーザーを探す
      if(userId == userArray[i].id){
        for(let j = 0; j < userArray.length; j++){//下に何人いるかカウントする
          if(userrate > userArray[j].rate){
            countrate++;
          }
        }
      }
    }
    // const maxrate = userrate;
    // for(let k = 0; k < userArray.length; k++){
    //   if(userrate < userArray[i].rate){
    //     maxrate = userArray[i].rate;
    //   }
    // }
    const multi = Math.floor(Math.random() * 10) + 1; 
    habipower = userrate * multi;//レーティングの計算
    if(habipower == 0 && userArray.length == 10){//最初の画面ではハビパワー0
      habipower = 0;
    }
    (habipower).toFixed();//ハビパワー整数に四捨五入
    const res = {"habipower" : habipower};
    return new Response(JSON.stringify(res));
  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
