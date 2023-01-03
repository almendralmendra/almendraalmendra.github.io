document.getElementById("icon_menu").addEventListener("click", mostrar_menu);

function mostrar_menu(){

    document.querySelector(".menu").classList.toggle("mostrar_menu");
    
}

window.onscroll = function () {
    var posicion = window.pageYOffset || document.documentElement.scrollTop;
    var elemento1 = document.getElementById("icon_heart");
    var elemento2 = document.getElementById("icon_fire");
    elemento1.style.bottom = posicion * 0.1 + "px";
    elemento2.style.top = posicion * 0.15 + "px";
}

/*
   Juego de memoria.

   Código de un juego de memoria consistente en encontrar las parejas de varias cartas
*/
var gameList = null //variable que contendrá las imágenes del juego
var bloqList = null //variable que almacena los números de las cartas que ya se han encontrado como pareja
var aciertos = null //variable que almacena el número de aciertos del usuario
var destapada = null //variable que almacena si ya hay una carta destapada
var cartaDestapada = null //variable que almacena la última carta que se ha destapado
var cartaAnterior = null //variable para controlar que no hagas click 2 veces seguidas en la misma carta

// Carga las variables del juego almacenadas en el navegador
function iniciaGame()
{
    gameList = JSON.parse(localStorage.getItem('ListaJuego'));
    aciertos = JSON.parse(localStorage.getItem('Aciertos'));
    destapada = JSON.parse(localStorage.getItem('Destapada'));
    cartaDestapada = JSON.parse(localStorage.getItem('cartaDestapada'));
    bloqList = JSON.parse(localStorage.getItem('BloqList'));
	
	gameList = new Object();
    aciertos = 0;
    destapada = 0;
    bloqList = new Object();
    cartaAnterior = null;
    cartaDestapada = null;
}

/* 
    Actualiza la lista almacenada en el navegador.
    Debe llamarse cada vez que se haga un cambio la lista
*/
function actualizarGameList()
{
	localStorage.setItem('ListaJuego', JSON.stringify(gameList));
}

/* 
    Actualiza la lista de bloqueadas almacenada en el navegador.
    Debe llamarse cada vez que se haga un cambio la lista
*/
function actualizarBloqList()
{
	localStorage.setItem('BloqList', JSON.stringify(bloqList));
}

/* 
    Actualiza el número de aciertos almacenado en el navegador.
    Debe llamarse cada vez que se haga un cambio en aciertos
*/
function actualizarAciertos()
{
	localStorage.setItem('Aciertos', JSON.stringify(aciertos));
}

/* 
    Actualiza en el navegador si hay una carta destapada o no.
    Debe llamarse cada vez que se haga un cambio en destapada
*/
function actualizarDestapada()
{
	localStorage.setItem('Destapada', JSON.stringify(destapada));
}

/* 
    Actualiza en el navegador la última carta destapada.
    Debe llamarse cada vez que se haga un cambio en cartaDestapada
*/
function actualizarCartaDestapada()
{
	localStorage.setItem('DartaDestapada', JSON.stringify(cartaDestapada));
}

//Guarda en una lista de manera aleatoria las imágenes
function inicializaJuego()
{
    //El botón de reinicio pasa a ser invisible
    cambiaEstadoBoton();
    //La puntuación se vuelve a dibujar a 0
    actualizaPuntuacion()

    let numCard = 10; //numero de cartas que tendrá la partida

    //Bucle en el que se guardan dentro de una lista las imágenes que se desean usar
    for(var x = 0; x < numCard; x++)
    {
        gameList[x] = "../PORTFOLIO WEB/src/media/memoryGame/card"+x+".png"; //guarda una imagen
        gameList[x+numCard] = "../PORTFOLIO WEB/src/media/memoryGame/card"+x+".png"; //guarda la pareja de la imagen

        //Al iniciar el juego ninguna carta está bloqueada (aún no se ha acertado)
        bloqList[x] = false; 
        bloqList[x+numCard] = false;
    }

    //Reordenamos aleatoriamente la lista de imágenes
    ordenarRandom(gameList);
    actualizarGameList();
}

function ordenarRandom(list) 
{
    let currentIndex = Object.keys(list).length; //el índice actual es el tamanyo de la lista
    let randomIndex; //índice aleatorio
  
    //Bucle que se ejecuta mientras haya elementos en la lista
    while (currentIndex != 0) 
    {

      //Selecciona un elemento de la lista
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      //Intercambia ese elemento con el actual
      [list[currentIndex], list[randomIndex]] = [list[randomIndex], list[currentIndex]];
    }
  
    return list;
  }

