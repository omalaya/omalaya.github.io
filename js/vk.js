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


Vk.showAlbumsNav = function (groupId, $nav) {
    Vk.call("photos.getAlbums", "owner_id=" + groupId, function (data) {
        if (!data.response) return
        var albums = Albums = data.response.items

        $ul = $tag("ul")

        albums.forEach(function (album) {
            Albums['id' + album.id] = album
            var color = albumColor(album)

            var $title = $tag("span").text(album.title),
                $square = $tag("div", null, "background:" + color),
                $navItem = $tag("li", "id" + album.id, "border-color:" + color)

            $navItem.append($square, $title)

            $ul.append($navItem)
        })

        $nav.append($ul)
    })
}

Vk.showAlbum = function (groupId, albumId, $album) {
    var method = "photos.get",
        args =
            "owner_id=" + groupId + "&" +
            "album_id=" + albumId

    Vk.call(method, args, function (data) {
        if (!data.response) return

        $album.html('')

        data.response.items.forEach(function (photo) {
            var photoSrc = maxPhotoSrc(photo)

            var $link = $tag("a").attr({
                    title: photo.text,
                    href: photoSrc
                }),
                $img = $tag("img").attr({
                    alt: photo.text,
                    src: photoSrc
                })

            $link.append($img)

            $album.append($link)
        })

        $album.justifiedGallery(GalleryConfig)
            .on('jg.complete', function () {
                $(this).find('a').colorbox(ColorboxConfig);
            });
    })
}