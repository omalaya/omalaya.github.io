/**
 * Created by Alex on 27.01.2017.
 */
////////////////////////////////////////////////////
// Actions
////////////////////////////////////////////////////

function stickAlbumsNav() {
    var $w = $(window)
    initStartStickAlbumsNavPosition()

    $w.scroll(function () {
        if ($w.scrollTop() >= StartStickAlbumsNavPosition) {
            $Nav.addClass("stick")
            $Images.addClass("stick-top-fix")
        }
        else {
            $Nav.removeClass('stick')
            $Images.removeClass("stick-top-fix")
        }
    })
}

function initStartStickAlbumsNavPosition() {
    var offset = $Nav.find("span").offset()
    if (offset)
        StartStickAlbumsNavPosition = offset.top - 21
}

function fixDesignAfterAsynk() {
    initStartStickAlbumsNavPosition()
}

////////////////////////////////////////////////////
// Markdown
////////////////////////////////////////////////////

function convertMd(mdText, callback) {
    $.ajax({
        type: "POST",
        dataType: "html",
        processData: false,
        url: "https://api.github.com/markdown/raw",
        data: mdText,
        contentType: "text/plain",
        success: callback,
        error: function (jqXHR, textStatus, error) {
            console.warn(jqXHR, textStatus, error);
        }
    });
}

function fixStartSpaces(str) {
    var dotCount = 0
    while (dotCount < str.length && str[dotCount] == '.')
        dotCount++
    return new Array(dotCount + 1).join(" ") + str.substr(dotCount, str.length)
}

////////////////////////////////////////////////////
// Event handlers
////////////////////////////////////////////////////

var album_click = function () {

    if (SelectedAlbumId)
        $selectedAlbumMenuItem().removeClass("hover")
    $(this).addClass("hover")

    SelectedAlbumId = $parseId($(this))

    showAlbum(SelectedAlbumId);
    addToUrl("?album=" + SelectedAlbumId, true);
}

function pageButton_click() {
    var pageId = $parseId($(this))
    var page = Pages[pageId];

    analyzePage(pageId);

    convertMd(page.text, function (html) {
        $PageText.html("")

        if (page.options.styleUrl) {
            loadCss(page.options.styleUrl)
        }

        if (page.options.typography == 'false')
            $PageText.removeClass("typography")
        else
            $PageText.addClass("typography")

        if (page.options.id) {
            $PageText.append(
                $tag("div", page.options.id).append(html)
            )
        } else {
            $PageText.html(html)
        }

        $PageWrap.addClass("open")
    })
}

function pageClose_click() {
    $PageWrap.removeClass("open")
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

function getPhotoSrc(photoObj, size) {
    if (size > 1280 && photoObj.photo_2560) return photoObj.photo_2560
    if (size > 807 && size <= 1280 && photoObj.photo_1280) return photoObj.photo_1280
    if (size > 604 && size <= 807 && photoObj.photo_807) return photoObj.photo_807
    if (size > 130 && size <= 604 && photoObj.photo_604) return photoObj.photo_604
    if (size > 75 && size <= 130 && photoObj.photo_130) return photoObj.photo_130
    if (size <= 75 && photoObj.photo_75) return photoObj.photo_75
    return null
}

function getAlbumColor(album) {
    var descriptionArgs = album.description.split("\n")
    var bgColor = descriptionArgs[0]

    return (bgColor[0] == '#') ? bgColor : DefaultAlbumColor
}

function getPhotoTitle(photo) {
    var title = photo.text.split("\n")[0]
    var isUrl = title.startsWith("http")
    return (isUrl) ? "" : title
}

function getPhotoTextOutLink(photo) {
    return photo.text.getLineStartsWith("http")
}

function getAlbumDescriptionArg(album, argName) {
    var argLine = album.description.getLineStartsWith(argName)
    var argValue = (argLine === null) ? null : argLine.strAfter(argName)
    return argValue
}

function albumHasDescriptionArg(album, arg) {
    var argValue = getAlbumDescriptionArg(album, arg)
    return argValue !== null
}

function updateAlbumPhotosHeight(albumId) {
    var album = Albums['id' + albumId]
    var height = album.options.height
    GalleryConfig.rowHeight = (height) ? height : DefaultRowHeight
}

function analyzePage(pageId) {
    var page = Pages[pageId]

    if (page.isAnalyzed)
        return

    var lines = page.text.split("\n")

    page.options = {}
    var lastOptionLineIndex = -1
    var tryToSearchOptions = true

    // Parse page Params
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i]
        if (tryToSearchOptions) {
            if (line.startsWith(PageArg.ID)) {
                page.options.id = line.strAfter(PageArg.ID)
                lastOptionLineIndex = i
                continue
            }
            if (line.startsWith(PageArg.STYLE_URL)) {
                page.options.styleUrl = line.strAfter(PageArg.STYLE_URL)
                lastOptionLineIndex = i
                continue
            }
            if (line.startsWith(PageArg.TYPOGRAPHY)) {
                page.options.typography = line.strAfter(PageArg.TYPOGRAPHY)
                lastOptionLineIndex = i
                continue
            }
            if (line.startsWith("text")) {
                lastOptionLineIndex = i
                tryToSearchOptions = false
                continue
            }
        }
        // Fix spaces
        lines[i] = fixStartSpaces(line)
    }

    // Save page text
    if (lastOptionLineIndex > 0 && (lastOptionLineIndex + 1) < lines.length)
        page.text = lines.slice(lastOptionLineIndex + 1).join("\n")
    else
        page.text = lines.join("\n")

    page.isAnalyzed = true
}

////////////////////////////////////////////////////
// Content
////////////////////////////////////////////////////

function $selectedAlbumMenuItem() {
    return $Nav.find("#id" + SelectedAlbumId)
}

function showAlbumsNav(albumsArray) {
    var $ul = $tag("ul")

    // Sort by order
    albumsArray.sort(function (a, b) {
        return (a.options.order - b.options.order) || 0
    })

    albumsArray.forEach(function (album) {
        var color = getAlbumColor(album)

        var $title = $tag("span").text(album.title),
            $square = $tag("div", null, "background:" + color),
            $navItem = $tag("li", "id" + album.id,
                "border-color:" + color + ";background:" + color)

        $ul.append(
            $navItem.append(
                $tag("div").append($square, $title)
            ))
    })

    $Nav.append($ul)

    // $Nav.on("mouseenter", "li", navItem_mouseenter)
    // $Nav.on("mouseleave", "li", navItem_mouseleave)
    $Nav.on("click", "li", album_click)
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
            var outLink = getPhotoTextOutLink(photo)
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

function showSlider() {
    Vk.loadAlbumsThumbPhotos(function (photos) {
        var $slider = $tag("div")
        var $ul = $tag("ul").addClass("bxslider")

        photos.forEach(function (photo) {
            $ul.append(
                $tag("li").append(
                    $tag("img").attr("src", getPhotoSrc(photo, 500))
                )
            )
        })

        $Images.append(
            $slider.append($ul)
        )
    })
}

function showPagesNav() {
    Pages.forEach(function (page) {
        $PagesNav.append(
            $tag("button")
                .text(page.title)
                .attr("id", "id" + page.id)
        )
    })

    $PagesNav.on("click", "button", pageButton_click)
}