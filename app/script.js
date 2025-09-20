// MAIN JS

// Listy v 1.0.4

$(document).ready(function () {
  // JS STARTS HERE //////////////////////////////////////////////////////////////



// SET SETTINGS 
if (!localStorage.getItem("settings")) {
  firstTime();
}


// SET INIT SETTINGS
function initSettings() {
  let settingsDegfaults = {
    "theme" : "Light",
    "fontSize" : "16",
    "isFirstTime" : true
  }
  localStorage.setItem("settings", JSON.stringify(settingsDegfaults));
}


function firstTime() {
  initSettings();
  console.log("First Time");
  settings.isFirstTime = false;
  localStorage.setItem("settings", JSON.stringify(settings));

  $("header, #listSection, #addSection, #listSection, #tabSection").hide();
  $("#tutorialSection").slideDown(200);
}


let fontSize = settings.fontSize || 16;
document.documentElement.style.setProperty("--fontSize", fontSize+"px");

$("#themeSelectorSettings").val(JSON.parse(localStorage.getItem("settings")).theme);
$("input[name='fontSize'][value='" + fontSize + "']").prop("checked", true);
















  // APPEND NEW LIST MODAL
  $("#addList").click(function () {
    $("#addPopup").fadeIn(100).css("display", "flex");
    // $("#addPopup").css({
    //   display: "flex",
    //   opacity: 0,
    // }).animate({ opacity: 1 }, 150);
    
    $("#categoryNameInputBox").focus();
    $("#listSection, #addSection").css({
        "opacity": "0.3",
        "pointer-events": "none" // prevent interaction while popup open
    });
  });

  $("#closeList").click(function () {
    $("#addPopup").fadeOut(100);
    $("#listSection, #addSection").css({
        "opacity": "1",
        "pointer-events": "auto" // allow interaction again
    });
  })


  // CREATE A LIST
  $("#addNewList").click(function(){
    // console.log("Adding a new list");
    $("#addPopup").slideUp(100);

    $("#listSection, #addSection").css({
        "opacity": "1",
        "pointer-events": "auto" // allow interaction again
    });

    var listName = $("#categoryNameInputBox").val();
    if(listName === "") {
      listName = "Untitled-" + String($(".tab").length + 1).padStart(2, "0");
    }


    localStorage.setItem(listName, JSON.stringify({data: [], tick: [], theme: "settings"}));
    
    colors();

    // SMOOTH APPEND THE LIST IN TAB
    $("#categoryNameInputBox").val("");
    $(".tab.active").removeClass("active");
    let $tabHTML = $(`<button class="tab">${listName}</button>`);
    $tabHTML.hide().appendTo("#tabSection").slideDown(300).addClass("active");

    // SHOW DATA OF SELECTED TAB
    let data = JSON.parse(localStorage.getItem(listName));
    $(".list-ul").empty();
    data.data.forEach((item, i) => {
      let $itemHTML = $(`
        <div class="item">
          <input type="checkbox" class="tick" data-index="${i}" />
          <input type="text" class="categoryName" data-index="${i}" value="${item}" readonly/>
          <button class="removeItem" data-index="${i}"><svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Menu / Close_MD"> <path id="Vector" d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg></button>
        </div>
        `);
      $itemHTML.appendTo(".list-ul").hide().slideDown(300);
    });

    $("#title").val(listName).hide().fadeIn(200);
  })


  // SHOW EXISTING LIST NAMES ON TAB SECTION 
  $("#tabSection").append(
    Object.keys(localStorage).filter(listName => listName !== "settings").map(listName => {
      let $tabHTML = $(`<button class="tab">${listName}</button>`);
      $tabHTML.appendTo("#tabSection");
      return $tabHTML;
    })
  );


  // SELECT TAB
  $(document).on("click", ".tab", function () {
    $(".tab").removeClass("active");
    $(this).addClass("active");

    colors();
    // console.log("Active : " + $(this).text());
  
    $("#title").val($(this).text()).hide().fadeIn(200);

    // $("#clearList").removeClass("hide");
    // $("#shareList").removeClass("hide");
    // $("#themeSelector").removeClass("hide");


    // SHOW DATA OF SELECTED TAB
    let data = JSON.parse(localStorage.getItem($(this).text()));
    $(".list-ul").empty();
    if(data.data.length === 0){
      $(".list-ul").append(`<p class="noItems"> No Items </p>`)
    }
    data.data.forEach((item, i) => {
      let $itemHTML = $(`
        <div class="item">
          <input type="checkbox" class="tick" data-index="${i}" />
          <input type="text" class="categoryName" data-index="${i}" value="${item}" readonly/>
          <button class="removeItem" data-index="${i}"><svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Menu / Close_MD"> <path id="Vector" d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg></button>
        </div>
        `);

      // TICK STATE
      if(data.tick.includes(item)){
        $itemHTML.find(".tick").prop("checked", true);
        $itemHTML.find(".categoryName").addClass("ticked");
      }

      $itemHTML.appendTo(".list-ul") // .hide().slideDown(300);
    });

  });



  let oldTitle = $("#title").val();
  // EDIT LIST
  $("#title").on("dblclick", function () {
    if($("#title").val() == "") return;
    $(this).attr("readonly", false).focus();
    oldTitle = $(this).val();
    $("#clearList, #shareList, #themeSelector").fadeIn(100).removeClass("hide");
  });

  // RENAME LIST
  $("#title").on("focusout", function () {

    $(this).attr("readonly", true);
    $("#clearList, #shareList").fadeOut(100);
    // #themeSelector

    let newTitle = $(this).val().trim();
    // console.log("New title : " + newTitle);
    // console.log("Old title : " + oldTitle);

    // if(newTitle === "") {
    //   alert("List name cannot be empty");
    //   $(this).val(oldTitle);
    //   return;
    // }

    if(newTitle !== oldTitle) {
      let data = localStorage.getItem(oldTitle);
      if(data) {
        localStorage.setItem(newTitle, data);
        localStorage.removeItem(oldTitle);

        // UPDATE TAB
        let $tab = $(".tab.active");
        $tab.text(newTitle);
        $tab.trigger("click");

        // Update oldTitle for next edit
        oldTitle = newTitle;
      } else {
        console.log("No data found for", oldTitle);
      }
    }
  });

  // CLEAR LIST
  $("#clearList").on("click", function () {
    if(confirm("Are you sure you want to clear this list?")) {
      localStorage.removeItem(oldTitle);
      window.location.href = "index.html";
    }
  });


  // COPY LIST
  $("#shareList").on("click", function () {
    // 1. GET TAB NAME
    let listName = $(".tab.active").text();
    if (!listName) return alert("No list selected");

    // 2. GET DATA
    let storedData = JSON.parse(localStorage.getItem(listName));
    if (!storedData || !storedData.data) return alert("No items to copy");

    // 3. FORMAT TEXT
    let textToCopy = `${listName}\n------------------------\n`;
    storedData.data.forEach(item => {
        textToCopy += `- ${item}\n`;
    });

    // COPY TO CLIPBOARD
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert("List copied to clipboard!");
    }).catch(err => {
        console.error("Failed to copy: ", err);
    });
  });





  // ADD ITEM TO A LIST 
  $("#itemForm").submit(function (e) {
    e.preventDefault();
    if($(".list-ul p").length) {
      $(".list-ul").empty();
    }

    // IF NO TAB IS ACTIVE
    if(!$(".tab.active").length){
      let untitledCount = $(".tab:contains('Untitled')").length + 1;
      let newName = "Untitled-" + String(untitledCount).padStart(2, "0");
      
      localStorage.setItem(newName, JSON.stringify({data: [], tick: []}));

      let $tabHTML = $(`<button class="tab active">${newName}</button>`);
      $("#tabSection .tab").removeClass("active");
      $("#tabSection").append($tabHTML.hide().slideDown(200));

      $("#title").val(newName).hide().fadeIn(200);
    }


    let item = $("#inputBox").val();
    if(item === "") return;
    let listName = $(".tab.active").text();


    let data = JSON.parse(localStorage.getItem(listName));
    data.data.push(item);

    localStorage.setItem(listName, JSON.stringify(data));
    console.log("Added " + item + " to " + listName);
    $("#inputBox").val("");

    // SMOOTH APPEND TO LIST
    
    let i = data.data.length-1;
    let $itemHTML = $(`
      <div class="item">
          <input type="checkbox" class="tick" data-index="${i}" />
          <input type="text" class="categoryName" data-index="${i}" value="${item}" readonly/>
          <button class="removeItem" data-index="${i}"><svg width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Menu / Close_MD"> <path id="Vector" d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg></button>
        </div>
        `);
        // TICK STATE
      if(data.tick.includes(item)){
        $itemHTML.find(".tick").prop("checked", true);
        $itemHTML.find(".categoryName").addClass("ticked");
      }
    $itemHTML.hide().appendTo(".list-ul").slideDown(200);
    i++;

    $("#inputBox").focus();

    // scroll page to bottom
    $(document).scrollTop($(document).height());



  });


  // IF A LIST EXIST BUT VALUE IS NULL - RESTORE CORRUPTED LIST
  for(let listName of Object.keys(localStorage)){
    if(localStorage.getItem(listName) == null){
      localStorage.setItem(listName, JSON.stringify({data: [], tick: []}));
    }
  }


  // MENU BTN 
  $("#menuBtn").click(function () {

    $("#tabSection, #listSection, #addSection").stop(true, true).slideToggle(200);

    $("#settings").stop(true, true).animate(
      { height: "toggle", opacity: "toggle" },
      250
    );
  });


  

  // SHOW OPTIONS 
  $(document).on("mouseenter", ".item", function() {
    $(this).find(".tick, .removeItem").fadeIn(100).css("display", "flex"); 
  });
  $(document).on("mouseleave", ".item", function() {
      $(this).find(".tick, .removeItem").fadeOut(100);
  });



  // EDIT A ITEM 
  let oldData = "";
  $(document).on("dblclick", ".categoryName", function(){
    $(this).prop("readonly", false).focus();
    oldData = $(this).val();
  }); 

  $(document).on("blur", ".categoryName", function(){
    $(this).prop("readonly", true);

    let newData = $(this).val();
    let index = parseInt($(this).attr("data-index"));
    let listName = $(".tab.active").text();
    let data = JSON.parse(localStorage.getItem(listName));

    if(newData === ""){
      // DELETE
      $(this).slideUp(200, function(){
        data.data.splice(index, 1);

        // Remove from tick if exists
        let tickIndex = data.tick.indexOf(oldData);
        if(tickIndex !== -1){
            data.tick.splice(tickIndex, 1);
        }

        localStorage.setItem(listName, JSON.stringify(data));

        // Update data-index for remaining inputs, tick and remove btn
        $(".item").each(function(i){
            $(this).find(".categoryName, .tick, .removeItem").attr("data-index", i);
        });
      });
    }else {
      // UPDATE
      data.data[index] = newData;

      // Update tick array if oldData existed
      let tickIndex = data.tick.indexOf(oldData);
      if(tickIndex !== -1){
          data.tick[tickIndex] = newData;
      }

      localStorage.setItem(listName, JSON.stringify(data));
    }
  });


  // DELETE ON BUTTON 
  $(document).on("click", ".removeItem", function(){
      let index = parseInt($(this).attr("data-index"));
      let listName = $(".tab.active").text();
      let data = JSON.parse(localStorage.getItem(listName));

      let removedItem = data.data[index];
      data.data.splice(index, 1);
      
      // Remove from tick if exists
      if(data.tick.includes(removedItem)){
          let tickIndex = data.tick.indexOf(removedItem);
          if(tickIndex !== -1){
              data.tick.splice(tickIndex, 1);
          }
      }

      localStorage.setItem(listName, JSON.stringify(data));

      let $list = $(this).closest(".list-ul");

      $(this).parent().slideUp(200, function(){
          $(this).remove();

          $list.find(".item").each(function(i){
            $(this).find(".categoryName, .tick, .removeItem").attr("data-index", i);
          });

          if($list.children().length === 0){
              $list.append("<p class='noItems'> No Items </p>");
          }
      });
  });


