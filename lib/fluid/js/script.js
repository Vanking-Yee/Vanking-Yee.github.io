// Fluid 主题移动端菜单切换功能
(function() {
    var toggler = document.getElementById('navbar-toggler-btn');
    var menu = document.getElementById('navbarSupportedContent');

    if (toggler && menu) {
        toggler.addEventListener('click', function() {
            if (menu.classList.contains('show')) {
                menu.classList.remove('show');
            } else {
                menu.classList.add('show');
            }
        });
    }
})();