//Dibuja las cartas del juego de memoria boca abajo
function dibujaJuegoMemoriaInicial()
{
	let tabla = document.getElementById('tabla'); //accede a la tabla del html
	let rowCount = tabla.rows.length; //variable que contiene el número de elementos en la tabla
    let carta = 0; //identificador con el numero de la carta

    //Borra la tabla para que, cada vez que se ejecuta el código, sólo se pinte una vez
	while (rowCount > 0) 
	{
		tabla.deleteRow(0);
		rowCount = tabla.rows.length;
	}

    //Numero de filas y columnas de cartas
    let filas = Object.keys(gameList).length/10
    let columnas = 10;

    ancho = window.innerWidth //variable del ancho de la pantalla

    //Método para variar la tabla en función del tamaño de la pantalla
    if(ancho >= 1102)
        columnas = 10;
    else if (ancho >= 540)
        columnas = 5;
    else if (ancho >= 450)
        columnas = 4;
    else if (ancho >= 225)
        columnas = 2;
    else 
        columnas = 1

    filas = Object.keys(gameList).length/columnas;
        
    
    /*
        Dibuja el tablero inicial con las cartas dadas la vuelta:
            1-El primer bucle (i) indica el número de filas de cartas 

            2-El segundo bucle (j) indica el número de cartas por fila 

            3-El número entre el que se divide "Object.keys(gameList).length" 
            debe ser el número de veces que se ejecuta el segundo bucle (ahora mismo, 5 y 5)
    */
    for(var i = 0; i < filas; i++)
    {
        let row = tabla.insertRow(0); //Inserta una nueva fila

        for(var j = 0; j < columnas; j++)
        {
            //Inserta una columna a la fila con la imagen del dorso de la carta
            let cell = row.insertCell(j); cell.innerHTML = '<img id="celda'+carta+'" src="../PORTFOLIO WEB/src/media/memoryGame/card.png" alt="Carta" onclick="destapaCarta('+ carta +')">';
            carta++;  
        }
    }
}

//Función de destapado de las cartas
function destapaCarta(num)
{
    //Se comprueba que no hagas click sobre una carta que está boca arriba
    if(num != cartaDestapada && num != cartaAnterior && bloqList[num] == false)
    {
        //evita que se destapen más de dos cartas
        if(destapada < 2)
        {
            //La carta anterior pasa a ser la que has hecho click
            cartaAnterior = num;

            //Si la nueva carta destapada es igual a la anterior
            if(gameList[num] === gameList[cartaDestapada])
            {
                aciertos++; //aumenta el número de aciertos

                //Se bloquean las dos cartas para que no se vuelvan a girar
                bloqList[num] = true;
                bloqList[cartaDestapada] = true;

                cartaDestapada = null; //reincia la carta destapada
                actualizarCartaDestapada();

                actualizarBloqList();
            }

            document.getElementById('celda'+num).src=gameList[num]; //da la vuelta a la carta en la que se ha hecho click
            
            destapada++; //aumenta el contador de cartas destapadas
            actualizarDestapada();
            
            //Si hay una carta destapada
            if(destapada == 1)
            {
                cartaDestapada = num; //la última carta destapada pasa a ser la actual 
                actualizarCartaDestapada();
            }  
        }
        else
        {
            //redibuja el juego teniendo en cuenta las cartas bloqueadas
            actualizaTablero();

            cartaDestapada = null; //reincia la carta destapada
            actualizarCartaDestapada();

            destapada = 0; //reinicia el número de cartas destapadas
            actualizarDestapada();

            //Se destapa la carta que querías destapar después de dar la vuelta las demás
            destapaCarta(num)
        }

        //Si ya se han encontrado todas las parejas de cartas se muestra el botón de reinicio del juego
        if(aciertos >= Object.keys(gameList).length / 2)
        {
            cambiaEstadoBoton();
        }
    }

    //Se actualiza la puntuacion
    actualizaPuntuacion()
}

//Actualiza el tablero de juego teniendo en cuenta las parejas de cartas que han sido bloqueadas (acertadas)
function actualizaTablero()
{
    //Se recorren todas las cartas
    for(num = 0; num < Object.keys(gameList).length; num++)
    {
        //Se comprueba que la carta no esté bloqueada
        if(bloqList[num] == false)
            document.getElementById('celda'+num).src="../PORTFOLIO WEB/src/media/memoryGame/card.png"; //da la vuelta a la carta
        //Comprobación de que la carta sigue dada la vuelta (para cuando se actualiza el tamaño de la pantalla)
        else if(document.getElementById('celda'+num).src!=gameList[num])
            document.getElementById('celda'+num).src=gameList[num];
    }
}

//Cambia el estado del botón de reinicio de visible a invisible y viceversa
function cambiaEstadoBoton()
{
    var x = document.getElementById("bot");

    if (x.style.display === "none") 
      x.style.display = "block"; 
    else 
      x.style.display = "none";
}

//Crea el texto html con la puntuación
function actualizaPuntuacion()
{
    //Si no existe el texto lo crea
    if(document.getElementById("punt") == null)
    {
        var p = document.createElement("p");
        p.id = "punt";
        var node = document.createTextNode("Puntuacion: "+aciertos);
        p.appendChild(node);
        var element = document.getElementById("puntuacion");
        element.appendChild(p);
    }
    //Si existe actualiza la puntuación
    else
        document.getElementById("punt").textContent = "Puntuacion: "+aciertos;
}