// TICK 
$(document).on("click", ".tick", function(){
  let $item = $(this).closest(".item");
  let itemName = $item.find(".categoryName").val().trim();
  let listName = $(".tab.active").text();
  let data = JSON.parse(localStorage.getItem(listName));

  if(!itemName) return; 

  if($(this).is(":checked")){
    if(!data.tick.includes(itemName)) data.tick.push(itemName);
    $item.find(".categoryName").addClass("ticked");
  } else {
    data.tick = data.tick.filter(v => v !== itemName);
    $item.find(".categoryName").removeClass("ticked");
  }

  localStorage.setItem(listName, JSON.stringify(data));
});


// THEME SELECTOR 
$(document).on("change", "#themeSelector", function(){
  let theme = $(this).val();
  let listName = $(".tab.active").text();
  let data = JSON.parse(localStorage.getItem(listName));
  data.theme = theme;
  localStorage.setItem(listName, JSON.stringify(data));

  colors();
});

// CHANGE THEME FROM SETTINGS
$(document).on("change", "#themeSelectorSettings", function(){
  let theme = $(this).val();
  let settings = JSON.parse(localStorage.getItem("settings"));
  settings.theme = theme;
  localStorage.setItem("settings", JSON.stringify(settings));
  colors();
})


// CUSTOM COLOR
function colors() {
  let theme = "";
  let settings = JSON.parse(localStorage.getItem("settings")) || {};
  let customTheme = JSON.parse(localStorage.getItem( $(".tab.active").text())) || {};

  theme = customTheme.theme || settings.theme ;
  if(customTheme.theme === "settings"){
    theme = settings.theme;
  }

  // COLORS
  const themeColors = {
    Light:  {bg:'#f2f4f8', text:'#000000', theme:'#ffffff', selected:'#333333ff'},
    Dark:   {bg:'#171717', text:'#fafafa', theme:'#2e2e2e', selected:'#abababff'},
    Blue:   {bg:'#bbdefb', text:'#0d1b2a', theme:'#e3f2fd', selected:'#0d1b2a'},
    Red:    {bg:'#ffd6d6', text:'#4d1f1f', theme:'#fff0f0', selected:'#4d1f1f'},
    Green:  {bg:'#d1e7dd', text:'#1d3b2a', theme:'#e5f2e8', selected:'#1d3b2a'},
    Orange: {bg:'#ffe8cc', text:'#5a3d2b', theme:'#fff4e5', selected:'#5a3d2b'},
    Lavender:{bg:'#e6d6ff', text:'#3e2b4d', theme:'#faf5ff', selected:'#3e2b4d'}
  };

  if(themeColors[theme]){
    for(let prop in themeColors[theme]){
      document.documentElement.style.setProperty(`--${prop}`, themeColors[theme][prop]);
    }
  }

  $("#themeSelector").val(theme);


}
colors();




