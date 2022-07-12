
let edit_record_id = -1;
const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
const STORAGE_API_HOST = isLocalhost ? `http://localhost:3000` : `https://ca1adesmodulemanagementsystem.herokuapp.com`;

//button form selector
const InsertButton = document.querySelector('#insert-btn');
    const editButton = document.querySelector('#edit-btn');
    const editcancelButton = document.querySelector('#edit-cnl-btn');
    const tableBody = document.querySelector('#generatedTableData');
    const tablecreditunit=document.querySelector('#DisplayCreditUnit');

    // Add module
    const moduleNameInput = document.querySelector('#moduleName');
    const creditInput = document.querySelector('#creditUnit');

  

    

window.onload = function loadScreen() {
  document.getElementById("edit-heading").style.display = "none";
  document.getElementById("edit-btn").style.display = "none";
  document.getElementById("edit-cnl-btn").style.display = "none";
  loadModulesFromServer();

};

function ClearModulefromtable() {
  const tableBody = document.getElementById("generatedTableData");  
  tableBody.innerHTML = '';
}

function loadModulesFromServer() {
  // Get data from server
  let html = ``;
  fetch(`${STORAGE_API_HOST}/Module`)
      .then((response) => response.json())
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          const module = data[i];
        const row =`
        <tr>
          <th scope="row">${module["id"]}</th>
         <td>${module["modulename"]}</td>
           <td>${module["creditunit"]}</td>
           <td><button onclick="updateCreditunitFromServer(${module["id"]})
   " class="btn btn-info">Edit</button></td>
           <td><button data-toggle="modal" data-target="#deleteModalCenter" onclick="deleteModulefromServer(${module["id"]})
    " class="btn btn-danger">Delete</button></td>
       </tr>
     `;
          html += row;
        }
        const tableBody = document.getElementById("generatedTableData");  
        tableBody.innerHTML = html;
      })
      .catch((error) => alert(error.message))
}

function loadDataFromLocalStorage() {
  const tableBody = document.getElementById("generatedTableData");
  
  let tableData = JSON.parse(localStorage.getItem("crudtable")) || [];
  tableBody.innerHTML = "";
  let html = ``;
  if (tableData) {
   tableData.forEach((data, idx) => {
    fetch(`${STORAGE_API_HOST}/Module`,
    {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
      body: tableData,
  })
      .then((response) => response.json())
      .then((data) => console.log(data)({
      })
      .catch((error) => alert(error.message))
      )

     html += `
            <tr>
              <th scope="row">${idx + 1}</th>
             <td>${data.moduleName}</td>
               <td>${data.creditUnit}</td>
               <td><button onclick="updateDataFromLocalStorage('${data.record_id
       }')" class="btn btn-info">Edit</button></td>
               <td><button data-toggle="modal" data-target="#deleteModalCenter" onclick="deleteDataFromLocalStorage('${data.record_id
        }')" class="btn btn-danger">Delete</button></td>
           </tr>
         `;
    });
 }
  tableBody.innerHTML = html;
}

function getcreditunitbyModuleName() {
     //searchModulenameforcreditunit
     let html = ``;
     const searchModulenameiInput = document.getElementById("searchmoduleName").value;
     fetch(`${STORAGE_API_HOST}/Module/${searchModulenameiInput}`,
     {
       method: 'GET',
       headers: {
           'Content-Type': 'application/json',
       },
   })
   
       .then((response) => response.json())
       .then((data) =>  {
         {
          const module = data.creditUnit;
          console.log(module);
        const row =`
        <tr>
          <th scope="row">${module["creditunit"]}</th>
       </tr>
     `;
          html += row;
        }

        
        
        const tablecreditunit = document.getElementById("DisplayCreditUnit");  
        tablecreditunit.innerHTML = html;

        const params = { modulename: searchModulenameiInput};

      })
  
    
       
      
      .catch((error) => alert(error.message))
}

function validate(field1, field2) {
  if (Boolean(field1) && Boolean(field2)) {
    return true;
  } else {
    return false;
  }
}

function genrateUniqueId(length) {
  var randomChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var result = "";
  for (var i = 0; i < length; i++) {
    result += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }
  return result;
}


function createNewRecord() {
  const currentModuleName = document.getElementById("moduleName").value;
  const currentcreditUnit = document.getElementById("creditUnit").value;
  if (validate(currentModuleName, currentcreditUnit)) {
   // let modules={currentModuleName,currentcreditUnit}
    fetch(`${STORAGE_API_HOST}/Module`,
     {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({currentModuleName,currentcreditUnit}),
  })
      .then((response) => {
        if (response.status === 201) {
          // Ok
          loadModulesFromServer()
          return showSnakeBar("Successfully add new Module info", "success", 1500);
        } else {
          response.json().then((error) => { throw error });
        }
      })
      .catch((error) => alert(error.message))
    
    emptyFieldBox();
  } else {
    showSnakeBar("Error adding the Module info", "error", 1500);
    emptyFieldBox();
  }
}

