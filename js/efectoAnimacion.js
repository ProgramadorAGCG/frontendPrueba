window.addEventListener('load', (e) => {
    menuResponsive();
    filtroTablaTrabajadores();
});

function menuResponsive() {
    const btnMenu = document.getElementById('btnMenu');
    const menu = document.getElementById('sidenav');
    btnMenu.addEventListener('click', (e) => {
        menu.classList.toggle("responsive");
    });
}

function filtroTablaTrabajadores() {
    $(document).ready(function () {
        $("#inputTrabajador").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $("#tablaTrabajadores tr").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
    });
}