/*jslint browser: true, long: true, for: true, this: true*/
/*global window, client */
//JavaScript for the contact (customer) entity
var contact = window.NameSpace || {};
//Entity's fields
var ShowSSN = "pbgc_showssn";
var srInProgressStatusCode = 500000000;
var srCompleteStatusCode = 500000005;
var qdroQualifiedStatusCode = 500000000;

contact.checkMyPBAEligibility = function (executionContext) {

    "use strict";
    var formContext = executionContext.getFormContext();
    var id = formContext.data.entity.getId();
    id = id.replace("{", "").replace("}", "");

    var parameters = {};
    parameters.CrmCustomerId = id;

    var req = new XMLHttpRequest();
    req.open("POST", client.getWebApiEndpoint() + "/" + "pbgc_GlobalCheckMyPBAEligibility", false);
    req = client.setXMLHttpRequestObject(req);
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {
                var results = JSON.parse(this.response);
                if (results.IsEligible !== null && results.IsEligible !== 'undefined') {

                    //                    var currentEligibility = client.getAttributeValue("pbgc_iseligibleformypba");
                    //                    
                    //                    if (results.IsEligible !== currentEligibility) {
                    //                    
                    //                        client.getAttribute("pbgc_iseligibleformypba").setSubmitMode("always");
                    //                        client.setAttributeValue("pbgc_iseligibleformypba", results.IsEligible);
                    //                        //formContext.data.entity.save();
                    formContext.data.refresh();


                    //                        client.setAvailability("pbgc_iseligibleformypba", false);
                    //                        client.setAttributeValue("pbgc_iseligibleformypba", results.IsEligible);
                    //                        formContext.data.entity.save();
                    //                        client.setAvailability("pbgc_iseligibleformypba", true);
                    //                    }

                    //                    alert("Is Eligible? " + results.IsEligible); 
                }
                else {
                    Xrm.Utility.alertDialog("Unable to determine MyPBA Eligibility.");
                }

            } else {
                Xrm.Utility.alertDialog(this.statusText);
            }
        }
    };
    req.send(JSON.stringify(parameters));
};

contact.onLoad = function (executionContext) {
    "use strict";
    //Task 1363
    //FormContext.data.entity.addOnSave(contact.setShowSSNToFalse);
    //SSN Audit
    //client.getAttribute(ShowSSN).addOnChange(contact.ssnShowChanged, executionContext);
    //Task 1614: JavaScript: Create Button to reference Flow
    //Get the SendusernameButtonWorkflowId

    if (client.customerHasUsernameAndTrustedEmail()) if (client.isNullOrUndefined(SendusernameButtonWorkflowId)) SendusernameButtonWorkflowId = client.getSendusernameButtonWorkflowId();
    var contactId = client.getId();

    if (FormContext.ui.getFormType() != 1) {
        contact.checkMyPBAEligibility(executionContext);
        contact.checkAlertsOnCustomer(executionContext);
    }

    if (FormContext.ui.getFormType() == 2) //update mode only
    {
        //Check for active DRO
        Xrm.WebApi.online.retrieveMultipleRecords("incident", "?$select=pbgc_servicerequeststatuscode&$expand=pbgc_DomesticRelationsOrderId($select=pbgc_qualificationstatuscode)&$filter=_customerid_value eq " + contactId + " and _pbgc_servicerequesttypeid_value eq 57FFA462-26C1-EA11-A813-001DD8309F0E and (pbgc_servicerequeststatuscode eq 500000005 or pbgc_servicerequeststatuscode eq 500000000)").then(

            function success(results) {
                for (var i = 0; i < results.entities.length; i++) {
                    //If SR Completed, check if was approved
                    if (results.entities[i]["pbgc_servicerequeststatuscode"] == srCompleteStatusCode && results.entities[i].pbgc_DomesticRelationsOrderId !== undefined && results.entities[i].pbgc_DomesticRelationsOrderId.pbgc_qualificationstatuscode == qdroQualifiedStatusCode) {
                        contact.showDroNotification();
                        break;
                    }
                }
            },

            function (error) {
                Xrm.Utility.alertDialog(error.message);
            });
    }
    //Only check if form is in update mode.
    if (FormContext.ui.getFormType() == 2) {
        //check if DRO SR in Progress.
        Xrm.WebApi.online.retrieveMultipleRecords("incident", '?$filter=_customerid_value eq ' + contactId + ' and _pbgc_servicerequesttypeid_value eq 57FFA462-26C1-EA11-A813-001DD8309F0E and pbgc_servicerequeststatuscode eq ' + srInProgressStatusCode).then(

            function success(results) {
                if (results.entities.length > 0) {
                    contact.showDroNotification();
                }
            },

            function (error) {
                Xrm.Utility.alertDialog(error.message);
            });

    }
};
contact.showDroNotification = function () {
    FormContext.ui.setFormNotification("This customer has a Domestic Relations Order on file", "WARNING", "droNotification");
}
//Set up the Show SSN field to false
contact.setShowSSNToFalse = function () {
    "use strict";
    if (client.getOptionSetValue(ShowSSN)) {
        client.setOptionSetValue(ShowSSN, false);
    }
};
contact.ssnShowChanged = function (executionContext) {
    "use strict";
    var formContext = executionContext.getFormContext();
    var id = formContext.data.entity.getId();
    if (client.getOptionSetValue(ShowSSN)) {
        //Create Audit
        var ssnAudit = {
            "Title": "contact.ssnShowChanged",
            "ModuleText": "SSN",
            "Description": "Social Security Number has been unmasked.",
            "RelatedUser": Xrm.Utility.getGlobalContext().userSettings.userId,
            "RelatedCustomerId": id
        };
        SystemLog.LogAudit(ssnAudit, false)
    }
};

