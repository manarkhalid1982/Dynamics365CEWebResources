/js/GetSet.js

function GetSetValue() {

    var name = Xrm.Page.getAttribute("d365u_changeme").getValue();

    var newValue = name + " Hello everyone";

    Xrm.Page.getAttribute("d365u_changeme").setValue(newValue);

}

function GetSetLookupValue() {

    var account = Xrm.Page.getAttribute("d365u_accountlookup").getValue();

    if (!account) return; //Check if populated before using

    var accountName = account[0].name;

    Xrm.Utility.alertDialog(accountName);

    var newAccount = new Array();
    newAccount[0] = new Object();
    newAccount[0].id = account[0].id;
    newAccount[0].name = account[0].name;
    newAccount[0].entityType = account[0].entityType;

    Xrm.Page.getAttribute("d365u_accountlookup2").setValue(newAccount);
}
