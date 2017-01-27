/**
 * Created by Alex on 23.01.2017.
 */
var Vk = {};
Vk.call = function (methodName, args, callback) {
    $.ajax({
        url: 'https://api.vk.com/method/' + methodName + '?' + args + "&v=5.62",
        type: 'GET',
        dataType: 'jsonp',
        crossDomain: true,
        success: callback
    });
}

Vk.clearId = function (possibleId) {
    if (!possibleId) return 0;

    // remove first '-' symbol
    possibleId = (possibleId[0] == '-') ? possibleId.substr(1) : possibleId;
    possibleId = possibleId.trim()

    var isInt = possibleId === parseInt(possibleId, 10)
    if (isInt) return possibleId;

    return possibleId;
}

Vk.maxPhotoSrc = function (photoObj) {
    if (photoObj.photo_2560) return photoObj.photo_2560
    if (photoObj.photo_1280) return photoObj.photo_1280
    if (photoObj.photo_807) return photoObj.photo_807
    if (photoObj.photo_604) return photoObj.photo_604
    if (photoObj.photo_130) return photoObj.photo_130
    if (photoObj.photo_75) return photoObj.photo_75
    return null
}

Vk.albumBgColor = function (album) {
    var descrArgs = album.description.split("\n")
    var bgColor = descrArgs[0]
    if (bgColor[0] = '#')
        return bgColor
    else
        return "#757575"
}

Vk.updateAlbumPhotoHeight = function (id) {
    var album = Albums['id' + id];
    var descriptionArgs = album.description.split("\n")

    var heightArg = descriptionArgs[1] || '';
    var hasHeight = heightArg.indexOf("height") !== -1

    if (hasHeight) {
        var heightVal = heightArg.split("height")[1];
        galleryConfig.rowHeight = parseInt(heightVal || galleryConfig_defaultHeight)
    }
    else
        galleryConfig.rowHeight = galleryConfig_defaultHeight

}

Vk.showAlbumsNav = function (groupId, $selector) {
    Vk.call("photos.getAlbums", "owner_id=" + groupId, function (data) {
        if (!data.response) return
        var albums = Albums = data.response.items

        console.log("Nav:")
        console.log(albums)

        $selector.append("<ul>")

        albums.forEach(function (album) {
            Albums['id' + album.id] = album
            var bgColor = Vk.albumBgColor(album)
            $selector.append("<li style='border-color:" + bgColor + "' data-id=\"" + album.id + "\"><div style='background: " + bgColor + "'></div><span>" + album.title + "</span></li>")
        })

        $selector.append("</ul>")
    })
}

Vk.showAlbum = function (groupId, albumId, $selector) {
    var args = "owner_id=" + groupId + "&album_id=" + albumId;
    Vk.call("photos.get", args, function (data) {
        if (!data.response) return

        $selector.html('')
        data.response.items.forEach(function (photo) {
            var src = Vk.maxPhotoSrc(photo)
            var element = "<a title='" + photo.text + "' href='" + src + "'><img alt='" + photo.text + "'  src=\"" + src + "\" /></a>";

            if ($selector.html() == '')
                $selector.append(element)
            else
                $selector.children().last().after(element)
        })

        $selector.justifiedGallery(galleryConfig)
            .on('jg.complete', function () {
                $(this).find('a').colorbox(colorboxConfig);
            });
    })
}