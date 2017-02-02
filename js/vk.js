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

Vk.loadAlbums = function (callback) {
    Vk.call("photos.getAlbums", "owner_id=" + GroupId, function (data) {
        if (!data.response) return
        var albumArray = data.response.items;

        Albums = {}
        Albums.thumbArray = []

        albumArray.forEach(function (album) {
            var key = 'id' + album.id;

            Albums[key] = album

            Albums.thumbArray.push(GroupId + "_" + album.thumb_id)

            Albums[key].options = {
                height: getAlbumDescriptionArg(album, AlbumArg.HEIGHT),
                canHasOutLinks: albumHasDescriptionArg(album, AlbumArg.HAS_LINKS),
                order: getAlbumDescriptionArg(album, AlbumArg.ORDER) || albumArray.length
            }
        })

        if (callback)
            callback(albumArray)
    })
}

Vk.loadAlbumPhotos = function (albumId, callback) {
    var methodArgs =
        "owner_id=" + GroupId + "&" +
        "album_id=" + albumId

    Vk.call("photos.get", methodArgs, function (data) {
        if (!data.response) return

        var photos = data.response.items,
            album = Albums['id' + albumId];

        if (callback)
            callback(photos, album)
    })
}

Vk.loadAlbumsThumbPhotos = function (callback) {
    var methodArgs = "photos=" + Albums.thumbArray.toString()

    Vk.call("photos.getById", methodArgs, function (data) {
        if (!data.response) return

        var photos = data.response

        if (callback)
            callback(photos)
    })
}

Vk.loadPages = function (callback) {

    var methodArgs = "owner_id=" + GroupId + "&count=100"

    Vk.call("wall.get", methodArgs, function (data) {
        if (!data.response) return

        Pages = []

        var wallPosts = data.response.items;

        wallPosts.forEach(function (post, i) {
            if (post.text.startsWith("page")) {
                var firstBr = post.text.indexOf("\n")
                firstBr = (firstBr < 0) ? post.text.length : firstBr

                var pageTitle = post.text.substr(0, firstBr).strAfter("page")
                var pageText = post.text.substr(firstBr)

                Pages.push({
                    id: i,
                    title: pageTitle,
                    text: pageText,
                    isAnalyzed: false
                })
            }
        })

        if (callback)
            callback()
    })
}