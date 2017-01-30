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

function addToUrl(newParams, replaceFlag) {
    var currentParams = (replaceFlag) ? "" : location.search
    window.history.pushState({}, '', currentParams + newParams)
}

function getUrlParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
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
    hoverMenuItem($(this));
}

function navItem_mouseleave() {
    unhoverMenuItem($(this));
}

var album_click = function () {

    if (SelectedAlbumId)
        unhoverMenuItem($selectedAlbumMenuItem(), true)
    hoverMenuItem($(this))

    SelectedAlbumId = parseAlbumId($(this))

    showAlbum(SelectedAlbumId);
    addToUrl("?album=" + SelectedAlbumId, true);
}

function hoverMenuItem($li) {
    var square = $li.find("div")
    var albumColor = square.css("background")

    $li.css("background", albumColor)
    $li.find("span").css("color", NavItem.hoverTextColor)
}

function unhoverMenuItem($li, force) {
    if (force || SelectedAlbumId != parseAlbumId($li)) {
        $li.css("background", NavItem.bgColor)
        $li.find("span").css("color", NavItem.textColor)
    }
}

function stickMenu() {
    var $navTitles = $Nav.find("span");
    var navPosition = $navTitles.offset().top;
    $(window).scroll(function () {
        if ($(window).scrollTop() >= navPosition - 21) {
            $Nav.addClass("stick")
            $Images.addClass("stick-top-fix")
        }
        else {
            $Nav.removeClass('stick')
            $Images.removeClass("stick-top-fix")
        }
    })
}

////////////////////////////////////////////////////
// VK Helpers
////////////////////////////////////////////////////

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

function updateAlbumPhotosHeight(albumId) {
    var album = Albums['id' + albumId];
    var height = album.options.height;
    GalleryConfig.rowHeight = (height) ? height : DefaultRowHeight
}

function parseAlbumId($selector) {
    return $selector.attr("id").substr(2);
}

////////////////////////////////////////////////////
// Content generators
////////////////////////////////////////////////////

function $selectedAlbumMenuItem() {
    return $Nav.find("#id" + SelectedAlbumId);
}

function showAlbumsNav(albumArray) {
    var $ul = $tag("ul")

    albumArray.forEach(function (album) {
        var color = getAlbumColor(album)

        var $title = $tag("span").text(album.title),
            $square = $tag("div", null, "background:" + color),
            $navItem = $tag("li", "id" + album.id, "border-color:" + color)

        $navItem.append($square, $title)

        $ul.append($navItem)
    })

    $Nav.append($ul)
}

function showAlbum(albumId) {
    if (albumId) Vk.loadAlbumPhotos(albumId, showAlbumPhotos);
}

function showAlbumPhotos(photos, album) {
    updateAlbumPhotosHeight(album.id)

    $Images.html('')

    photos.forEach(function (photo) {
        var photoSrc = getMaxPhotoSrc(photo)
        var photoTitle = getPhotoTitle(photo)

        var $link = $tag("a").attr({
                title: photoTitle,
                href: photoSrc
            }),
            $img = $tag("img").attr({
                alt: photoTitle,
                src: photoSrc
            })

        $link.append($img)

        if (album.options.canHasOutLinks) {
            var outLink = getOutLink(photo)
            if (outLink) {
                $link.addClass("out-link")
                $link.attr("href", outLink)
                $link.append($tag("div", null, "height: 100%").addClass("caption-mask"))
            }
        }

        $Images.append($link)
    })

    $Images.justifiedGallery(GalleryConfig)
        .on('jg.complete', function () {

            var $links = $(this).find('a');

            if (album.options.canHasOutLinks) {
                $links.filter(".out-link").colorbox(ColorboxOutlinkConfig)
                $links.not(".out-link").colorbox(ColorboxPhotosConfig)
            }
            else {
                $links.colorbox(ColorboxPhotosConfig);
            }
        });
}