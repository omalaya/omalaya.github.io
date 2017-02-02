/**
 * Created by Alex on 02.02.2017.
 */
$(function () {
    window.$Nav = $("#nav")
    window.$Images = $("#images")

    window.$Pages = $("#pages")
    window.$PagesNav = $Pages.find("nav")
    window.$PageWrap = $Pages.find(".page-text-wrap")
    window.$PageClose = $PageWrap.find(".page-text-wrap-close")
    window.$PageText = $PageWrap.find(".page-text")

    window.SelectedAlbumId = getUrlParameter("album")

    Vk.loadAlbums(function (albums) {
        showAlbumsNav(albums)

        if (SelectedAlbumId) {
            $selectedAlbumMenuItem().addClass("hover")
            showAlbum(SelectedAlbumId)
        }

        stickAlbumsNav()
        fixDesignAfterAsynk()
    })

    $PageClose.click(pageClose_click)

    Vk.loadPages(function () {
        showPagesNav()
        fixDesignAfterAsynk()
    })
})
