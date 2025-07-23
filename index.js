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


function escapeHtml(urlText) {
   const div = document.createElement("div")
   div.textContent = urlText
   return div.innerHTML
}

function removeProtocol(url) {
   const trimmedUrl = url.split(/\s+/).join("")
   const prefixes = ["https://www.", "http://www.", "https://", "http://", "www."]
   for (const prefix of prefixes) {
      if (trimmedUrl.startsWith(prefix)) {
         return trimmedUrl.replace(prefix, "")
      }
   }
   return trimmedUrl
}

function render(leads) {
   let listItems = ""
   for (let i = 0; i < leads.length; i++) {
      const cleanUrl = removeProtocol(leads[i])
      const escapedText = escapeHtml(cleanUrl)
      listItems += `
         <li>
            <a target='_blank' href='https://${escapedText}'>
               ${escapedText}
            </a>
         </li>
      `
   }
   ulEl.innerHTML = listItems
}

onValue(referenceInDB, function(snapshot) {
   if (snapshot.exists()) {
      const leads = Object.values(snapshot.val())
      render(leads)
   }
   else {
      ulEl.innerHTML = ""
   }
}, (error) => {
   console.error("Error reading data from Firebase", error)
})

inputBtn.addEventListener("click", () => {
   const cleanUrl = removeProtocol(inputEl.value)
   push(referenceInDB, cleanUrl)
   inputEl.value = "" 
})

inputEl.addEventListener("keydown", (e) => {
   if (e.key === "Enter") inputBtn.click()
})

document.getElementById("delete-btn").addEventListener("dblclick", function() {
   remove(referenceInDB)
   ulEl.innerHTML = ""
})