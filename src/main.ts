import { updateSourceFileNode } from 'typescript';

const ps = PropertiesService.getScriptProperties();
const sheetId     = ps.getProperty("SHEET_ID");
const accessToken = ps.getProperty("CHANNEL_ACCESS_TOKEN");

function doPost() {
  // 通知先取得
  const s = SpreadsheetApp.openById(sheetId);
  const sheet = s.getSheetByName("config");
  const startRow = 2;
  const numColumn = sheet.getLastColumn();
  const userId    = sheet.getSheetValues(startRow, 1, 1, 1)[0][0];

  // TODO: 通知タイミング判定

  // message作成
  const message = {
    to: userId,
    messages: [{
      type: "text",
      text: "test",
    }],
  };

  // message通知
  const res = pushMessage(message);
}

function pushMessage(message) {
  const res = UrlFetchApp.fetch("https://api.line.me/v2/bot/message/push", {
    method: "post",
    headers: {
      'Authorization': 'Bearer ' + accessToken,
    },
    contentType: "application/json; charset=UTF-8",
    payload: JSON.stringify(message),
  });
}

function replyMessage(e) {
  const user_id  = e.source.userId;
  const group_id = e.source.groupId;
  const room_id  = e.source.roomId;
  const ids = [user_id, group_id, room_id];

  const postData = {
    "replyToken" : e.replyToken,
    "messages" : [
      {
        "type" : "text",
        "text" : ids.join(",")
      }
    ]
  };

  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", {
    method : "post",
    headers : {
      "Authorization" : "Bearer " + accessToken
    },
    contentType: "application/json",
    "payload" : JSON.stringify(postData)  
  });
}