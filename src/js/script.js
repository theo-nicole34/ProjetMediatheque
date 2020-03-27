//Adhérents

function loadAdherents(){
	let lien = "php/requeteAdherents.php";
	let req = new XMLHttpRequest();
	req.open("GET", lien, true);
	req.addEventListener("load", function () {
		let xhrJSON = JSON.parse(req.responseText);
		let tab = [];
		for (let i = 0; i < xhrJSON.length; i++) {
			let tab2 = [];
			tab2.push(xhrJSON[i]["idAdherent"]);
			tab2.push(xhrJSON[i]["nomAdherent"]);
			tab2.push(xhrJSON[i]["nbEmprunt"]);
			tab.push(tab2);
		}
		showAdherents(tab);
	});
	req.send(null);
}

function showAdherents(tab){
	document.getElementById("listeAdherents").innerHTML="";
	for (let i = 0; i < tab.length; i++) {
		let par = document.createElement("p");
		let text = tab[i][0]+"-"+tab[i][1];
		if (tab[i][2] != 0) {//si un livre est emprunté
			text+=" ("+tab[i][2]+" emprunt";
			if (tab[i][2] > 1) {//si plusieurs livres sont empruntés
				text+="s)";
			}else{
				text+=")";
			}
		}
		par.innerHTML=text;
		par.id=tab[i][0];
		par.style.cursor = "pointer";
		document.getElementById("listeAdherents").appendChild(par);
	}
}

function windowAdherents(tab,id){

	let lien = "php/getNomAdherent.php?id="+id;
	let requete = new XMLHttpRequest();
	requete.open("GET", lien, true);
	requete.addEventListener("load", function () {
		let xhrJSON = JSON.parse(requete.responseText);
		let nom = xhrJSON[0]["nomAdherent"];
		let div = document.createElement("div");
		let close = document.createElement("button");
		close.className="close";close.innerHTML="x";
		div.appendChild(close);
		let titre = document.createElement("h3");
		switch(tab.length){
			case 0:
				titre.innerHTML=nom+" a 0 emprunt en ce moment.";
				div.appendChild(titre);
				break;
			case 1:
				titre.innerHTML=nom+" a 1 emprunt en ce moment :";
				div.appendChild(titre);
				let par = document.createElement("p");
				par.innerHTML="- "+tab[0];
				div.appendChild(par);
				break;
			default:
				titre.innerHTML=nom+" a "+tab.length+" emprunts en ce moment :";
				div.appendChild(titre);
				for (let i = 0; i < tab.length; i++) {
					let par = document.createElement("p");
					par.innerHTML="- "+tab[i];
					div.appendChild(par);
				}
		}
		div.className="fenetre2";
		let window = document.createElement("aside");
		window.className="fenetre";
		window.appendChild(div);
		document.body.appendChild(window);
		close.addEventListener('click',function(){
			window.remove();
		});
	});
	requete.send(null);
}

//Livres

function loadLivresDisp(){
	let lien = "php/requeteLivreDispo.php";
	let requete = new XMLHttpRequest();
	requete.open("GET", lien, true);
	requete.addEventListener("load", function () {
		let xhrJSON = JSON.parse(requete.responseText);
		let tab = [];
		for (let i = 0; i < xhrJSON.length; i++) {
			let tab2 = [];
			tab2.push(xhrJSON[i]["idLivre"]);
			tab2.push(xhrJSON[i]["titreLivre"]);
			tab.push(tab2);
		}
		showLivres(tab,"listeLivresDisponibles");
	});
	requete.send(null);
}

function loadLivresEmp(){
	let lien = "php/requeteLivreEmprunt.php";
	let requete = new XMLHttpRequest();
	requete.open("GET", lien, true);
	requete.addEventListener("load", function () {
		let xhrJSON = JSON.parse(requete.responseText);
		let tab = [];
		for (let i = 0; i < xhrJSON.length; i++) {
			let tab2 = [];
			tab2.push(xhrJSON[i]["idLivre"]);
			tab2.push(xhrJSON[i]["titreLivre"]);
			tab.push(tab2);
		}
		showLivres(tab,"listeLivresEmpruntes");
	});
	requete.send(null);
}

function showLivres(tab,destination){
	document.getElementById(destination).innerHTML="";
	for (let i = 0; i < tab.length; i++) {
		let par = document.createElement("p");
		par.id=tab[i][0];
		par.innerHTML=tab[i][0]+"-"+tab[i][1];
		par.style.cursor = "pointer";
		document.getElementById(destination).appendChild(par);
	}
}

function windowLivreDispo(titre,idLivre){
	let div = document.createElement("div");
	let close = document.createElement("button");

	close.className="close";close.innerHTML="x";
	div.appendChild(close);
	let par = document.createElement("p");
	par.innerHTML="prêt de \""+titre+"\".";
	div.appendChild(par);
	let par2 = document.createElement("p");

	par2.innerHTML="n° de l'emprunteur ?";
	div.appendChild(par2);
	let input = document.createElement("input");
	input.id="idEmprunteur";
	input.type="text";
	div.appendChild(input);

	let submit = document.createElement("input");
	submit.type="button";
	submit.value="OK";
	div.appendChild(submit);

	div.className="fenetre2";
	let window = document.createElement("aside");
	window.className="fenetre";
	window.appendChild(div);

	document.body.appendChild(window);
	close.addEventListener('click',function(){
		window.remove();
	});
	submit.addEventListener('click',function(){
		emprunteLivre(idLivre,input,window);
	});
}

