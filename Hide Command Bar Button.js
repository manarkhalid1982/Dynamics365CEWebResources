//Not working yet 5/29/2024
function hideResolvedCase() {
debugger;
var ItemList = document.getElementById("mnuBar1").rows[0].cells[0].getElementsByTagName("UL")[0].getElementsByTagName("LI");
for(var i=0; i<ItemList.length-1; i++)
{var str=ItemList[i].id;
if(str.match("Mscrm.Form.incident.Resolve60"))
{ItemList[i].style.display = "none";
break;}}
}
