// importar funciones desde Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js"
import { getDatabase,
         ref,
         push,
         onValue,
         remove } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js"

// Configuración de Firebase con la URL de la base de datos en tiempo real para almacenar leads
const firebaseConfig = {
   databaseURL: "https://leads-tracker-app-4577d-default-rtdb.europe-west1.firebasedatabase.app/"
}

// Inicializa Firebase con la configuración de la base de datos en tiempo real
const app = initializeApp(firebaseConfig)
// Obtiene la instancia de la base de datos
const database = getDatabase(app)
// Referencia al nodo "leads" donde se almacenan las URLs
const referenceInDB = ref(database, "leads")


const inputEl = document.getElementById("input-el")
const ulEl = document.getElementById("ul-el")

function render(leads) {
   let listItems = ""
   for (let i = 0; i < leads.length; i++) {
      listItems += `
         <li>
            <a target='_blank' href='${leads[i]}'>
               ${leads[i]}
            </a>
         </li>
      `
   }
   ulEl.innerHTML = listItems
}

onValue(referenceInDB, function(snapshot) {
   const snapshotDoesExist = snapshot.exists()
   if (snapshotDoesExist) {
      const snapshotValues = snapshot.val()
      const leads = Object.values(snapshotValues)
      render(leads)
   }
})

document.getElementById("delete-btn").addEventListener("dblclick", function() {
   remove(referenceInDB)
   ulEl.innerHTML = ""
})

document.getElementById("input-btn").addEventListener("click", function() {
   push(referenceInDB, inputEl.value)
   inputEl.value = "" 
})