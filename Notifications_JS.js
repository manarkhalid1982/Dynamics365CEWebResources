/js/Notifications.js

function SetFormNotification() {
    
        var showFormNotification = Xrm.Page.getAttribute("dev_showformnotification").getValue();
    
        if (showFormNotification === true) {
            Xrm.Page.ui.setFormNotification("Hello welcome to D365 Extending Training", "INFO", "123456");
        } else {
            Xrm.Page.ui.clearFormNotification("123456");
        }
    
    }
    
    function SetFieldNotification() {
    
        var showFieldNotification = Xrm.Page.getAttribute("dev_showfieldnotification").getValue();
    
        if (showFieldNotification === true) {
            Xrm.Page.getControl("dev_testfield").setNotification("Error!", "987654");
            var newValue = "Throw an Error";
            Xrm.Page.getAttribute("dev_testfield").setValue(newValue);
        } else {
            Xrm.Page.getControl("dev_testfield").clearNotification("987654");
            var newValue = "Clear the Error";
            Xrm.Page.getAttribute("dev_testfield").setValue(newValue);
        }
    
    }