//deleteModulefromServer
function deleteModulefromServer(records_id){
  //$("#deleteModelBtn").on("click", function () {
   // const records_id = document.getElementById("recordid").value;
    console.log(records_id);
    fetch(`${STORAGE_API_HOST}/Module/${records_id}`,
    {
     method: 'DELETE',
     headers: {
         'Content-Type': 'application/json',
     },
 })
 .then((response) => {
  if (response.status === 200) {
    // Ok
    loadModulesFromServer()
  //   .then((data) =>console.log(data)) 
     .catch((error) => alert(error.message))
    showSnakeBar("Successfully delete the Record", "success", 1500);
    loadModulesFromServer();
// });
  $("#deleteCnlModelBtn").on("click", function () {
    showSnakeBar("Cancelled deleting the Record", "cancelled", 1500);
    loadModulesFromServer();
  });
}})

}

function deleteDataFromLocalStorage(records_id) {
  $("#deleteModelBtn").on("click", function () {
    fetch(`${STORAGE_API_HOST}/Module`,
    {
     method: 'DELETE',
     headers: {
         'Content-Type': 'application/json',
     },
 })
     .then((response) => response.json())
     .then((data) =>console.log(data)) 
     .catch((error) => alert(error.message))
    let tableData = JSON.parse(localStorage.getItem("crudtable")) || [];
    tableData = tableData.filter(({ record_id }) => record_id !== records_id);
    localStorage.setItem("crudtable", JSON.stringify(tableData));
    showSnakeBar("Successfully delete the Record", "success", 1500);
    loadDataFromLocalStorage();
  });
  $("#deleteCnlModelBtn").on("click", function () {
    showSnakeBar("Cancelled deleting the Record", "cancelled", 1500);
    loadDataFromLocalStorage();
  });
}


//update creditunit from server 
function updateCreditunitFromServer() {
  
  displayNoneInsertMarkup();
  fetch(`${STORAGE_API_HOST}/Module/`,{
     method:'GET',
     headers: {
      'Content-Type': 'application/json',
     },
})
.then((response) => {
  response.json();
})
  updateFields(creditUnit);
}




function updateButtonPress() {
  const moduleid = document.getElementById("moduleName").value;
  const creditunit = document.getElementById("creditUnit").value;
  console.log(moduleid);
  console.log(creditunit);
  fetch(`${STORAGE_API_HOST}/Module/${moduleid}/${creditunit}`,{
     method:'PUT',
     headers: {
      'Content-Type': 'application/json',
     },
})
.then((response) => {
  response.json();
   displayNoneEditMarkup();
  emptyFieldBox();
  showSnakeBar("Successfully updated the creditUnit info", "success", 1500);
  loadModulesFromServer();
})
  
 
}

function updateCancelButton() {
  displayNoneEditMarkup();
  emptyFieldBox();
  showSnakeBar("Cancelled updating the creditUnit", "cancelled", 1500);
}

function emptyFieldBox() {
  document.getElementById("moduleName").value = "";
  document.getElementById("creditUnit").value = "";
}
function updateFields(creditUnit) {
  document.getElementById("creditUnit").value =creditUnit;
}



function displayNoneInsertMarkup() {
  document.getElementById("insert-heading").style.display = "none";
  document.getElementById("insert-btn").style.display = "none";
  document.getElementById("edit-heading").style.display = "block";
  document.getElementById("edit-btn").style.display = "block";
  document.getElementById("edit-cnl-btn").style.display = "block";
}

function displayNoneEditMarkup() {
  document.getElementById("insert-heading").style.display = "block";
  document.getElementById("insert-btn").style.display = "block";
  document.getElementById("edit-heading").style.display = "none";
  document.getElementById("edit-btn").style.display = "none";
  document.getElementById("edit-cnl-btn").style.display = "none";
}

function showSnakeBar(msg, type, interval) {
  var snackbar = document.getElementById("snackbar");
  snackbar.innerHTML = `<span>${msg}</span> <button style="margin-left: 10px;" class="btn ${type === "success"
    ? "btn-outline-success"
    : type === "cancelled"
      ? "btn-outline-info"
      : type === "error"
        ? "btn-outline-danger"
        : "btn-outline-warning"
    }"> ${type.toUpperCase()} </button>`;
  snackbar.style.color =
    type === "success"
      ? "green"
      : type === "cancelled"
        ? "#007bff"
        : type === "error"
          ? "red"
          : "#ffc107";
  snackbar.className = "show";
  setTimeout(function () {
    snackbar.className = snackbar.className.replace("show", "");
  }, interval
  );
  InsertButton.onclick = function () {
    const modules = createNewRecord();
  
    fetch(`${STORAGE_API_HOST}/Module`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(modules),
    })
        .then((response) => response.json())
        .then((json) => {
            
        })
        .catch((error) => alert(error.message))
        .finally(() => enablePage());
        
};

  
}

function showSnakeBar(msg, type, interval) {
  var snackbar = document.getElementById("snackbar");
  snackbar.innerHTML = `<span>${msg}</span> <button style="margin-left: 10px;" class="btn ${type === "success"
    ? "btn-outline-success"
    : type === "cancelled"
      ? "btn-outline-info"
      : type === "error"
        ? "btn-outline-danger"
        : "btn-outline-warning"
    }"> ${type.toUpperCase()} </button>`;
  snackbar.style.color =
    type === "success"
      ? "green"
      : type === "cancelled"
        ? "#007bff"
        : type === "error"
          ? "red"
          : "#ffc107";
  snackbar.className = "show";
  setTimeout(function () {
    snackbar.className = snackbar.className.replace("show", "");
  }, interval);

  


  
}