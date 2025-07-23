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

// Seleccionar elementos del DOM
const inputEl = document.getElementById("input-el")
const inputBtn = document.getElementById("input-btn")
const ulEl = document.getElementById("ul-el")

function render(leads) {
   let listItems = ""
   for (let i = 0; i < leads.length; i++) {
      const cleanUrl = removeProtocol(leads[i])
      const escapedUrl = escapeHtml(cleanUrl)
      listItems += `
         <li>
            <a target='_blank' href='https://${escapedUrl}'>
               ${escapedUrl}
            </a>
         </li>
      `
   }
   ulEl.innerHTML = listItems
}

function escapeHtml(urlText) {
   const div = document.createElement("div")
   div.textContent = urlText
   return div.innerHTML
}

function removeProtocol(url) {
   const trimmedUrl = url.trim().split(/\s+/).join("")
   const prefixes = ["https://www.", "http://www.", "https://", "http://", "www."]
   for (const prefix of prefixes) {
      if (trimmedUrl.startsWith(prefix)) {
         return trimmedUrl.replace(prefix, "")
      }
   }
   return trimmedUrl
}

onValue(referenceInDB, function(snapshot) {
   const snapshotDoesExist = snapshot.exists()
   if (snapshotDoesExist) {
      const snapshotValues = snapshot.val()
      const leads = Object.values(snapshotValues)
      render(leads)
   }
})

inputEl.addEventListener("keypress", (e) => {
   if (e.key === "Enter") inputBtn.click()
})

inputBtn.addEventListener("click", () => {
   push(referenceInDB, inputEl.value.trim())
   inputEl.value = "" 
})

document.getElementById("delete-btn").addEventListener("dblclick", function() {
   remove(referenceInDB)
   ulEl.innerHTML = ""
})