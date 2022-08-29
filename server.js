import {
  serve
} from "https://deno.land/std@0.138.0/http/server.ts";

import {
  serveDir
} from "https://deno.land/std@0.138.0/http/file_server.ts";


import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js";

import {
  getDatabase,
  ref,
  onValue,
  push
} from "https://www.gstatic.com/firebasejs/9.8.2/firebase-database.js";



serve(async (req) => {
  const firebaseConfig = {
    apiKey: "sample",
    authDomain: "sample",
    projectId: "sample",
    storageBucket: "sample",
    messagingSenderId: "sample",
    appId: "sample",
    measurementId: "sample",
    databaseURL: "sample",
  };
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  const pathname = new URL(req.url).pathname;

  if (req.method === "POST" && pathname === "/save") {
    const now = new Date();
    const requestJson = await req.json();
    push(ref(database, 'saveData'), { //saveDataテーブルに、name,message,dateの情報を入れる
      name: requestJson.name,
      message: requestJson.message,
      date: now.getMonth() + 1 + '月' + now.getDate() + '日' + now.getHours() + '時' + now.getMinutes() + '分'
    });
    return new Response('記録しました');
  }

  if (req.method === "GET" && pathname === "/saveData") {
    const starCountRef = ref(database, 'saveData'); //saveDataテーブルから情報を取り出す
    let saveDataLists;
    onValue(starCountRef, (snapshot) => {
      saveDataLists = snapshot.val();
    });
    return new Response(JSON.stringify(saveDataLists));

  }

  return serveDir(req, {
    fsRoot: "public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
