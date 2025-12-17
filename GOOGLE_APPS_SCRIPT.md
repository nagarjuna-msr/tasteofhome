# Zero-Config Backend: Google Apps Script

This script acts as your "Backend". It receives data from your website and saves it to your Google Sheet.

## Instructions
1.  Open your [Google Sheet](https://docs.google.com/spreadsheets/d/1PqGKMwO6ah58f6GwbizeFRGAf5NO1wqofPVhTm6Yohk/edit?gid=0#gid=0).
2.  Go to **Extensions** > **Apps Script**.
3.  **Delete** any code there and **Paste** the code below.
4.  Click the **Deploy** button (top right) > **New Deployment**.
5.  **Select type:** Web app.
6.  **Description:** "Lead API".
7.  **Execute as:** "Me".
8.  **Who has access:** **Anyone** (This is crucial for it to work without login).
9.  Click **Deploy**.
10. Copy the **Web app URL** (It starts with `https://script.google.com/macros/s/...`).

## The Code

```javascript
// This function handles the HTTP POST request from your website
function doPost(e) {
  try {
    // 1. Parse the incoming JSON data
    var data = JSON.parse(e.postData.contents);
    var name = data.name;
    var mobile = data.mobile;
    var product = data.product;
    var interestStatus = data.interest_type || "Start Pre-booking";

    // 2. Open the active spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // 3. Append the new row
    sheet.appendRow([
      new Date(),       // Timestamp
      name,             // User Name
      mobile,           // WhatsApp Number
      product,          // Product Title
      interestStatus,   // Status
      "New"             // Queue Status
    ]);

    // 4. Return success message
    return ContentService.createTextOutput(JSON.stringify({ 
      "result": "success", 
      "message": "Lead saved successfully" 
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error message if something fails
    return ContentService.createTextOutput(JSON.stringify({ 
      "result": "error", 
      "error": error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// This function handles browser visits (GET requests) for testing
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    "result": "success",
    "message": "TasteOfHome Webhook is Active! Use POST to send data."
  })).setMimeType(ContentService.MimeType.JSON);
}
```
