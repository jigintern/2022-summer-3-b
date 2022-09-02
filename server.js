import { serve } from "https://deno.land/std@0.151.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.151.0/http/file_server.ts";

import { serveMatching } from "./src/matching.ts";

class User  {
  name;
  id;
  rate;
  habipower;
  constructor(name,id,rate,habipower = 0){
    this.name = name;
    this.id = id;
    this.rate = rate;
    this.habipower = habipower;
  }
}
class Task {
  user_id;
  image;
  related_user_id;
  constructor(user_id,related_user_id,image){
    this.user_id = user_id;
    this.related_user_id = related_user_id;
    this.image = image;
  }
}

/** @type { User[] } */
const userArray = [];

/** @type { Task[] } */
const taskArray = [];
const startlength = 10;//userArrayの初期化したときの大きさ
for(let i = 0; i < startlength; i++){
  userArray.push(new User("user"+i,i,0,""));
}

serve(async (req) => {
  const pathname = new URL(req.url).pathname;
  console.log(pathname);

  const res = await serveMatching(req);
  if(res) {
    return res;
  }

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
    const relatedUserId = requestJson.related_user_id;
    taskArray.push(new Task(userId,relatedUserId,image));
    return new Response();//そのまま返す
  }
  if(req.method == "GET" && pathname === "/api/task/evalute"){//評価する相手をランダムで表示
    const query = new URL(req.url).searchParams;
    const targetUserId = query.get("id");
    const res = taskArray
      .filter((task) => task.user_id === targetUserId)
      .map(({ related_user_id, image }) => {
        const userName = userArray.find(user=> user.id == related_user_id).name;
        return { userId: related_user_id, userName, image };
      });
    return new Response(JSON.stringify(res));
  }
  if(req.method == "POST" && pathname === "/api/task/evalute"){//評価された回数を保存するAPI
    const requestJson = await req.json();
    const userid = requestJson.id;
    let userrate = 0;//評価された回数
    let habipower = 0;//ハビパワー
    let countrate = 0; //順位
    let i = 0;
    // const multi = Math.floor(Math.random()) + 1;//1～のランダムな数をかける

    //ハビパワー計算部分↓
    for(i = 0; i < userArray.length; i++){//ダミーのAPIを探してヒットするとrateが上がる
      if(userid == userArray[i].id){
        userArray[i].rate++;
        userrate = userArray[i].rate;
        break;
      }
    }
    for(let j = 0; j < userArray.length; j++){//順位
          if(userrate < userArray[j].rate){
            countrate++;
          }
        }
    //カウントレートをどう使うか
    habipower = userrate * (userArray.length - countrate) * 271.8;
    (habipower).toFixed();
    userArray[i-1].habipower = habipower;//ハビパワーの代入
    return new Response();
  }

  if(req.method == "POST" && pathname === "/api/habipower"){//ハビパワーの表示
    const requestJson = await req.json();
    const userId = requestJson.id;
    let habipower = 0;//ハビパワー(resの値)
    if(userArray.length != startlength){
     for (let m = 0; m < userArray.length; m++){//ユーザーのハビパワーを探す
      if(userId == userArray[m].id){
        habipower = userArray[m].habipower;
        break;
      }
    }
  }
      const res = {"habipower" : habipower,"has_notifications" : true};
      return new Response(JSON.stringify(res));
}
  if(req.method == "POST" && pathname === "/api/user/resist"){//ゆーざーとうろくAPI
    const requestJson = await req.json();
    const userName = requestJson.name;
    const userId = requestJson.id;
    userArray.push(new User(userName,userId));    
    return new Response();
  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
