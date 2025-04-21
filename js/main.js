// Función para obtener coordenadas
function actualizarCoordenadas() {
  if (navigator.geolocation) {
    const success = position => {
      const lat = position.coords.latitude.toFixed(6);
      const lng = position.coords.longitude.toFixed(6);
      document.getElementById("coordenadas").value = `${lat},${lng}`;
      document.getElementById("coordenadas-texto").textContent = `Coordenadas GPS: ${lat}, ${lng}`;
    };
    
    const error = err => {
      console.error("Error obteniendo ubicación:", err);
      document.getElementById("coordenadas-texto").textContent = "No se pudo obtener la ubicación GPS";
    };
    
    navigator.geolocation.getCurrentPosition(success, error);
    navigator.geolocation.watchPosition(success, error);
  } else {
    document.getElementById("coordenadas-texto").textContent = "Geolocalización no soportada por este navegador";
  }
}

// Función para encriptar URL (solución básica)
function encriptarURL(url) {
  // En un entorno real, usarías un método más seguro
  return btoa(url);
}

// URL del endpoint (encriptada)
const URL_ENDPOINT = "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J4aGJwUDZDaFlrWDBaeXdGZlJieUF6M0FHSFZXMnZOWWJQNUk3UXJWbmcwYmdPLVBUR3dNTGxEdDhKR2c0REtrS1gvZXhlYw==";

// Envío del formulario
function setupFormSubmit() {
  document.getElementById("formulario").addEventListener("submit", async function (e) {
    e.preventDefault();
    
    // Mostrar loader o feedback visual
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    try {
      const form = new FormData(this);
      form.set("funcionalidades", [...document.querySelectorAll('input[name="funcionalidades"]:checked:not(.check-todas)')].map(i => i.value).join(', '));
      form.set("redes", [...document.querySelectorAll('input[name="redes"]:checked:not(.check-todas)')].map(i => i.value).join(', '));
      form.set("dias", [...document.querySelectorAll('input[name="dias[]"]:checked')].map(i => i.value).join(', '));

      const data = Object.fromEntries(form);
      const endpoint = atob(URL_ENDPOINT);
      
      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      // Mostrar mensaje de éxito
      alert("¡Gracias! Tu información ha sido enviada correctamente.");
      this.reset();
      
      // Resetear días seleccionados
      document.querySelectorAll('.dia-option').forEach(option => {
        option.classList.remove('selected');
        option.querySelector('input[type="checkbox"]').checked = false;
      });
      
      // Actualizar coordenadas nuevamente
      actualizarCoordenadas();
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert("Hubo un error al enviar el formulario. Por favor intente nuevamente.");
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

// Inicialización principal
document.addEventListener('DOMContentLoaded', () => {
  initFormHandlers();
  setupFormSubmit();
});
