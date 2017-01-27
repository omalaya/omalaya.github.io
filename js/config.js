const DefaultGroupId = "138622410"
var GroupId = '-' + DefaultGroupId

var DefaultAlbumColor = "#757575"

var NavItem = {
    bgColor: "#fff",
    textColor: "#111",
    hoverTextColor: "#fff"
}

var Albums = null

var DefaultRowHeight = 150,
    GalleryConfig = {
        rowHeight: DefaultRowHeight,
        maxHeight: $(window).height(),
        rel: 'gallery1',
        lastRow: 'nojustify',
        margins: 10
    }

var ColorboxConfig = {
    maxWidth: '95%',
    maxHeight: '90%',
    opacity: 0.9,
    transition: 'elastic',
    current: ''
}
