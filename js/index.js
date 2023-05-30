
const ruleta = document.getElementById("ruleta");
let ganador = "";
const root = document.documentElement;
let sorteando = false;
const ganadorTexto = document.getElementById("ganadorTexto");
let animacionCarga;
const modal = document.querySelector("dialog");
const formContainer = document.getElementById("formContainer");
const porcentaje = document.getElementById("porcentaje");
const botonAceptar = document.getElementById("aceptar");

let opcionesContainer;


document.getElementById("sortear").addEventListener("click", () => sortear());

const uno = {
    nombre: "Uno",
    probabilidad: 25
};

const dos = {
    nombre: "Dos",
    probabilidad: 25
};

const tres = {
    nombre: "Tres",
    probabilidad: 25
};

const cuatro = {
    nombre: "Cuatro",
    probabilidad: 25
}

let conceptos = [uno, dos, tres, cuatro];

function aleatorio(){
    return Math.random() - 0.5;
}

const colores = ["#845EC2", "#D65DB1", "#FF6F91", "#FF9671", "#FFC75F", "#F9F871", "#2C73D2", "#0089BA", "#008F7A", "#4B4453", "#4E8397", "#00C9A7", "#3D8AA4"];
colores.sort(aleatorio);

function getRandomColor(){
    return colores[Math.floor(Math.random() * colores.length)];
}

function ajustarRuleta() {
    if (opcionesContainer) ruleta.removeChild(opcionesContainer);
    opcionesContainer = document.createElement("div");
    opcionesContainer.id = "opcionesCointainer";
    ruleta.appendChild(opcionesContainer);
    let pAcumulada = 0;
    conceptos.forEach((concepto, i) => {
        // Crear triangulos de colores
        const opcionElement = document.createElement("div");
        opcionElement.classList.add("opcion");
        opcionesContainer.appendChild(opcionElement);
        opcionElement.style =
            `background-color: ${colores[i]};
            transform:rotate(${probabilidadAGrados(pAcumulada)}deg);
            ${getPosicionParaProbabilidad(concepto.probabilidad)}
            `;
        pAcumulada += concepto.probabilidad;

        // Agregar nombre correspondiente al ítem
        const nombreElement = document.createElement("span");
        nombreElement.textContent = concepto.nombre;
        nombreElement.classList.add("nombre-item");
        opcionElement.appendChild(nombreElement);

        const separador = document.createElement("div");
        separador.classList.add("separador");
        separador.style =
            `transform:rotate(${probabilidadAGrados(pAcumulada)}deg);
            `;
        opcionesContainer.appendChild(separador);

        opcionElement.addEventListener("click", () => {
            modal.showModal();
            Array.from(formContainer.children).forEach(element => {
                formContainer.removeChild(element);
            })
            conceptos.forEach(concepto => {
                agregarConfiguracionProbabilidad(concepto);
            })
        });
    });
}


function agregarConfiguracionProbabilidad(concepto = undefined){
    const opcionContainer = document.createElement("div");
    const opcionInput = document.createElement("input");
    opcionInput.type = "number";
    opcionInput.addEventListener("change", () => {
        verificarValidezFormulario()
    });
   
    const borrar = document.createElement("button");
    borrar.textContent = "X";
    if(concepto) {
        const opcionLabel = document.createElement("label");
        opcionLabel.textContent = concepto.nombre;
        opcionContainer.appendChild(opcionLabel);
        opcionInput.value = concepto.probabilidad;
    } else {
        const nombreInput = document.createElement("input");
        opcionContainer.appendChild(nombreInput);
        opcionInput.value = 0;
    }
    opcionContainer.appendChild(opcionInput);
    opcionContainer.appendChild(borrar);
    formContainer.appendChild(opcionContainer);
    borrar.addEventListener("click", (event) => {
        formContainer.removeChild(event.target.parentNode);
        verificarValidezFormulario();
    })
}

/** Desde una probabilidad en % devuelve un clip-path que forma el ángulo correspondiente a esa probabilidad */
function getPosicionParaProbabilidad(probabilidad){
	if(probabilidad === 100){
		return ''
	}
	if(probabilidad >= 87.5){
		const x5 = Math.tan(probabilidadARadianes(probabilidad))*50+50;
		return `clip-path: polygon(50% 0%, 100% 0, 100% 100%, 0 100%, 0 0, ${x5}% 0, 50% 50%)`
	}
	if(probabilidad >= 75){
		const y5 = 100 - (Math.tan(probabilidadARadianes(probabilidad-75))*50+50);
		return `clip-path: polygon(50% 0%, 100% 0, 100% 100%, 0 100%, 0% ${y5}%, 50% 50%)`
	}
	if(probabilidad >= 62.5){
		const y5 = 100 - (0.5 - (0.5/ Math.tan(probabilidadARadianes(probabilidad))))*100;
		return `clip-path: polygon(50% 0%, 100% 0, 100% 100%, 0 100%, 0% ${y5}%, 50% 50%)`
	}
	if(probabilidad >= 50){
		const x4 = 100 - (Math.tan(probabilidadARadianes(probabilidad))*50+50);
		return `clip-path: polygon(50% 0, 100% 0, 100% 100%, ${x4}% 100%, 50% 50%)`
	}
	if(probabilidad >= 37.5){
		const x4 = 100 - (Math.tan(probabilidadARadianes(probabilidad))*50+50);
		return `clip-path: polygon(50% 0, 100% 0, 100% 100%, ${x4}% 100%, 50% 50%)`
	}
	if(probabilidad >= 25){
		const y3 = Math.tan(probabilidadARadianes(probabilidad-25))*50+50;
		return `clip-path: polygon(50% 0, 100% 0, 100% ${y3}%, 50% 50%)`
	}
	if(probabilidad >= 12.5){
		const y3 = (0.5 - (0.5/ Math.tan(probabilidadARadianes(probabilidad))))*100;
		return `clip-path: polygon(50% 0, 100% 0, 100% ${y3}%, 50% 50%)`
	}
	if(probabilidad >= 0){
		const x2 = Math.tan(probabilidadARadianes(probabilidad))*50 + 50;
		return `clip-path: polygon(50% 0, ${x2}% 0, 50% 50%)`
	}
}