// CHANGE FONT SIZE 
$("input[name='fontSize']").on("change", function(){
  let selectedFont = $("input[name='fontSize']:checked").val();
  console.log("Font : "+selectedFont);

  let settings = JSON.parse(localStorage.getItem("settings"));
  settings.fontSize = selectedFont;
  localStorage.setItem("settings", JSON.stringify(settings));

  // SET FONT SIZE
  document.documentElement.style.setProperty("--fontSize", selectedFont+"px");
})



// REFRESH APP 
$("#refreshApp").click(function(){
    // window.location.href = window.location.pathname + "?t=" + new Date().getTime();
    // window.location.reload();
    window.location.href = "index.html";
  });

// SHARE APP 
$("#shareApp").click(function(){
    let link = "https://muhib2929.github.io/listy/";
    const shareText = `📋 Discover Listy –  
Your smart and simple list manager. ✨  
🚀 Download now: ${link}`;
    navigator.clipboard.writeText(shareText).then(() => {
      alert("Link Copied ! Share it with your friends.");
    }).catch(err => {
      console.error("Failed to copy: ", err);
    });
});


// BUTTONS EVENTS 
$(document).on("click", ".slide", function() {
    $(this).next(".contents").slideToggle(200);
});

$(document).on("click", "#howToUse", function() {
    $("#howToUseContainer").slideToggle(200);
});

