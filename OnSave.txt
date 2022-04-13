function Form_OnSave(execObj) {

    var saveMode = execObj.getEventArgs().getSaveMode();
    var alertOptions = { height: 120, width: 260 };
    var alertStrings = { confirmButtonLabel: "Yes", text: "Manual Old Save" };
    if (saveMode === 1) {

        Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
          function success(result) {
              console.log("Alert dialog closed");
          },
          function (error) {
              concole.log(error.message);
          }
      );
    }

    if (saveMode === 2) {
        alertStrings = { confirmButtonLabel: "Yes", text: "Save and Close" };
        Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
            function success(result) {
                console.log("Alert dialog closed");
            },
            function (error) {
                concole.log(error.message);
            }
        );
    }

    if (saveMode === 70) {
        Xrm.Utility.alertDialog("Auto Save");
        alertStrings = { confirmButtonLabel: "Yes", text: "Auto Save" };
        Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
            function success(result) {
                console.log("Alert dialog closed");
            },
            function (error) {
                concole.log(error.message);
            }
        );
        execObj.getEventArgs().preventDefault();
    }

}

