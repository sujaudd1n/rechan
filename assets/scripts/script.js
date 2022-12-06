// Set thread urls
if (!localStorage.getItem("thread_urls"))
  localStorage.setItem("thread_urls", JSON.stringify([]));

// Set single media url
if (!localStorage.getItem("urls"))
  localStorage.setItem("urls", JSON.stringify([]));

// Get media from localstorage
let urls = JSON.parse(localStorage.getItem("urls"));
let media = [];
let ix = 0;
let total = 0;

let image = document.querySelector(".figure__img");
let video = document.querySelector(".figure__vid");

// Add event listeners
document
  .querySelector(".figure__control--next")
  .addEventListener("click", f_next);
document
  .querySelector(".figure__control--prev")
  .addEventListener("click", f_prev);
document
  .querySelector(".figure__control--play")
  .addEventListener("click", f_play);
document
  .querySelector(".figure__control--pause")
  .addEventListener("click", f_pause);
document
  .querySelector(".figure__control--download")
  .addEventListener("click", f_download);
document
  .querySelector(".figure__control--save")
  .addEventListener("click", () => {f_save(media[ix])});

document
  .querySelector(".options__button--url")
  .addEventListener("click", show_form);
document
  .querySelector(".options__button--thread")
  .addEventListener("click", show_form);
document
  .querySelector(".options__button--saved")
  .addEventListener("click", show_form);

function show_form(e) {
  let form = document.querySelector(".form");
  if (e.target.dataset.formtype === form.dataset.formtype) {
    form.style.display = "none";
    form.dataset.formtype = "notype";
  } else {
    form.style.display = "flex";
    form.dataset.formtype = e.target.dataset.formtype;

    switch (form.dataset.formtype) {
      case "url":
        form.children[0].setAttribute("placeholder", "url");
        form.children[0].value = "";
        form.children[0].focus();
        form.children[1].value = "Play";
        break;
      case "thread":
        form.children[0].setAttribute("placeholder", "thread");
        form.children[0].value = "";
        form.children[0].focus();
        form.children[1].value = "Save";
        break;
      case "saved":
        form.children[0].setAttribute("placeholder", "saved");
        form.children[0].value = "";
        form.children[0].focus();
        form.children[1].value = "Save";
        render_saved();
        break;
    }
  }
}

function render_saved() {
  document.querySelector(".figure").style.display = "none";
  video.pause();
  document.querySelector(".threads").style.display = "none";
  document.querySelector(".saved").style.display = "block";

  let urls = JSON.parse(localStorage.getItem("urls"));
  

  for (let u of urls)
  {
    let p = document.createElement('p'); 
    let a = document.createElement('a'); 

    a.href = u.url;
    a.target = "_blank";
    a.textContent = u.name;

    p.appendChild(a);
    document.querySelector(".saved").appendChild(p);
  }
}

document.querySelector(".form__submit").addEventListener("click", async (e) => {
  if (e.target.parentElement.dataset.formtype === "url") {
    let url = document.querySelector(".form__url").value;
    let json_data = await get_data(url);
    let board = url.split("/")[3];
    let media = get_media(json_data, board);
    display();
  }
});

async function get_data(url) {
  proxy_url = "https://api.allorigins.win/raw?url=";
  url = url.split("/");
  let board = url[3];
  let board_id = url[5];
  url = proxy_url + `https://a.4cdn.org/${board}/thread/${board_id}.json`;

  let response = await fetch(url);
  if (response.ok) {
    return await response.json();
  }
}

function display() {
  document.querySelector(".figure").style.display = "flex";
  let type = get_media_type(media[ix].url);
  if (type === "img") display_image(media[ix]);
  else display_video(media[ix]);
  document.querySelector(".figure__total").textContent =
    (ix + 1).toString() + " / " + total.toString();
}

function get_media_type(url) {
  if (url.endsWith("jpg") || url.endsWith("gif") || url.endsWith("jpeg"))
    return "img";
  return "video";
}

function f_download() {
  let link = document.createElement("a");
  let type = get_media_type(media[ix].url);
  if (type === "img") link.href = image.src;
  else {
    link.href = video.src;
    video.pause();
  }
  link.setAttribute("target", "_blank");
  link.setAttribute("download", `${media[ix].filename}`);
  link.click();
  link.remove();
}

function f_save(obj) {
  /*
  let type = get_media_type(media[ix].url);
  if (type === "img") url = document.querySelector(".figure__img").src;
  else url = document.querySelector(".figure__vid").src;
  */
  let saved_urls = JSON.parse(localStorage.getItem("urls"));
  saved_urls.push(obj);
  localStorage.setItem("urls", JSON.stringify(saved_urls));
}

function f_play() {
  document.querySelector(".figure__vid").play();
}

function f_pause() {
  document.querySelector(".figure__vid").pause();
}

function f_next() {
  ix = ++ix % media.length;
  display();
}

function f_prev() {
  --ix < 0 ? (ix = media.length - 1) : 1;
  display();
}

function process_pointerdown(e) {
  if (e.layerX > e.target.offsetWidth / 2) ix = ++ix % media.length;
  else --ix < 0 ? (ix = media.length - 1) : 1;

  display();
}

function display_image(url) {
  document.querySelector(".figure__img").src = url.url;
  document.querySelector(".figure__name").textContent =
    "Filename: " + url.filename;
  document.querySelector(".figure__img").style.display = "block";
  document.querySelector(".figure__vid").style.display = "none";
  document.querySelector(".figure__vid").pause();
  document.querySelector(".figure__control--play").style.display = "none";
  document.querySelector(".figure__control--pause").style.display = "none";
}
function display_video(url) {
  document.querySelector(".figure__vid").src = url.url;
  document.querySelector(".figure__name").textContent =
    "Filename: " + url.filename;
  document.querySelector(".figure__vid").style.display = "block";
  document.querySelector(".figure__control--play").style.display = "block";
  document.querySelector(".figure__control--pause").style.display = "block";
  document.querySelector(".figure__img").style.display = "none";
  document.querySelector(".figure__vid").play();
  document.querySelector(".figure__vid").loop = true;
}
function get_media(data, board) {
  for (let td of data["posts"]) {
    if ("ext" in td) {
      m_url = `https://i.4cdn.org/${board}/${td.tim}${td.ext}`;
      m_filename = td.filename;
      m_filesize = td.fsize;
      m_fileuploader = td.name;
      m_filetimestamp = td.now;
      media.push({
        url: m_url,
        name: m_filename,
        size: m_filesize,
        uploader: m_fileuploader,
        timestamp: m_filetimestamp,
      });
      total++;
    }
  }

  return [...new Set(media)];
}
