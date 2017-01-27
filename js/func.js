/**
 * Created by Alex on 27.01.2017.
 */
////////////////////////////////////////////////////
// General Helpers
////////////////////////////////////////////////////

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

function maxPhotoSrc(photoObj) {
    if (photoObj.photo_2560) return photoObj.photo_2560
    if (photoObj.photo_1280) return photoObj.photo_1280
    if (photoObj.photo_807) return photoObj.photo_807
    if (photoObj.photo_604) return photoObj.photo_604
    if (photoObj.photo_130) return photoObj.photo_130
    if (photoObj.photo_75) return photoObj.photo_75
    return null
}

function albumColor(album) {
    var descriptionArgs = album.description.split("\n")
    var bgColor = descriptionArgs[0]

    return (bgColor[0] == '#') ? bgColor : DefaultAlbumColor
}

function updateAlbumPhotoHeight(albumId) {
    var album = Albums['id' + albumId];
    var descriptionArgs = album.description.split("\n")

    var heightArg = descriptionArgs[1] || '';
    var isHeightSet = heightArg.indexOf("height") !== -1

    if (isHeightSet) {
        var heightVal = heightArg.split("height")[1];
        GalleryConfig.rowHeight = parseInt(heightVal || DefaultRowHeight)
    }
    else {
        GalleryConfig.rowHeight = DefaultRowHeight
    }
}
