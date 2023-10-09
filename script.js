document.addEventListener("DOMContentLoaded", async function () {
  const botones = document.querySelectorAll(".boton button");
  const paginado = document.querySelector(".paginado");
  let paginaActual = 1;

  async function cargarProyectos() {
    try {
      const response = await fetch("https://my-json-server.typicode.com/flaviosalas/jdata/proyectos");
      if (!response.ok) {
        throw new Error("No se pudo cargar la información de proyectos.");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al cargar los proyectos:", error.message);
      return [];
    }
  }

  async function cargarCertificados() {
    try {
      const response = await fetch("https://my-json-server.typicode.com/flaviosalas/jdata/certificados");
      if (!response.ok) {
        throw new Error("No se pudo cargar la información de certificados.");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al cargar los certificados:", error.message);
      return [];
    }
  }

  async function cargarExperiencia() {
    try {
      const response = await fetch("https://my-json-server.typicode.com/flaviosalas/jdata/experiencia");
      if (!response.ok) {
        throw new Error("No se pudo cargar la información de experiencia.");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al cargar la experiencia:", error.message);
      return [];
    }
  }

  function crearProyectoElement(proyecto) {
    const proyectoElement = document.createElement("article");
    proyectoElement.className = `proyectos__${proyecto.tipo}`;
    proyectoElement.innerHTML = `
      <img class="proyectos__imagen" src="${proyecto.imagen}" alt="Foto del Portfolio Challenge">
      <h3 class="proyectos__hashtag">${proyecto.hashtag}</h3>
      <h1 class="proyectos__titulo">${proyecto.titulo}</h1>
      <p class="proyectos__descripcion">${proyecto.descripcion}</p>
      <div class="proyectos__boton">
          <button type="button" class="proyectos__boton--demo">Demo</button>
          <button type="button" class="proyectos__boton--code">Code</button>
      </div>
    `;
    return proyectoElement;
  }

  function crearCertificadoElement(certificado) {
    const contenedorElement = document.createElement("section");
    contenedorElement.className = "certificados__contenedor";

    const certificadoElement = document.createElement("article");
    certificadoElement.className = "certificados__contenido";
    certificadoElement.innerHTML = `
      <img class="certificados__foto" src="${certificado.foto}" alt="Foto del diploma">
      <h2 class="certificados__matricula">${certificado.matricula}</h2>
      <h3 class="certificados__fecha">${certificado.fecha}</h3>
    `;

    contenedorElement.appendChild(certificadoElement);

    return contenedorElement;
  }

  function crearExperienciaElement(experiencia) {
    const experienciaElement = document.createElement("article");
    experienciaElement.className = "experiencia__contenido--adidas";
    experienciaElement.innerHTML = `
      <div class="experiencia__detalles">
        <img class="experiencia__logo" src="${experiencia.logo}" alt="Logo ${experiencia.empresa}">
        <div class="experiencia__descripcion">
          <h3 class="experiencia__descripcion--fecha">${experiencia.fecha}</h3>
          <h2 class="experiencia__descripcion--matricula">${experiencia.puesto}</h2>
          <p class="experiencia__descripcion--desc-desktop">${experiencia.descripcion}</p>
        </div>
      </div>
      <p class="experiencia__descripcion--desc-mobile">${experiencia.descripcion}</p>
    `;
    return experienciaElement;
  }

  async function mostrarProyectos() {
    const proyectosData = await cargarProyectos();
    const tipoActivo = document.querySelector(".boton__activo").id;
    const proyectosFiltrados = proyectosData.filter((proyecto) => proyecto.tipo === tipoActivo);
    const proyectosContainer = document.querySelector(".proyectos");
    proyectosContainer.innerHTML = "";
    const proyectosResponsive = proyectosData.filter((proyecto) => proyecto.tipo === "responsive");
    const proyectosPorPagina = 3;
    const inicio = (paginaActual - 1) * proyectosPorPagina;
    const fin = inicio + proyectosPorPagina;
    const sumaTotalProyectos = proyectosData.length;

    const numeroProyectos = document.getElementById("numeroProyectos");
    numeroProyectos.textContent = "Proyectos(" + sumaTotalProyectos + ")";

    proyectosFiltrados.slice(inicio, fin).forEach((proyecto) => {
      const proyectoElement = crearProyectoElement(proyecto);
      proyectosContainer.appendChild(proyectoElement);
    });

    crearBotonesPaginacion(proyectosFiltrados.length);

    const proyectoPrincipal = document.querySelector(".proyecto-principal");
    proyectoPrincipal.innerHTML = "";
    if (proyectosResponsive.length > 0) {
      const primerProyecto = proyectosResponsive[0];
      const proyectoPrincipalElement = crearProyectoElement(primerProyecto);
      proyectoPrincipal.appendChild(proyectoPrincipalElement);
    }
  }

  async function mostrarCertificados() {
    const certificadosData = await cargarCertificados();
    const certificadosContainer = document.querySelector(".certificados__contenido");
    certificadosContainer.innerHTML = "";

    certificadosData.forEach((certificado) => {
      const certificadoElement = crearCertificadoElement(certificado);
      certificadosContainer.appendChild(certificadoElement);
    });
  }

  async function mostrarExperiencia() {
    const experienciaData = await cargarExperiencia();
    const experienciaContainer = document.querySelector(".experiencia__contenedor");
    experienciaContainer.innerHTML = "";

    experienciaData.forEach((experiencia) => {
      const experienciaElement = crearExperienciaElement(experiencia);
      experienciaContainer.appendChild(experienciaElement);
    });
  }


  function crearBotonesPaginacion(totalProyectos) {
    const numPaginas = Math.ceil(totalProyectos / 3);
    paginado.innerHTML = "";


    const botonAnterior = document.createElement("a");
    botonAnterior.href = "#";
    botonAnterior.textContent = "❮";
    botonAnterior.addEventListener("click", function (event) {
      event.preventDefault();
      if (paginaActual > 1) {
        mostrarPagina(paginaActual - 1);
      }
    });
    paginado.appendChild(botonAnterior);

    for (let i = 1; i <= numPaginas; i++) {
      const enlace = document.createElement("a");
      enlace.href = "#";
      enlace.textContent = i;
      enlace.addEventListener("click", function (event) {
        event.preventDefault();
        mostrarPagina(i);
      });
      if (i === paginaActual) {
        enlace.classList.add("active");
      }
      paginado.appendChild(enlace);
    }


    const botonSiguiente = document.createElement("a");
    botonSiguiente.href = "#";
    botonSiguiente.textContent = "❯";
    botonSiguiente.addEventListener("click", function (event) {
      event.preventDefault();
      if (paginaActual < numPaginas) {
        mostrarPagina(paginaActual + 1);
      }
    });
    paginado.appendChild(botonSiguiente);
  }

  function mostrarPagina(pagina) {
    paginaActual = pagina;
    mostrarProyectos();
  }

  botones.forEach((boton) => {
    boton.addEventListener("click", function () {
      botones.forEach((b) => {
        b.classList.remove("boton__activo");
        b.classList.add("boton__default");
      });
      boton.classList.remove("boton__default");
      boton.classList.add("boton__activo");

      paginaActual = 1;

      mostrarProyectos();
    });
  });

  mostrarProyectos();
  mostrarCertificados();
  mostrarExperiencia();
});