function emprunteLivre(idLivre,idAdherent,fenetre){

	let idAd = idAdherent.value;
	if (idAd == "") {
		alert("Renseignez un id d'adherent");
		return;//stoppe la fonction
	}
	let lien = "php/EmprunterUnLivre.php?idLivre="+idLivre+"&idAdherent="+idAd;
	let requete = new XMLHttpRequest();
	requete.open("GET", lien, true);
	requete.addEventListener("load", function () {
		fenetre.remove();
		loadLivresDisp();
		loadLivresEmp();
		loadAdherents();
	});
	requete.send(null);
}
function windowLivreEmprunted(idLivre,titreLivre){
	let lien = "php/getNomAdherentLivre.php?idLivre="+idLivre;
	let requete = new XMLHttpRequest();
	requete.open("GET", lien, true);

	requete.addEventListener("load", function () {
		let xhrJSON = JSON.parse(requete.responseText);
		let nom = xhrJSON[0]["nomAdherent"];
		let div = document.createElement("div");
		let close = document.createElement("button");
		close.className="close";close.innerHTML="x";
		div.appendChild(close);

		let par = document.createElement("p");
		par.innerHTML="Livre \""+titreLivre+"\" prêté à "+nom+".<br>Retour de ce livre ?";
		div.appendChild(par);

		let submit = document.createElement("input");
		submit.type="button";
		submit.value="OK";
		div.appendChild(submit);

		div.className="fenetre2";
		let fenetre = document.createElement("aside");
		fenetre.className="fenetre";
		fenetre.appendChild(div);
		document.body.appendChild(fenetre);

		close.addEventListener('click',function(){
			fenetre.remove();
		});
		submit.addEventListener('click',function(){
			rendreUnLivre()(idLivre,fenetre);
		});
	});
	requete.send(null);
}

function rendreUnLivre(idLivre,fenetre){
	let lien = "php/RendreUnLivre.php?idLivre="+idLivre;
	let requete = new XMLHttpRequest();
	requete.open("GET", lien, true);
	requete.addEventListener("load", function () {
		fenetre.remove();
		loadLivresDisp();
		loadLivresEmp();
		loadAdherents();
	});
	requete.send(null);
}

//EventListener

document.addEventListener('DOMContentLoaded',function(){
	loadAdherents();
});

document.addEventListener('DOMContentLoaded',function(){
	loadLivresDisp();
});

document.addEventListener('DOMContentLoaded',function(){
	loadLivresEmp();
});

document.getElementById("ajouterAdherent").addEventListener('click',function(){ //ajout d'adherent
	let nomAd = document.getElementById("nomAdherent").value;
	if (nomAd == "") {
		alert("Renseignez le nom d'adherent");
		exit(1);
	}
	let lien = "php/AjouterUnAdherent.php?name="+nomAd;
	let requete = new XMLHttpRequest();
	requete.open("GET", lien, true);
	requete.addEventListener("load", function () {
		loadAdherents();
		document.getElementById("nomAdherent").value="";
	});
	requete.send(null);
});

document.getElementById("ajouterLivre").addEventListener('click',function(){ //ajout de livre
	let nomLivre = document.getElementById("titreLivre").value;
	if (nomLivre == "") {
		alert("Renseignez le titre du livre");
		exit(1);
	}
	let lien = "php/AjouterUnLivre.php?name="+nomLivre;
	let requete = new XMLHttpRequest();
	requete.open("GET", lien, true);
	requete.addEventListener("load", function () {
		loadLivresDisp();
		document.getElementById("titreLivre").value="";
	});
	requete.send(null);
});


document.getElementById("listeAdherents").addEventListener('click',function(){
	let id = event.target.getAttribute("id");
	let lien = "php/requeteAdherent.php?id="+id;
	let requete = new XMLHttpRequest();
	requete.open("GET", lien, true);
	requete.addEventListener("load", function () {
		let xhrJSON = JSON.parse(requete.responseText);
		let tab = [];
		for (let i = 0; i < xhrJSON.length; i++) {
			let livre = xhrJSON[i]["titreLivre"];
			tab.push(livre);
		}
		windowAdherents(tab,id);
	});
	requete.send(null);

});

document.getElementById("listeLivresDisponibles").addEventListener('click',function(){
	let id = event.target.innerHTML;
	let tab = id.split("-");
	windowLivreDispo(tab[1],tab[0]);
});

document.getElementById("listeLivresEmpruntes").addEventListener('click',function(){
	let id = event.target.innerHTML;
	let tab = id.split("-");
	windowLivreEmprunted(tab[0],tab[1]);
});