$("#settingsBtn").click(function() {
    $("#settings").slideToggle(200);
    $("#tutorialSection").hide();
});

$("#getStarted").click(function() {
    window.location.href = "index.html";
});

$("#resetApp").click(function() {
    let sure = confirm("Are you sure you want to reset the app ?")
    if(!sure) return;
    localStorage.clear();
    window.location.href = "index.html";
});

$("#tutorial").click(function() {
  $("#settings").hide();
  $("#tutorialSection").slideToggle(200);
});

$(".branding").click(function() {
  window.location.href = "https://muhib68442.github.io/listy";
});



// IMPORT NOTES
$("#importBtn").click(function (e) {
  e.preventDefault();

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "application/json";

  fileInput.onchange = function () {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const imported = JSON.parse(e.target.result);

        // check format
        if (imported.listName && imported.data) {
          localStorage.setItem(imported.listName, JSON.stringify(imported.data));

          // in-page message instead of alert
          const msgDiv = document.createElement("div");
          msgDiv.textContent = `List "${imported.listName}" imported successfully ✅`;
          msgDiv.style.cssText = "position:fixed;top:20px;right:20px;background:#4caf50;color:#fff;padding:10px;border-radius:5px;z-index:9999;";
          document.body.appendChild(msgDiv);

          setTimeout(() => {
            msgDiv.remove();
            // optional: reload if needed
            // window.location.href = "index.html";
          }, 2000);

        } else {
          const msgDiv = document.createElement("div");
          msgDiv.textContent = "❌ Invalid file format. Please select a valid Listy JSON file.";
          msgDiv.style.cssText = "position:fixed;top:20px;right:20px;background:#f44336;color:#fff;padding:10px;border-radius:5px;z-index:9999;";
          document.body.appendChild(msgDiv);
          setTimeout(() => msgDiv.remove(), 2000);
        }
      } catch (err) {
        const msgDiv = document.createElement("div");
        msgDiv.textContent = "⚠️ Error reading file. Not a valid JSON.";
        msgDiv.style.cssText = "position:fixed;top:20px;right:20px;background:#ff9800;color:#fff;padding:10px;border-radius:5px;z-index:9999;";
        document.body.appendChild(msgDiv);
        setTimeout(() => msgDiv.remove(), 2000);
      }
    };

    reader.readAsText(file);
  };

  fileInput.click();
});




