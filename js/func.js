/**
 * Created by Alex on 27.01.2017.
 */
////////////////////////////////////////////////////
// General Helpers
////////////////////////////////////////////////////

String.prototype.startsWith = function (startStr) {
    return startStr == this.substr(0, startStr.length);
}

String.prototype.strAfter = function (startStr) {
    return this.substr(startStr.length).trim()
}

String.prototype.getLineStartsWith = function (startStr) {
    var result = null
    var lines = this.split("\n")
    lines.some(function (line) {
        if (line.startsWith(startStr)) {
            result = line.trim()
            return true
        }
    })
    return result
}

function appendHtml($selector, text) {
    if ($selector.html() == '')
        $selector.append(text)
    else
        $selector.children().last().after(text)
}

function $tag(tag, id, css) {
    var element = document.createElement(tag);
    if (id) element.id = id;
    if (css) element.style.cssText = css;
    return $(element);
}

////////////////////////////////////////////////////
// Events
////////////////////////////////////////////////////

function navItem_mouseenter() {
    var square = $(this).find("div")
    var albumColor = square.css("background")

    $(this).css("background", albumColor)
    $(this).find("span").css("color", NavItem.hoverTextColor)
}

function navItem_mouseleave() {
    $(this).css("background", NavItem.bgColor)
    $(this).find("span").css("color", NavItem.textColor)
}

var album_click = function () {
    var selectedAlbumId = $(this).attr("id").substr(2)
    updateAlbumPhotoHeight(selectedAlbumId)
    Vk.showAlbum(GroupId, selectedAlbumId, $Images);
}

////////////////////////////////////////////////////
// VK Helpers
////////////////////////////////////////////////////

function clearId(possibleId) {
    if (!possibleId) return 0;

    // remove first '-' symbol
    possibleId = (possibleId[0] == '-') ? possibleId.substr(1) : possibleId;
    possibleId = possibleId.trim()

    var isInt = possibleId === parseInt(possibleId, 10)
    if (isInt) return possibleId;

    return possibleId;
}

function getMaxPhotoSrc(photoObj) {
    if (photoObj.photo_2560) return photoObj.photo_2560
    if (photoObj.photo_1280) return photoObj.photo_1280
    if (photoObj.photo_807) return photoObj.photo_807
    if (photoObj.photo_604) return photoObj.photo_604
    if (photoObj.photo_130) return photoObj.photo_130
    if (photoObj.photo_75) return photoObj.photo_75
    return null
}

function getAlbumColor(album) {
    var descriptionArgs = album.description.split("\n")
    var bgColor = descriptionArgs[0]

    return (bgColor[0] == '#') ? bgColor : DefaultAlbumColor
}

function getPhotoTitle(photo) {
    var title = photo.text.split("\n")[0];
    var isUrl = title.startsWith("http");
    return (isUrl) ? "" : title
}

function getOutLink(photo) {
    return photo.text.getLineStartsWith("http")
}

function albumHasDescriptionArg(album, arg) {
    var argValue = getAlbumDescriptionArg(album, arg);
    return argValue !== null
}

function getAlbumDescriptionArg(album, argName) {
    var argLine = album.description.getLineStartsWith(argName);
    var argValue = (argLine === null) ? null : argLine.strAfter(argName);
    return argValue
}

function updateAlbumPhotoHeight(albumId) {
    var album = Albums['id' + albumId];
    var height = getAlbumDescriptionArg(album, Arg.HEIGHT)
    GalleryConfig.rowHeight = (height) ? height : DefaultRowHeight
}