function sortear() {
    if(sorteando) return;
    sorteando = true;
    ganadorTexto.textContent = ".";
    animacionCarga = setInterval( () =>{
        switch (ganadorTexto.textContent){
            case ".":
                ganadorTexto.textContent = "..";
                break;
            case "..":
                ganadorTexto.textContent = "...";
                break;
            default:
                ganadorTexto.textContent = ".";
                break;
        }
    }, 500)
    nSorteo = Math.random();
    let pAcumulada = 0;
    ruleta.classList.toggle("girar", true);
    conceptos.forEach(concepto => {
        if(nSorteo*100 >= pAcumulada && nSorteo*100 < pAcumulada+concepto.probabilidad){
            ganador = concepto.nombre;
            //console.log("Ganó", nSorteo*100, concepto.nombre, "porque está entre ", pAcumulada, "y", pAcumulada+concepto.probabilidad);
        }
        pAcumulada += concepto.probabilidad;
    })
    const giroRuleta = 10*360 + (1-nSorteo * 360);
    root.style.setProperty("--giroRuleta", giroRuleta + "deg");
}

ruleta.addEventListener("animationend", () => {
    ruleta.style.transform = "rotate(" + getCurrentRotation(ruleta) +"deg)";
    sorteando = false;
    ruleta.classList.toggle("girar", false);
    ganadorTexto.textContent = ganador;
    clearInterval(animacionCarga);

    // Partículas
    for (let i = 0; i < 100; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.setProperty('--translate-x', Math.random());
        particle.style.setProperty('--translate-y', Math.random());
        particle.style.backgroundColor = getRandomColor();
        document.body.appendChild(particle);
    }

})

document.getElementById("cancelar").addEventListener("click",()=> modal.close());
document.getElementById("aceptar").addEventListener("click",()=>{
    conceptos = [];
    Array.from(formContainer.children).forEach(opcion => {
        const nuevaProbabilidad = {
            nombre: opcion.children[0].tagName === "LABEL" ? opcion.children[0].textContent : opcion.children[0].value,
            probabilidad: parseFloat(opcion.children[1].value)
        }
        conceptos.push(nuevaProbabilidad);
    })
    modal.close();
    ajustarRuleta();
} );

document.getElementById("agregar").addEventListener("click", () => {
    agregarConfiguracionProbabilidad();
})

document.getElementById("calcular").addEventListener("click", () => {
    // Limpiar el array conceptos
    conceptos = [];
  
    // Agregar nuevos conceptos desde el formulario
    Array.from(formContainer.children).forEach((opcion) => {
      const nuevaProbabilidad = {
        nombre: opcion.children[0].tagName === "LABEL" ? opcion.children[0].textContent : opcion.children[0].value,
        probabilidad: parseFloat(opcion.children[1].value)
      };
      conceptos.push(nuevaProbabilidad);
    });

    const numConceptos = conceptos.length;
    const porcentajeEquitativo = 100 / numConceptos;
  
    // Asignar probabilidades equitativas a cada concepto
    conceptos.forEach((concepto) => {
      concepto.probabilidad = porcentajeEquitativo;
    });
  
    porcentaje.textContent = 100;
    botonAceptar.disabled = false;
  
    // Actualizar los valores de los inputs en el formulario
    Array.from(formContainer.children).forEach((opcion) => {
      opcion.children[1].value = porcentajeEquitativo;
    });
  
    ajustarRuleta();
   
    //verificarValidezFormulario();
  });
  
  



/** Revisa si  los porcentajes de probabilidades suman a 100% */
function verificarValidezFormulario(){
	suma=0;
	Array.from(formContainer.children).forEach(opcion =>{
		suma += parseFloat(opcion.children[1].value);
	});
    porcentaje.textContent = suma;
	if(suma === 100) {
        botonAceptar.disabled = false;
    } else {
        botonAceptar.disabled = true;
    }
	
}


ajustarRuleta();