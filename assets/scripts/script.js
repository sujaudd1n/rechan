// Set localstorage
if (!localStorage.getItem("urls"))
  localStorage.setItem("urls", JSON.stringify([]));

// Get media from localstorage
let urls = JSON.parse(localStorage.getItem("urls"));
let media;
let ix;
let total;

let image = document.querySelector(".figure__img");
let video = document.querySelector(".figure__vid");

// Fetch media
document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  // create source url
  proxy_url = "https://api.allorigins.win/raw?url=";

  let b_url = document.querySelector(".form__url").value;

  if (b_url !== "") {
    b_url_array = b_url.split("/");
    let board = b_url_array[3];
    let b_id = b_url_array[5];
    let url = proxy_url + `https://a.4cdn.org/${board}/thread/${b_id}.json`;

    let response = await fetch(url);
    if (response.ok) {
      console.log(response);
      let source = await response.json();
      total = 0;
      media = get_urls(source, board);
      ix = 0;
    }
  } else {
    urls = JSON.parse(localStorage.getItem("urls"));
    media = [...new Set(urls)];
    ix = 0;
    total = media.length;
  }

  if (media.length > 0) display();
});

function display() {
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
  let type = get_media_type(media[ix]);
  if (type === "img") link.href = image.src;
  else {
    link.href = video.src;
    video.pause();
  }
  link.setAttribute("target", "_blank");
  link.setAttribute("download", `file${ix}`);
  link.click();
  link.remove();
}

function f_save() {
  let type = get_media_type(media[ix].url);
  if (type === "img") url = document.querySelector(".figure__img").src;
  else url = document.querySelector(".figure__vid").src;
  urls.push({url: url, filename: media[ix].filename});
  localStorage.setItem("urls", JSON.stringify(urls));
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
  document.querySelector(".figure__play").style.display = "none";
  document.querySelector(".figure__pause").style.display = "none";
}
function display_video(url) {
  document.querySelector(".figure__vid").src = url.url;
  document.querySelector(".figure__name").textContent =
    "Filename: " + url.filename;
  document.querySelector(".figure__vid").style.display = "block";
  document.querySelector(".figure__play").style.display = "block";
  document.querySelector(".figure__pause").style.display = "block";
  document.querySelector(".figure__img").style.display = "none";
  document.querySelector(".figure__vid").play();
  document.querySelector(".figure__vid").loop = true;
}
function get_urls(data, board) {
  let media = [];
  for (let td of data["posts"]) {
    if ("ext" in td) {
      m_url = `https://i.4cdn.org/${board}/${td.tim}${td.ext}`;
      m_filename = td.filename;
      media.push({ url: m_url, filename: m_filename });
      total++;
    }
  }
  return [...new Set(media)];
}

// Add event listeners
document.querySelector(".figure__next").addEventListener("click", f_next);
document.querySelector(".figure__prev").addEventListener("click", f_prev);
document.querySelector(".figure__play").addEventListener("click", f_play);
document.querySelector(".figure__pause").addEventListener("click", f_pause);
document
  .querySelector(".figure__download")
  .addEventListener("click", f_download);
document.querySelector(".figure__save").addEventListener("click", f_save);
image.addEventListener("pointerdown", process_pointerdown);
video.addEventListener("pointerdown", process_pointerdown);
