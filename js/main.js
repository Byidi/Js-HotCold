//COLOR background
function symboleAleatoire(){
    var symbole = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
    return symbole[Math.floor(Math.random()*symbole.length)];
}

function getCouleur(type){
    var couleur = "";
    switch(type){
        case 'win':
            var couleurs = ['green','yellow','blue'];
            couleur = couleurs[Math.floor(Math.random()*couleurs.length)];
        break;
        case 'loose':
            var couleurs = ['red','black','brown'];
            couleur = couleurs[Math.floor(Math.random()*couleurs.length)];
        break;
        case 'white':
            couleur = "white";
        break;
        default:
            couleur = "#";
            for (var i = 0; i <= 5; i++){
                    couleur += symboleAleatoire();
            }
    }
    return couleur;
}

function createHtml(col,row){
    var bgcontent = "<table>";
    for (var i = 0; i <=  col; i++) {
        bgcontent += "<tr>";
            for (var j = 0; j <= row; j++) {
                bgcontent += "<td></td>";
            }
        bgcontent += "</tr>";
    }
    bgcontent += "</table>";

    document.getElementById("background").innerHTML = bgcontent;
}

function colorTable(type){
    tdArray = document.getElementsByTagName("td");
    for (var i = 0; i < tdArray.length; i++){
        tdArray[i].style.backgroundColor = getCouleur(type);
    }
    return true;
}

//PLUS-MOINS
function getNumber(min, max){
    return Math.floor((Math.random() * max) + min);
}

function setHistory(choix, type){
    var p = document.createElement("p");
    switch(type){
        case 'sup':
            p.innerHTML = essai+" : Sup&eacute;rieur &agrave; "+choix;
        break;
        case 'inf':
            p.innerHTML = essai+" : Inf&eacute;rieur &agrave; "+choix;
        break;
    }
    document.getElementById("history").appendChild(p);
}

function compare(number, choix){
    var audio = document.getElementById("audioplayer");
    document.getElementById("audioplayer").setAttribute("src", "./audio/tambour.mp3");
    var cmp = 0;

    audio.play();
    var timer = setTimeout(function(){
        audio.pause();
        clearTimeout(timer);
    },2000);

    if(!isNaN(choix) && choix != ""){
        if(choix >= 1 && choix <= 100){
            essai ++;
            if(number > choix){
                document.getElementById("choix").style.backgroundImage = 'url("./img/plus.png")';
                setHistory(choix,"sup");
            }else if(number < choix){
                document.getElementById("choix").style.backgroundImage = 'url("./img/moins.png")';
                setHistory(choix,"inf");
            }else{
                gameEnd("win");
            }
        }else{
            alert("C'est un nombre entre 1 et 100 ...");
        }
    }else{
        alert("Avec un nombre c'est mieux !!!");
        document.getElementById("choix").value = "";
        document.getElementById("choix").focus();
    }
}

function gameEnd(status){
    document.getElementById("choix").style.background = "transparent";
    document.getElementById("content").style.background = "#FFFFFFCC";
    document.getElementById("choix").readOnly = true;

    var cmp = 0;

    createHtml(35,51);
    colorTable('random');

    var boucle = setInterval(function(){
        colorTable();
        (cmp%2 == 0) ? colorTable('random') : colorTable(status);
        cmp ++;
        (cmp > 10000) ? clearInterval(boucle) : "";
    }, 50);

    var audio = document.getElementById("audioplayer");

    if(status == "win"){
        document.getElementById("nyancat_1").style.left = "1500px";
        document.getElementById("nyancat_2").style.right = "1500px";
        document.getElementById("nyancat_3").style.left = "1500px";

        document.getElementById("audioplayer").setAttribute("src", "./audio/nyan.ogg");
        document.getElementById("resultat").innerHTML = "Victoire !!!";
    }else{
        document.getElementById("audioplayer").setAttribute("src", "./audio/loose.mp3");
        document.getElementById("resultat").innerHTML = "Defaite ...";
    }
    audio.currentTime = 0;
    audio.play();
}

var essai = 0;
var victoire = false;
var number = getNumber(1, 100);
console.log(number);

document.getElementById("choix").focus();
document.getElementById("choix").value = "";

document.getElementById("choix").addEventListener('keypress',function(e){
    if(e.keyCode == 13){
        var choix = document.getElementById("choix").value;
        document.getElementById("choix").focus();
        document.getElementById("choix").select();
        compare(number,choix);
        if(!victoire && essai == 5){
            var max_hint = (number.toString().slice(-1) != 0)?(10 - number.toString().slice(-1)) + number:number;
            var min_hint = max_hint - 9;
            console.log("C'est compris entre : "+min_hint+" et "+max_hint);
        }else if(!victoire && essai == 10){
            gameEnd("loose");
        }
    }
});
