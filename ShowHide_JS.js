/js/ShowHide.js

function ShowHideField() {

    if (Xrm.Page.getControl("d365u_showhide").getVisible()) {
        Xrm.Page.getControl("d365u_showhide").setVisible(false);
    } else {
        Xrm.Page.getControl("d365u_showhide").setVisible(true);
    }

}

function ShowHideTab() {

    if (Xrm.Page.ui.tabs.get("HideTab").getVisible()) {
        Xrm.Page.ui.tabs.get("HideTab").setVisible(false);
    } else {
        Xrm.Page.ui.tabs.get("HideTab").setVisible(true);
    }

}

function ShowHideSection() {

    if (Xrm.Page.ui.tabs.get("HideTab").sections.get("HideSection").getVisible()) {
        Xrm.Page.ui.tabs.get("HideTab").sections.get("HideSection").setVisible(false);
    } else {
        Xrm.Page.ui.tabs.get("HideTab").sections.get("HideSection").setVisible(true);
    }

}
