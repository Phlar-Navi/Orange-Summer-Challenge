let users = JSON.parse(localStorage.getItem("users")) || [
    {
        id: 1,
        nom: "Test",
        prenom: "User",
        email: "Testuser@gmail.com",
        poste: "Développeur Web"
    }
];

const form = document.getElementById("formulaire");
const form_mod = document.getElementById("formulaire_mod");
const conteneur = document.getElementById("listeEmployes");

const message = document.getElementById("message");
const message_deux = document.getElementById("message_deux");
const message_vide = document.getElementById("message-vide");

let idEmployeChoisi = null;

let taille = users.length;

updateEmployes();

async function updateEmployes(){
    let listHTML = "";
    if (users.length > 0) {
        message_vide.innerText = "";
        users.forEach(element => {
            let currentid = element.id;
            listHTML += `
            <tr>
                <td> ${element.nom} </th>
                <td> ${element.prenom} </th>
                <td> ${element.email} </th>
                <td> ${element.poste} </th>
                    <td style="display:flex; flex-direction:column; padding: 10px; gap:10px;"> 
                        <button onclick="supprimerEmploye(id)" class="btn-reset"> Supprimer </button> 
                        <button onclick="OuvrirModifier(${currentid})" class="btn-reset"> Modifier </button>
                    </td>
            </tr>
        `
        });
    } else {
        message_vide.innerText = "Aucun employé à afficher";
    }

    conteneur.innerHTML = listHTML;
    localStorage.setItem("users", JSON.stringify(users));
}

async function supprimerEmploye(index) {
    const choix = confirm("Voulez vous vraiment supprimer cet employé ?");
    if (choix) {
        users.splice(index, 1);
        localStorage.setItem("users", JSON.stringify(users));
        updateEmployes();
        message_deux.innerText = "Employé supprimé avec succès !";
        setTimeout(()=>{
            message_deux.innerText = "";
        }, 3000);
    }
}

async function formatDonnees(){
    const nom = document.getElementById("nom").value;
    const prenom = document.getElementById("prenom").value;
    const email = document.getElementById("email").value;
    const poste = document.getElementById("poste").value;

    const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
    const id = maxId + 1;

    return {
        id: id,
        nom: nom,
        prenom: prenom,
        email: email,
        poste: poste
    };
}

function trouverEmploye(index){
    let idRecherche = index;
    console.log(idRecherche);
    let utilisateur = users.find(u => u.id === idRecherche);

    if (utilisateur) {
        console.log("Employé trouvé :", utilisateur)
        return utilisateur;
    } else {
        console.log("Aucun employé avec cet ID.");
        return null;
    }
}

function showSidebar(){
    const sidebar = document.querySelector('.mobileLinks');
    sidebar.style.display = 'flex';
}

function hideSidebar(){
    const sidebar = document.querySelector('.mobileLinks');
    sidebar.style.display = 'none';
}

function OuvrirModifier(id) {
    const overlay = document.querySelector(".overlay");
    overlay.style.display = "flex";
    const modal = document.querySelector(".modale");
    modal.style.display = "flex";

    const user = trouverEmploye(id);
    if (!user) return alert("Employé introuvable");

    document.getElementById("nom_mod").value = user.nom;
    document.getElementById("prenom_mod").value = user.prenom;
    document.getElementById("email_mod").value = user.email;
    document.getElementById("poste_mod").value = user.poste;

    idEmployeChoisi = id;
}

function FermerModifier(){
    const overlay = document.querySelector(".overlay");
    const modal = document.querySelector(".modale");
    overlay.style.display = "none";
    modal.style.display = "none";
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = await formatDonnees();
    message.innerText = "Employé ajouté avec succès !";

    setTimeout(()=>{
        message.innerText = "";
    }, 3000);

    users.push(data);
    updateEmployes();
    form.reset();
});

form_mod.addEventListener("submit", (e) => {
    e.preventDefault();

    if (idEmployeChoisi === null) {
        alert("Aucun employé sélectionné pour modification.");
        return;
    }

    const index = users.findIndex(u => u.id === idEmployeChoisi);
    if (index === -1) {
        alert("Employé introuvable.");
        return;
    }

    users[index].nom = document.getElementById("nom_mod").value;
    users[index].prenom = document.getElementById("prenom_mod").value;
    users[index].email = document.getElementById("email_mod").value;
    users[index].poste = document.getElementById("poste_mod").value;

    localStorage.setItem("users", JSON.stringify(users));
    updateEmployes();
    FermerModifier();

    message_deux.innerText = "Employé modifié avec succès !";

    setTimeout(()=>{
        message_deux.innerText = "";
    }, 3000);

});
