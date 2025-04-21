// Datos de acceso (en un proyecto real esto debería estar en el backend)
const CREDENCIALES = {
  usuario: "App",
  contrasena: "Panama"
};

function verificarAcceso(e) {
  e.preventDefault();
  const u = document.getElementById("usuario").value;
  const p = document.getElementById("contrasena").value;

  if (u === CREDENCIALES.usuario && p === CREDENCIALES.contrasena) {
    localStorage.setItem("accesoPermitido", "true");
    document.getElementById("loginPopup").style.display = "none";
    document.getElementById("headerSesion").classList.remove("hidden");
    document.getElementById("formulario").classList.remove("hidden");
    actualizarCoordenadas();
  } else {
    alert("Credenciales incorrectas. Por favor intente nuevamente.");
  }
}

function cerrarSesion() {
  localStorage.removeItem("accesoPermitido");
  document.getElementById("formulario").classList.add("hidden");
  document.getElementById("headerSesion").classList.add("hidden");
  document.getElementById("loginPopup").style.display = "flex";
  // Limpiar campos de login
  document.getElementById("usuario").value = "";
  document.getElementById("contrasena").value = "";
}

// Verificar acceso al cargar
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem("accesoPermitido") === "true") {
    document.getElementById("loginPopup").style.display = "none";
    document.getElementById("headerSesion").classList.remove("hidden");
    document.getElementById("formulario").classList.remove("hidden");
    actualizarCoordenadas();
  } else {
    document.getElementById("formulario").classList.add("hidden");
    document.getElementById("headerSesion").classList.add("hidden");
  }
});
