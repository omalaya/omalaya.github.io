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
                height: getAlbumDescriptionArg(album, Arg.HEIGHT),
                canHasOutLinks: albumHasDescriptionArg(album, Arg.HAS_LINKS)
            }
        })

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

        callback(photos, album)
    })
}

Vk.loadAlbumsThumbPhotos = function (callback) {
    var methodArgs = "photos=" + Albums.thumbArray.toString()

    Vk.call("photos.getById", methodArgs, function (data) {
        if (!data.response) return

        var photos = data.response

        callback(photos)
    })
}