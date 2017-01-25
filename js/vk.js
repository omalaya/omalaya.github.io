/**
 * Created by Alex on 23.01.2017.
 */
var Vk = {};
Vk.call = function(methodName, args, callback) {
    $.ajax({
        url: 'https://api.vk.com/method/'+methodName+'?'+args+"&v=5.62",
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


Vk.showAlbum = function(groupId, albumId, $selector) {
    var args = "owner_id=-" + groupId + "&album_id=" + albumId;
    Vk.call("photos.get", args, function (data) {
        console.log(data)
        if (!data.response) return

        $selector.html('')
        data.response.items.forEach(function (photo) {
            var src = Vk.maxPhotoSrc(photo)
            $selector.append("<article><img src=\"" + src + "\" /></article>")
        })
    })
}