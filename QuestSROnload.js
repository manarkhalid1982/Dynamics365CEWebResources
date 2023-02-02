function hideSectionPinCodeSr(){


    if  (Xrm.Page.getAttribute("pbgc_servicerequesttypeid").getValue() != null){
    
    var RequestId = Xrm.Page.getAttribute("pbgc_servicerequesttypeid").getValue()[0].id;
    var RequestName = Xrm.Page.getAttribute("pbgc_servicerequesttypeid").getValue()[0].name;
    var RequestType = Xrm.Page.getAttribute("pbgc_servicerequesttypeid").getValue()[0].entityType;
    
    }
    
    if (RequestName == "PIN Code"){
    
    
    Xrm.Page.ui.tabs.get("tab_main").sections.get("PIN_Code_SR_Display").setVisible(true);
    }
    
    else {
    Xrm.Page.ui.tabs.get("tab_main").sections.get("PIN_Code_SR_Display").setVisible(false);
    
    }
    }
    
    
    
    