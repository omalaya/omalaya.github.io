const DefaultGroupId = "138622410"
var GroupId = '-' + DefaultGroupId

var DefaultAlbumColor = "#757575"

var AlbumArg = {
    HEIGHT: "height",
    HAS_LINKS: "has links",
    ORDER: "order"
}

var PageArg = {
    ID: "id",
    STYLE_URL : "style url",
    TYPOGRAPHY: "typography"
}

var NavItem = {
    bgColor: "#fff",
    textColor: "#111",
    hoverTextColor: "#fff"
}

var Albums = null
var Pages = null

var DefaultRowHeight = 150,
    GalleryConfig = {
        rowHeight: DefaultRowHeight,
        maxHeight: $(window).height(),
        rel: 'gallery',
        lastRow: 'nojustify',
        margins: 10
    }

var ColorboxPhotosConfig = {
    maxWidth: '95%',
    maxHeight: '90%',
    opacity: 0.9,
    transition: 'elastic',
    current: ''
}, ColorboxOutlinkConfig = {
    iframe: true,
    innerWidth: "80%",
    innerHeight: "85%",
    current: ''
}