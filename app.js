let editWordNode;
let $btns;
let $synonimPopup;
const API_BASE_URL = "https://api.datamuse.com/words?rel_syn=";

const FormatSyle = {
  weight: btn => {
    if (btn.classList.contains("active")) {
      editWordNode.style.fontWeight = "";
      btn.classList.remove("active");
    } else {
      editWordNode.style.fontWeight = "bold";
      btn.classList.add("active");
    }
  },
  italic: btn => {
    if (btn.classList.contains("active")) {
      editWordNode.style.fontStyle = "";
      btn.classList.remove("active");
    } else {
      editWordNode.style.fontStyle = "italic";
      btn.classList.add("active");
    }
  },
  unterline: btn => {
    if (btn.classList.contains("active")) {
      editWordNode.style.textDecoration = "";
      btn.classList.remove("active");
    } else {
      editWordNode.style.textDecoration = "underline";
      btn.classList.add("active");
    }
  }
};

function getMockText() {
  return new Promise(function(resolve, reject) {
    resolve(
      "A year ago I was in the audience at a gathering of designers in San Francisco. There were four designers on stage, and two of them worked for me. I was there to support them. The topic of design responsibility came up, possibly brought up by one of my designers, I honestly don’t remember the details. What I do remember is that at some point in the discussion I raised my hand and suggested, to this group of designers, that modern design problems were very complex. And we ought to need a license to solve them."
    );
  });
}

function changeStyle() {
  if (!document.querySelector("#file span.edit-mode")) return;

  let _btn = this;
  switch (_btn.getAttribute("id")) {
    case "btn-bold":
      FormatSyle.weight(this);
      break;
    case "btn-italic":
      FormatSyle.italic(this);
      break;
    case "btn-underline":
      FormatSyle.unterline(this);
      break;
    default:
      return;
  }
}

function checkCurrentStyles() {
  if (document.querySelectorAll("button.active").length > 0) {
    for (i = 0; i < $BTNS.length; i++) {
      $BTNS[i].classList.remove("active");
    }
  }

  let { fontStyle, fontWeight, textDecoration } = editWordNode.style;

  if (fontStyle !== "") {
    document.getElementById("btn-italic").classList.add("active");
  }

  if (fontWeight !== "") {
    document.getElementById("btn-bold").classList.add("active");
  }

  if (textDecoration !== "") {
    document.getElementById("btn-underline").classList.add("active");
  }
}

function changeWord() {
  editWordNode.textContent = this.textContent + " ";
  return;
}

function showPopup(data) {
  wordContainer = document.createElement("div");

  if (data.length == 0) {
    $synonimPopup.appendChild(wordContainer).textContent =
      "Nothing Found";

      $synonimPopup.style.display = "block";

    return;
  }

  data.map(word => {
    let el = document.createElement("span");
    el.textContent = word.word;
    wordContainer.appendChild(el);
  });

  $synonimPopup.appendChild(wordContainer);
  $synonimPopup.style.display = "block";

  let newWords = document.querySelectorAll("#synonims div span");
  for (i = 0; i < newWords.length; i++) {
    newWords[i].addEventListener("click", changeWord);
  }

}

function showSynonimusPopup(word) {
  word = word.trim();

  let RegExp = /[\.|\,]/;

  if (RegExp.test(word)) {
    word = word.replace(RegExp, "");
  }

  fetch(API_BASE_URL + word)
    .then(response => response.json())
    .then(showPopup);
}

function editMode(event) {
  if (document.querySelector("#file span.edit-mode")) {
    document
      .querySelector("#file span.edit-mode")
      .classList.remove("edit-mode");
  }

  if (document.querySelector("#synonims div")) {
    document.querySelector("#synonims div").remove();
  }

  editWordNode = event.target;
  editWordNode.classList.add("edit-mode");

  checkCurrentStyles();

  for (i = 0; i < $btns.length; i++) {
    $btns[i].addEventListener("click", changeStyle);
  }

  showSynonimusPopup(editWordNode.textContent);
}

function init() {

  $btns = document.querySelectorAll("#format-actions button");
  $synonimPopup = document.getElementById("synonims");

  getMockText()
    .then(text => {
      document.getElementById("file").innerHTML = "<p></p>";
      
      let mass = text.split(" ");
      
      mass = mass.map(word => {
        let el = document.createElement("span");
        el.textContent = word + " ";
        return el;
      });

      textNode = document.querySelector("#file p");

      for (let i = 0; i < mass.length; i++) {
        textNode.appendChild(mass[i]);
      }

    })
    .then(() => {
      textNode.addEventListener("dblclick", editMode);
    });
}

window.onload = init;
