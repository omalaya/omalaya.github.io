const GROUP_ID = "138622410"
const MAIN_ALBUM_ID = "227509359"

var galleryConfig_defaultHeight = 150
var galleryConfig = {
    rowHeight : galleryConfig_defaultHeight,
    maxHeight: $(window).height(),
    rel : 'gallery1',
    lastRow : 'nojustify',
    margins : 10
}

var colorboxConfig = {
    maxWidth : '95%',
    maxHeight : '90%',
    opacity : 0.9,
    transition : 'elastic',
    current : ''
}

var Albums = null