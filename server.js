import { serve } from "https://deno.land/std@0.151.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.151.0/http/file_server.ts";

serve(async (req) => {
  const pathname = new URL(req.url).pathname;
  console.log(pathname);
  
  if(req.method == "POST" && pathname === "/match_start"){//マッチング開始API
    const requestJson = await req.json();
    const taskname = requestJson.taskname;
    if(requestJson.taskname == taskname){
      return new Response(taskname);
    }
    return new Response("取得エラー",{status:400});
  }
  if(req.method == "POST" && pathname === "/match_bool"){//マッチング完了かどうか
    
  }
  if(req.method == "POST" && pathname === "/match_finish"){//マッチング完了
    
  }
  if(req.method =="POST" && pathname === "/task_name"){//タスク名取得API
    const requestJson = await req.json();
    const taskname = requestJson.taskname;//タスク名の受け取り
    //ダミーなのでオウム返し
    return new Response(taskname);
  }
  if(req.method == "POST" && pathname === "/user_name"){//ユーザー識別子取得API
    // const requestJson = await req.json();
    // const username = requestJson.username;//ユーザー識別子受け取り
    const username = "ダミーユーザー";
    return new Response(username);
  }
  if(req.method == "POST" && pathname === "/move_screen"){//画面遷移API
    const requestJson = await req.json();
    recomendflag = requestJson.flag;//通知が来てるか来てないか
    const screennum = requestJson.num;//画面の番号受け取り
    return new Response(screennum);
  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
