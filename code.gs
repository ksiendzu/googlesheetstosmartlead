var settingsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Settings")
var leadsListSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("LeadsList")

var apiKey = settingsSheet.getRange(1,2).getValue()
var campaignId = settingsSheet.getRange(2,2).getValue()

var urlCampaigns = "https://server.smartlead.ai/api/v1/campaigns/"
var apiParam = apiKey + "?api_key=yourApiKey"


// Make a POST request with a JSON payload.
function getLeadsAsJSON() {
  var leadListData = [];

  var lastRow = leadsListSheet.getLastRow();
  var leadDataRange = leadsListSheet.getRange(2, 1, lastRow - 1, 2); // Assuming data starts from row 2 in columns 1 and 2

  for (var i = 1; i <= lastRow - 1; i++) {
    var leadData = {
      "first_name": leadDataRange.getCell(i, 1).getValue(), // Assuming "first_name" is in column 1
      "email": leadDataRange.getCell(i, 2).getValue()      // Assuming "email" is in column 2
    };
    leadListData.push(leadData);
  }

  var data = {
    lead_list: leadListData,
    settings: {
      ignore_global_block_list: false,
      ignore_unsubscribe_list: false,
      ignore_duplicate_leads_in_other_campaign: false
    }
  };

  return {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(data)
  };
}
  

function sendLeadsList() {
  var response = UrlFetchApp.fetch('https://server.smartlead.ai/api/v1/campaigns/' + campaignId + '/leads?api_key=' + apiKey, getLeadsAsJSON());
  Logger.log("Sent values:" + getLeadsAsJSON().payload)
  Logger.log("Received values:" + response)
}

