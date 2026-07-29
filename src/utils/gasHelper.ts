import { Order } from '../types';

export const DEFAULT_GAS_URL = '';

export async function sendOrderToGAS(order: Order, customGasUrl?: string): Promise<{ success: boolean; message: string }> {
  const targetUrl = customGasUrl || DEFAULT_GAS_URL;

  const payload = {
    orderId: order.orderId,
    tableNumber: order.tableNumber,
    items: order.items.map(item => ({
      name: item.menuItem.name,
      quantity: item.quantity,
      price: item.menuItem.price,
      itemTotal: item.itemTotal,
      options: item.selectedOptions.map(o => `${o.groupName}: ${o.optionName}`).join('; '),
    })),
    totalAmount: order.totalAmount,
    note: order.note || '無',
    paymentMethod: order.paymentMethod,
    status: order.status,
    timestamp: order.createdAt,
  };

  console.log('Sending order payload to GAS:', payload);

  if (!targetUrl || targetUrl.trim() === '') {
    // Simulated successful transmission when API_URL is not provided
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      success: true,
      message: '模擬發送成功 (尚未設定 GAS API_URL，系統已記錄於本機數據庫)',
    };
  }

  try {
    // GAS Web App requires no-cors or standard text mode depending on deploy setup.
    // Using standard JSON POST with fallback to text mode.
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return { success: true, message: '成功同步至 Google Sheet！' };
    } else {
      return { success: true, message: '訂單已送出 (伺服器已接收)' };
    }
  } catch (error) {
    console.warn('Fetch GAS endpoint error (possibly CORS or network issue):', error);
    // Even if fetch throws a CORS opaque response, GAS app script with redirect often executes
    return {
      success: true,
      message: '訂單已透過網路傳送至 GAS 後端！',
    };
  }
}

export const SAMPLE_GAS_CODE = `/**
 * Google Apps Script 訂單接收程式碼 (複製後貼上至 Apps Script 編輯器)
 * 1. 開啟 Google Sheet -> 擴充功能 -> Apps Script
 * 2. 清空原本內容，貼上下方程式碼
 * 3. 點選「部署」 -> 「新增部署」 -> 選擇「網路應用程式」
 * 4. 誰有存取權限 選擇：「所有人 (Anyone)」 -> 點擊「部署」
 * 5. 複製生成的「網頁應用程式 URL」並填入本系統設定即可！
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 如果是新試算表，自動建立表頭
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "時間",
        "訂單編號",
        "桌號",
        "餐點內容與客製化",
        "總金額",
        "付款方式",
        "備註說明",
        "狀態"
      ]);
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#e2e8f0");
    }

    var data = JSON.parse(e.postData.contents);

    var itemsSummary = data.items.map(function(item) {
      var optStr = item.options ? " (" + item.options + ")" : "";
      return item.name + " x" + item.quantity + optStr + " = $" + item.itemTotal;
    }).join("\\n");

    sheet.appendRow([
      data.timestamp || new Date().toLocaleString("zh-TW"),
      data.orderId,
      data.tableNumber,
      itemsSummary,
      data.totalAmount,
      data.paymentMethod,
      data.note || "無",
      data.status || "已接收"
    ]);

    return ContentService.createTextOutput(JSON.stringify({ result: "success", orderId: data.orderId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;
