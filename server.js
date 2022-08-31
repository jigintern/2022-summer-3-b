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
const matchinfo = {//マッチングで必要な情報
  taskname : "taskname",
  username : "dammy"
};

serve(async (req) => {
  const pathname = new URL(req.url).pathname;
  console.log(pathname);
//マッチング開始API,完了かどうか知らせるAPI,マッチング完了APIは中身すべて同じ
  if(req.method == "POST" && pathname === "/match_start"){//マッチング開始
    const requestJson = await req.json();
    matchinfo.taskname = requestJson.taskname;
    if(requestJson.taskname == matchinfo.taskname){
      return new Response(matchinfo.taskname);//とりあえずマッチング成功ならtasknameを返す
    }
    return new Response("取得エラー",{status:400});//エラー処理
  }
  if(req.method == "POST" && pathname === "/match_bool"){//マッチング完了かどうか知らせるAPI
    const requestJson = await req.json();
    matchinfo.taskname = requestJson.taskname;
    if(requestJson.taskname == matchinfo.taskname){
      return new Response(matchinfo.taskname);
    }
    return new Response("取得エラー",{status:400});
  }
  if(req.method == "POST" && pathname === "/match_finish"){//マッチング完了
    const requestJson = await req.json();
    matchinfo.taskname = requestJson.taskname;
    if(requestJson.taskname == matchinfo.username){
      return new Response(matchinfo.taskname);
    }
    return new Response("取得エラー",{status:400});
  }
  if(req.method =="POST" && pathname === "/task_name"){//タスク名取得API
    const requestJson = await req.json();
    matchinfo.taskname = requestJson.taskname;//タスク名の受け取り
    //ダミーなのでオウム返し
    return new Response(matchinfo.taskname);
  }
  if(req.method == "POST" && pathname === "/user_name"){//ユーザー識別子取得API
    // const requestJson = await req.json();
    // const username = requestJson.username;//ユーザー識別子受け取り
    matchinfo.username = "ダミーユーザー";
    return new Response(matchinfo.username);
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
    return new Response(image);//そのまま返す
  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
