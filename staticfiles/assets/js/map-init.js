document.addEventListener("DOMContentLoaded", function () {
    map_cfg.mapWidth = 0;
    var map = new FlaMap(map_cfg);
    map.drawOnDomReady("map-container");

    document.querySelectorAll('a.fm-scale-plus, a.fm-scale-minus').forEach(link => {
        link.remove();
    });
});
