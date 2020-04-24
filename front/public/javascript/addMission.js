/**
 *
 * Requests the server to publish a mission
 * @TODO: this script is a piece of shit -> to refactor ASAP
 */

var servResponse = "";

Dropzone.options.myDZ = {
  //Client side controls
  maxFiles: 1,
  acceptedFiles: ".pbo",
  maxFilesize: 20, // MB
  dictDefaultMessage: "Pbo dropzone here ! (or click to choose a file)",

  init: function() {
  
    //The file was correctly submitted. The client recieves a 202 htpp code if there were errors during mission check, 200 if no error. We open a modal that displays server response.
    this.on("success", function(file, response) {
      /*Important trick : these two lines of code print function arguments in the console !
      var args = Array.prototype.slice.call(arguments);
      console.log(args); 
      */
      //console.log(file.xhr.status);
      //console.log(response);
      servResponse = response;
      if (file.xhr.status === 202) {
        //Server response : we get a 202 if some controls failed
        loadFailure(response);
      } else if (file.xhr.status === 200) {
        //Server response : we get a 200 if everything is OK
        loadSuccess(response);
      }
    });
    
    //@TODO: server error
    this.on("error", function( file, errorMsg, res ) {
      console.log(res);
    });

    var _this = this;

  },
};

function loadSuccess(response) {
    let textNode = "";
    let node = "";
    const list = document.getElementById("msgSuccessContent");
    const classIfFalse = "w3-text-deep-orange";
    const classWarning = "w3-deep-orange";
    for (const key in response) {
      
      switch (key) {
        case "missionBriefing":
          break;
        case "missionIsPlayable":
          break;
        case "pboFileSize":
          node = document.createElement("LI");
          textNode = document.createTextNode(response[key].label + " : " + new Intl.NumberFormat().format(response[key].val));
          break;
        case "pboFileDateM":
          node = document.createElement("LI");
          fmtDtePublish = new Date(response[key].val).toLocaleDateString("fr-FR", {hour:"2-digit", minute:"2-digit"});
          textNode = document.createTextNode(response[key].label + " : " + fmtDtePublish);
          break;
        case "loadScreen":
          node = document.createElement("LI");
          if (!response[key].val) {
            textNode = document.createTextNode(response[key].label + " : pas d'image de présentation trouvée");
            node.classList.add(classIfFalse);
          } else if (response[key].val === "Image not found") {
            textNode = document.createTextNode(response[key].label + " : l'image référencée dans la mission n'a pas été trouvée");
            node.classList.add(classIfFalse);
          } else {
            textNode = document.createTextNode(response[key].label + " : une image de présentation a été trouvée");
          }
          break;
        case "IFA3mod":
          if (response[key].val === true) {
            node = document.createElement("LI");
            textNode = document.createTextNode(response[key].label);
            node.classList.add(classWarning);
          }
          break;
        default:
          node = document.createElement("LI");
          //Info is missing
          if (response[key].val === false) {       
            textNode = document.createTextNode(response[key].label + " : non renseigné");
            node.classList.add(classIfFalse);
          //Info is present
          } else {
            textNode = document.createTextNode(response[key].label + " : " + response[key].val);
          }
      }
      node.appendChild(textNode);
      list.appendChild(node);
    }
        
    document.getElementById("modalSuccess").style.display="block";
}

function loadFailure(response) {
  
  let textNode = "";
  let node = "";
  const list = document.getElementById("msgFailContent");

  //Print response by traversing JSON response object
  for (const key in response) {
    switch (key) {
      case "nbBlockingErr":
        document.getElementById("msgHead").innerText = "Mission non publiable : " + response.nbBlockingErr + " erreur(s) bloquante(s)";
        break;
      case "isMissionValid":
        break;
      default:
        node = document.createElement("LI");
        //check reported an error
        if (response[key].isOK === false) {       
          //this is a blocking error
          if (response[key].isBlocking) {
            textNode = document.createTextNode(response[key].label + " : NON (erreur bloquante)");
            node.appendChild(textNode);
            node.classList.add("w3-red");
          //this is NOT a blocking error
          } else {
            textNode = document.createTextNode(response[key].label + " : NON (erreur non bloquante)");
            node.appendChild(textNode);
            node.classList.add("w3-orange");
          }
          //node.appendChild(textNode);
          list.appendChild(node);
        //check reported NO error
        } else {
          node = document.createElement("LI");
          textNode = document.createTextNode(response[key].label + " : OK !");
        }
        node.appendChild(textNode);
        list.appendChild(node);
    }
  }  
  document.getElementById("modalFailure").style.display="block";
}

function resetPage(elID) {
      //Clears dropzone and cancel uploads
      let myDropzone = Dropzone.forElement("#myDZ");
      myDropzone.removeAllFiles(true);
      if (elID) {
        const elToRemove = document.getElementById(elID);
        while (elToRemove.hasChildNodes()) {  
          elToRemove.removeChild(elToRemove.firstChild);
        }
      }
      
      /*
      //@TODO: Removes file from server
      var name = file.name;        
      $.ajax({
          type: 'POST',
          url: 'delete.php',
          data: "id="+name,
          dataType: 'html'
      });
      */
}

/**
 *
 * Publishes the mission to the server and saves the mission information in the database
 * 
 */
function publishMission() {
  //console.log(JSON.stringify(servResponse));
  fetch("/mission/add/confirm", {
    method: "POST",
    headers: { "content-type": "application/json"},
    body: JSON.stringify(servResponse),
  })
  .then (function (response) {
    if (response.ok) {
        showHide("msgOK");
        setTimeout(function(){ showHide("msgOK");}, 5000);
        document.getElementById("modalSuccess").style.display="none";
        resetPage("msgSuccessContent");
    }
    else {
      console.log("Huho... Somethin' went wrong. Server has responded :");
      errMsg.innerText = response.status + ")";
      console.log(response.status);
      showHide("msgError");
      setTimeout(function(){ showHide("msgError");}, 10000);
      document.getElementById("modalSuccess").style.display="none";
      resetPage("msgSuccessContent");
    }
  })
  .catch(function(error) {
    document.getElementById("modalSuccess").style.display="none";
    errMsg.innerText = error  + ")";
    console.log(error);
    showHide("msgError");
    setTimeout(function(){ showHide("msgError");}, 10000);
    resetPage("msgSuccessContent");
  });
}