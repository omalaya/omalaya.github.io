const DefaultGroupId = "138622410"
var GroupId = '-' + DefaultGroupId
var AccessToken = "e9e2f138e9e2f138e9e2f138d7e9b03dc5ee9e2e9e2f138b0428fcd6089e02f4836e7f0"

var DefaultAlbumColor = "#757575"

var AlbumArg = {
    HEIGHT: "height",
    HAS_LINKS: "has links",
    ORDER: "order"
}

var PageArg = {
    ID: "id",
    IMPORT_CSS : "import css",
    IMPORT_HTML : "import html",
    TYPOGRAPHY: "typography",
    VAR_START: "!!",
    VAR_END: "!!/"
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