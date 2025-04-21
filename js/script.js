const USUARIO = "App";
const CONTRASENA = "Panama";

function verificarAcceso(e) {
  e.preventDefault();
  const u = document.getElementById("usuario").value;
  const p = document.getElementById("contrasena").value;

  if (u === USUARIO && p === CONTRASENA) {
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

// Manejar selección de días
document.querySelectorAll('.dia-option').forEach(option => {
  option.addEventListener('click', function() {
    const checkbox = this.querySelector('input[type="checkbox"]');
    checkbox.checked = !checkbox.checked;
    this.classList.toggle('selected', checkbox.checked);
    
    // Desmarcar "Todos" si se desmarca algún día
    if (!checkbox.checked && this.id !== "todos-dias") {
      document.getElementById("todos-dias").classList.remove("selected");
      document.getElementById("todos-dias").querySelector('input[type="checkbox"]').checked = false;
    }
  });
});

// Manejar botón "Todos" para días
document.getElementById("todos-dias").addEventListener("click", function() {
  const todosCheckbox = this.querySelector('input[type="checkbox"]');
  const isChecked = !todosCheckbox.checked;
  
  todosCheckbox.checked = isChecked;
  this.classList.toggle("selected", isChecked);
  
  // Seleccionar/deseleccionar todos los días
  document.querySelectorAll('.dia-option:not(#todos-dias)').forEach(option => {
    const checkbox = option.querySelector('input[type="checkbox"]');
    checkbox.checked = isChecked;
    option.classList.toggle("selected", isChecked);
  });
});

// Manejar selección de "Todas las anteriores" en redes sociales
document.querySelectorAll('.check-todas').forEach(todasCheckbox => {
  todasCheckbox.addEventListener('change', function() {
    const container = this.closest('.checkbox-group');
    const checkboxes = container.querySelectorAll('input[type="checkbox"]:not(.check-todas):not(.check-otro)');
    
    checkboxes.forEach(checkbox => {
      checkbox.checked = this.checked;
      const label = checkbox.closest('label');
      if (label) {
        label.classList.toggle('selected', this.checked);
      }
    });
    
    // Desmarcar "Otro" si está marcado
    const otroCheckbox = container.querySelector('.check-otro');
    if (otroCheckbox && otroCheckbox.checked) {
      otroCheckbox.checked = false;
      const otroLabel = otroCheckbox.closest('label');
      if (otroLabel) {
        otroLabel.classList.remove('selected');
      }
    }
  });
});

// Actualizar y mostrar coordenadas
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

window.onload = () => {
  if (localStorage.getItem("accesoPermitido") === "true") {
    document.getElementById("loginPopup").style.display = "none";
    document.getElementById("headerSesion").classList.remove("hidden");
    document.getElementById("formulario").classList.remove("hidden");
    actualizarCoordenadas();
  } else {
    document.getElementById("formulario").classList.add("hidden");
    document.getElementById("headerSesion").classList.add("hidden");
  }
}

// Mostrar campos "otro"
document.querySelectorAll(".select-con-otro").forEach(sel => sel.addEventListener("change", () => {
  const contenedor = sel.nextElementSibling;
  contenedor.classList.toggle("hidden", sel.value !== "otro");
  if (sel.value !== "otro") contenedor.querySelector("textarea").value = "";
}));

document.querySelectorAll(".check-otro").forEach(chk => chk.addEventListener("change", () => {
  const contenedor = chk.closest(".checkbox-group").nextElementSibling;
  contenedor.classList.toggle("hidden", !chk.checked);
  if (!chk.checked) contenedor.querySelector("textarea").value = "";
}));

// Envío del formulario
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
    await fetch("https://script.google.com/macros/s/AKfycbxhbpP6ChYkX0ZywFfRbyAz3AGHVW2vNYbP5I7QrVng0bgO-PTGWMLlDt8JGg4DKjKX/exec", {
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