// EXPORT NOTES
$("#exportBtn").click(function(e) {
  e.preventDefault();
  $(".exportContainer").slideToggle(200).css("display", "flex");
});

// Render all notes in Select tag
function allList(){
  let list = "";

  for(let i=0; i<localStorage.length; i++){
    let key = localStorage.key(i);
    if(key !== "settings"){
      list += `<option value="${key}">${key}</option>`;
    }
  }
  $("#selectListToExport").html(list);
}
allList();

// EXPORT PROCESS
$("#exportSelectedBtn").click(function(e){
  e.preventDefault();

  let selectedList = $("#selectListToExport").val();
  if(!selectedList) return;

  let notes = JSON.parse(localStorage.getItem(selectedList));
  let exportData = {
    listName: selectedList,
    data: notes
  };

  let json = JSON.stringify(exportData, null, 2);

  // filename
  let now = new Date();
  let hr   = String(now.getHours()).padStart(2, "0");
  let min  = String(now.getMinutes()).padStart(2, "0");
  let dd   = String(now.getDate()).padStart(2, "0");
  let mm   = String(now.getMonth() + 1).padStart(2, "0");
  let yy   = String(now.getFullYear()).slice(-2);
  let filename = `listy-${selectedList}-${hr}-${min}-${dd}-${mm}-${yy}.json`;

  // create blob and download
  let blob = new Blob([json], { type: "application/json" });
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a); // temporary append
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);

  $(".exportContainer").slideToggle(200);

  // in-page message instead of alert
  const msgDiv = document.createElement("div");
  msgDiv.textContent = "List Exported Successfully ✅";
  msgDiv.style.cssText = "position:fixed;top:20px;right:20px;background:#4caf50;color:#fff;padding:10px;border-radius:5px;z-index:9999;";
  document.body.appendChild(msgDiv);
  setTimeout(() => msgDiv.remove(), 2000);
});






  // JS ENDS HERE //////////////////////////////////////////////////////////////////
});
