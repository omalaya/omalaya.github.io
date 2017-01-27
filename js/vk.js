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

Vk.showAlbumsNav = function (groupId, $selector) {
    Vk.call("photos.getAlbums", "owner_id=" + groupId, function (data) {
        if (!data.response) return
        console.log("Nav:")
        console.log(data)

        $selector.append("<ul>")
        data.response.items.forEach(function (album) {
            var bgColor = (album.description) ? album.description : "#757575"
            $selector.append("<li style='border-color:"+bgColor+"' data-id=\"" + album.id + "\"><div style='background: "+bgColor+"'></div><span>"+album.title + "</span></li>")
        })
        $selector.append("</ul>")
    })
}

Vk.showAlbum = function (groupId, albumId, $selector) {
    var args = "owner_id=" + groupId + "&album_id=" + albumId;
    Vk.call("photos.get", args, function (data) {
        console.log(data)
        if (!data.response) return

        $selector.html('')
        data.response.items.forEach(function (photo) {
            var src = Vk.maxPhotoSrc(photo)
            var element = "<a href='" + src + "'><img  src=\"" + src + "\" /></a>";

            if ($selector.html() == '')
                $selector.append(element)
            else
                $selector.children().last().after(element)
        })

        $selector.justifiedGallery({
            rowHeight : 150,
            maxHeight: $(window).height(),
            rel : 'gallery1',
            lastRow : 'nojustify',
            margins : 10
        }).on('jg.complete', function () {
            $(this).find('a').colorbox({
                maxWidth : '95%',
                maxHeight : '95%',
                opacity : 0.9,
                transition : 'elastic',
                current : ''
            });
        });
    })
}