contact.setSsnLast4 = function (executionContext) {
    "use strict";
    var formContext = executionContext.getFormContext();
    formContext.getAttribute("pbgc_socialsecuritynumberunmasked").addOnChange(function () {
        var ssnAttr = formContext.getAttribute("pbgc_socialsecuritynumberunmasked");
        var ssn = ssnAttr.getValue();
        if (ssn != undefined && ssn != null && ssn.length == 9) {
            var lastFour = ssn.substring(5);
            client.setAttributeValue("governmentid", lastFour);
        }
    });
};

contact.validateDateOfBirthOnSave = function (executionContext) {
    var today = new Date();
    var formContext = executionContext.getFormContext();
    var dateOfBirth = formContext.getAttribute("birthdate").getValue();

    if (dateOfBirth !== null && typeof dateOfBirth !== "undefined") {
        if (dateOfBirth > today) {
            Xrm.Utility.alertDialog("The Date of Birth entered is in the future. Please enter a date in the past.");
            executionContext.getEventArgs().preventDefault();
        }
    }
};

contact.validateSsnOrItinOnSave = function (executionContext) {

    var formContext = executionContext.getFormContext();
    var ssn = formContext.getAttribute("pbgc_socialsecuritynumberunmasked").getValue();

    if (ssn !== null && typeof ssn !== "undefined") {
        if (!client.validateSSNSpecial(ssn)) {
            Xrm.Utility.alertDialog("Please enter a valid Social Security Number, without dashes.");
            executionContext.getEventArgs().preventDefault();
        }
    }
}

contact.checkAlertsOnCustomer = function (executionContext) {

    var contactId = client.getId();
    var selectStatement = "?$select=_pbgc_planid_value&$filter=_pbgc_customerid_value eq " + contactId + " and statecode eq 0";
    //alert("checkAlertsOnCustomer.selectStatement = " + selectStatement);

    Xrm.WebApi.online.retrieveMultipleRecords("pbgc_customerplan", selectStatement).then(

        function success(results) {
            if (results !== null && results !== "undefined" && results.entities.length > 0) {

                //alert("checkAlertsOnCustomer succeeded");
                contact.showNotificationOnPlans(results.entities);
            }
        },

        function (error) {
            Xrm.Navigation.openAlertDialog(error.message);
        });
};

contact.showNotificationOnPlans = function (planIds) {

    var today = new Date();
    var todayString = contact.formatDateTimeToUTCString(today, "23:59:59.99");
    var planIdFilter = "";

    for (var i = 0; i < planIds.length; ++i) {

        if (i === 0) {
            planIdFilter = planIdFilter + "_pbgc_planid_value eq " + planIds[i]._pbgc_planid_value
        }
        else {

            planIdFilter = planIdFilter + " or _pbgc_planid_value eq " + planIds[i]._pbgc_planid_value
        }
    }

    if (planIds.length > 1) {

        planIdFilter = "(" + planIdFilter + ")";
    }

    var selectStatement = "?$expand=pbgc_PlanId($select=pbgc_plannumber)&$filter=" + planIdFilter + " and statuscode eq 1 and pbgc_startdate le " + todayString + " and (pbgc_enddate eq null or pbgc_enddate le " + todayString + ")";
    //alert("showNotificationOnPlans.selectStatement = " + selectStatement);

    Xrm.WebApi.online.retrieveMultipleRecords("pbgc_customeralert", selectStatement).then(

        function success(results) {

            if (results.entities.length > 0) {

                var planList = "";

                for (var i = 0; i < results.entities.length; i++) {
                    planList = planList + results.entities[i].pbgc_PlanId["pbgc_plannumber"] + ", ";
                }

                planList = planList.trim().slice(0, -1);

                var message = "The following plan(s) have an alert: " + planList + ". Please review the plan(s) for important information.";
                FormContext.ui.setFormNotification(message, "WARNING", "alertNotification");
            }
        },

        function (error) {
            Xrm.Navigation.openAlertDialog(error.message);
        });
};

contact.formatDateTimeToUTCString = function (date, timeString) {
    var yearString = date.getFullYear().toString();
    var monthString = (date.getMonth() + 1 > 9 ? (date.getMonth() + 1).toString() : "0" + (date.getMonth() + 1).toString());
    var dateString = (date.getDate() > 9 ? date.getDate().toString() : "0" + date.getDate().toString());

    return yearString + "-" + monthString + "-" + dateString + "T" + timeString + "Z";
};