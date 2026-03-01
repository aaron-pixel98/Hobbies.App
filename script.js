let hobbies = JSON.parse(localStorage.getItem("hobbies")) || [];

// Limpieza de seguridad por si hay datos viejos
hobbies = hobbies.filter(h => 
    h && 
    typeof h === "object" &&
    "streak" in h &&
    "text" in h
);
document.addEventListener("DOMContentLoaded", () =>{
    const input = document.getElementById("hobbieInput");//variable para el input
    const addBtn = document.getElementById("agregarBtn");//variable para el boton agregar
    const lista = document.querySelector("ul");
    
    //const MODO_TEST = true;
    //el array central, fuente real
    
    const hobbiesGuardados = localStorage.getItem("hobbies");        
    //alert("Vamos a incrementar esa racha!!!");
    render();
    
    function render (){
        lista.innerHTML = "";
        
        hobbies.forEach ((hobbie) =>{           
            let emoji = "🔥";
            if (hobbie.streak >= 5) emoji = "⚡";//lvl 1
            if (hobbie.streak >= 10) emoji = "🚀";//lvl 2
            if (hobbie.streak >=15) emoji = "🌋";//lvl 3
            if (hobbie.streak >= 20) emoji = "👑";//lvl 4
            if (hobbie.streak >= 25) emoji = "☄️";//lvl 10
            if (hobbie.streak >= 100) emoji = "🧠";//lvl 6>
            
            //calculos 
            const nivel = Math.floor(hobbie.streak / 5);
            const nivelBadge = `racha-nivel-${nivel}`;
            const progreso = (hobbie.streak % 5) / 5 * 100;

            //li principal
            const li = document.createElement("li");
            const mensaje = mensajeMotivador(hobbie.streak);
            const nivelClase = obtenerClaseNivel(hobbie.streak);
            
            li.innerHTML = `
                <span class="${nivelClase}">
                ${mensaje}
                <br>
                <br>
                ${hobbie.text} ${emoji} ${hobbie.streak}
                </span>
            `;

            //texto
            const span = document.createElement("span");
            //span.textContent = `${hobbie.text} ${emoji} ${hobbie.streak}`;
           // span.classList.add("nivelClase");
            //clase de niveles
           
            //barra

            const barra = document.createElement("div");
            barra.classList.add("barra");

            const progresoInterno = document.createElement("div");
            progresoInterno.classList.add("progreso");
            progresoInterno.style.width = progreso + "%";

            barra.appendChild(progresoInterno);

            //badge
            const badge = document.createElement("span");
            badge.textContent = `Nivel ${nivel}`;
            badge.classList.add("badge");
            
            //boton practicar
            const practicarBtn = document.createElement("button");
            practicarBtn.textContent = "🔥";
            practicarBtn.addEventListener("click", () => sumarRacha(hobbie.id));

            //boton editar
            const editarBtn = document.createElement("button");
            editarBtn.textContent = "✏️";
            editarBtn.addEventListener("click", () => {
                const inputEdit = document.createElement("input");
                inputEdit.type = "text";
                inputEdit.value = hobbie.text;

                li.replaceChild(inputEdit, span);
                inputEdit.focus();

                function guardarEdicion() {
                    const nuevoTexto = inputEdit.value.trim();
                    if (nuevoTexto === "") return render();

                        hobbies = hobbies.map(h => {
                            if (h.id === hobbie.id) {
                                return { ...h, text: nuevoTexto };
                            }
                            return h;
                        });

                        guardarHobbies();
                        render();
                    }

                    inputEdit.addEventListener("keydown", (e) => {
                        if (e.key === "Enter") {
                            guardarEdicion();
                        }
                    });

                    inputEdit.addEventListener("blur", guardarEdicion);
                }); 
    
                //boton borrar
                const borrar = document.createElement("button");
                borrar.textContent = "✖";
                borrar.addEventListener("click", ()=> eliminar(hobbie.id));

                

                li.appendChild(span);
                li.appendChild(barra);
                li.appendChild(badge);
                li.appendChild(practicarBtn);
                //boton editar como hijo de li
                li.appendChild(editarBtn);
                //boton de eliminar dinamico como hijo de li
                li.appendChild(borrar);
            
                //li dinamico como hijo de ul
                lista.appendChild(li);

               
            });
            function mensajeMotivador(streak){
                if (streak < 5) return "🔥 Construyendo hábito...";
                if (streak < 10) return "⚡ Ya hay constancia";
                if (streak < 15) return "🚀 Esto ya es disciplina";
                if (streak < 20) return "🌋 Mentalidad imparable";
                if (streak < 25) return "👑 Eres un gran ejemplo";
                if (streak < 100)return "☄️ Sientete orgulloso";
                return "🧠 Qué gran disciplina";
            };
            function obtenerClaseNivel(streak){
                if (streak < 5) return "";
                if (streak < 10) return "racha-nivel-1";
                if (streak < 15) return "racha-nivel-2";
                if (streak < 20) return "racha-nivel-3";
                if (streak < 25) return "racha-nivel-4";
                if (streak < 100) return "racha-nivel-10";
                return "racha-nivel-20";
            }
        }
    //funcion para editar hobbie
    function editarHobby(id) {
        const hobby = hobbies.find(h => h.id === id);

        const nuevoTexto = prompt("Editar hobby:", hobby.text);
        if (!nuevoTexto) return;

        hobbies = hobbies.map(h => {
            if (h.id === id) {
                return {
                    ...h,
                    text: nuevoTexto.trim()
                };
            }
            return h;
        });

        guardarHobbies();
        render();
    }
    //funcion para sumar racha
    function sumarRacha(id) {
        const hoy = new Date();
        const hoyStr = hoy.toDateString();

        hobbies = hobbies.map(h => {
            if (h.id !== id) return h;
                //Modo_TEST true
                /*if (MODO_TEST) {
                    return {
                        ...h,
                        streak: h.streak + 1,
                        lastDate: hoyStr
                    };
                };*/
                //if (h.lastDate === hoy) return h;
                if (h.lastDate === hoyStr) {
                    alert ("🔥 Ya practicaste hoy. Mañana seguimos sumando.");
                    return h;
                };
                if(!h.lastDate){
                    return{
                        ...h,
                        streak: 1,
                        lastDate: hoyStr
                    };
                }
                    const ultima = new Date (h.lastDate);
                    const diferencia = Math.floor(
                        (hoy - ultima) / (1000 * 60 * 60 * 24)
                    );
                    
                    if (diferencia > 1){
                        alert("😢 Racha perdida. Pero volvemos más fuertes.");
                        return {
                            ...h,
                            streak: 1,
                            lastDate: hoyStr
                        };
                    }
                return {
                    ...h,
                    streak: h.streak +1,
                    lastDate: hoyStr
                };
            });

        guardarHobbies();
        render();
    };
    //funcion para egregar hobbie
    function agregar() {
        const text = input.value.trim();
        if (text === "") return input.focus();      
        
        if (hobbies.some(h => h.text === text)) {
            input.value = "";
            input.focus();
            return;
        }
        const nuevoHobby = {
            id: Date.now(),
            text: text,
            streak: 0,
            lastDate: null
        };

        hobbies.push(nuevoHobby);
        guardarHobbies();
        render();

        //se limpia el input y se hace focus
        input.value = "";
        input.focus();
    }
    //funcion para eliminar hobbie
    function eliminar (id){
    hobbies = hobbies.filter(h => h.id !== id);
    guardarHobbies();
    render();
    //li.remove();
    }
    function guardarHobbies() {
        localStorage.setItem("hobbies", JSON.stringify(hobbies));
    }
   
    addBtn.addEventListener("click", agregar);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter"){
            agregar();
        }
    });
});
;