/* eslint-disable */

import LiteralListTypes from "./LiteralListTypes";

const literalListTypes = new LiteralListTypes();

literalListTypes.literalTypes["Align"] = ["left","center","right","none"];
literalListTypes.literalTypes["VerticalAlign"] = ["top","middle","bottom","none"];
literalListTypes.literalTypes["FontWeight"] = ["normal","bold","bolder","lighter","100","200","300","400","500","600","700","800","900"];
literalListTypes.literalTypes["HorizontalCenter"] = ["none","left","middle","right"];
literalListTypes.literalTypes["ContainerLayout"] = ["absolute","vertical","horizontal","grid","none"];
literalListTypes.literalTypes["Roles"] = ["alert","alertdialog","application","article","banner","button","checkbox","columnheader","combobox","command","complementary","composite","contentinfo","definition","dialog","directory","document","form","figure","grid","gridcell","group","heading","img","input","landmark","link","list","listbox","listitem","log","main","marquee","math","menu","menubar","menuitem","menuitemcheckbox","menuitemradio","navigation","none","note","option","presentation","progressbar","radio","radiogroup","range","region","roletype","row","rowgroup","rowheader","scrollbar","search","section","sectionhead","select","separator","slider","spinbutton","status","structure","switch","tab","tablist","tabpanel","textbox","timer","toolbar","tooltip","tree","treegrid","treeitem","widget","window"];
literalListTypes.literalTypes["ShapeRendering"] = ["auto","optimizeSpeed","crispEdges","geometricPrecision","inherit"];
literalListTypes.literalTypes["TextDecoration"] = ["none","underline","overline","line-through","blink"];
literalListTypes.literalTypes["VerticalCenter"] = ["none","top","middle","bottom"];
literalListTypes.literalTypes["TextAlign"] = ["start","end","middle"];
literalListTypes.literalTypes["Orientation"] = ["horizontal","vertical"];
literalListTypes.literalTypes["TimeUnit"] = ["millisecond","second","minute","hour","day","week","month","year"];
literalListTypes.literalTypes["LegendPosition"] = ["left","right","top","bottom","absolute"];
literalListTypes.literalTypes["PointerOrientation"] = ["horizontal","vertical","left","right","up","down"];
literalListTypes.literalTypes["AriaLive"] = ["off","polite","assertive"];
literalListTypes.literalTypes["CalculatedValue"] = ["value","percent","change","changePercent","startChangePercent","startChange","previousChangePercent","previousChange","sum","absoluteSum","average","open","close","low","high","count","total","totalPercent","stack"];

export default literalListTypes;
