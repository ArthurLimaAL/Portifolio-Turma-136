const modal = document.getElementById("modal-galeria");
const imgAmpliada = document.getElementById("img-ampliada");
const fechar = document.querySelector(".fechar-modal");
const fotos = document.querySelectorAll(".galeria-item img");

fotos.forEach(foto => {
    foto.addEventListener("click", function () {
        modal.style.display = "flex";
        imgAmpliada.src = this.src;
    });
});

fechar.addEventListener("click", function () {
    modal.style.display = "none";
});

modal.addEventListener("click", function (e) {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});