// Set localstorage
if (!localStorage.getItem("urls"))
  localStorage.setItem("urls", JSON.stringify([]));

// Get media from localstorage
let urls = JSON.parse(localStorage.getItem("urls"));
let media = [...new Set(urls)];
let ix = 0;

let image = document.querySelector(".figure__img");
let video = document.querySelector(".figure__vid");

// Fetch media 
document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  // create source url
  proxy_url = "https://api.codetabs.com/v1/proxy?quest=";
  const url = proxy_url + document.querySelector(".form__url").value;

  let response = await fetch(url);
  if (response.ok) {
    let source = await response.text();
    media = find_urls(source);
    ix = 0;
  }
  else
  {
    urls = JSON.parse(localStorage.getItem("urls"));
    media = [...new Set(urls)];
    ix = 0;
  }
    
  if (media.length > 0)
    display();
});

function display()
{
  let type = get_media_type(media[ix]);
  if (type === "img")
    display_image(media[ix]);
  else
    display_video(media[ix]);
}

function get_media_type(url)
{
  if (
    url.endsWith("jpg") ||
    url.endsWith("gif") ||
    url.endsWith("jpeg")
  ) 
    return "img";
    return "video";
}


function f_download() {
  let link = document.createElement("a");
  let type = get_media_type(media[ix]);
  if (type === "img")
    link.href = image.src;
  else
  {
    link.href = video.src;
    video.pause();
  }
  link.setAttribute("target", "_blank");
  link.setAttribute("download", `file${ix}`);
  link.click();
  link.remove();
}

function f_save() {
  let type = get_media_type(media[ix]);
  if (type === "img")
    url = document.querySelector(".figure__img").src;
  else
    url = document.querySelector(".figure__vid").src;
    urls.push(url);
    localStorage.setItem("urls", JSON.stringify(urls));
    console.log(urls);
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
  if (e.layerX > e.target.offsetWidth / 2)
    ix = ++ix % media.length;
  else
    --ix < 0 ? (ix = media.length - 1) : 1;

  display();
}

function display_image(url) {
  document.querySelector(".figure__img").src = url;
  document.querySelector(".figure__img").style.display = "block";
  document.querySelector(".figure__vid").style.display = "none";
  document.querySelector(".figure__vid").pause();
  document.querySelector(".figure__play").style.display = "none";
  document.querySelector(".figure__pause").style.display = "none";
}
function display_video(url) {
  document.querySelector(".figure__vid").src = url;
  document.querySelector(".figure__vid").style.display = "block";
  document.querySelector(".figure__play").style.display = "block";
  document.querySelector(".figure__pause").style.display = "block";
  document.querySelector(".figure__img").style.display = "none";
  document.querySelector(".figure__vid").play();
  document.querySelector(".figure__vid").loop = true;
}
function find_urls(source) {
  let matches = source.matchAll(/(\/\/i.4cdn([/|.|\w|\s|-])*(.jpg|.webm|.jpeg|.gif))/g);
  let media = [];
  for (let td of matches) {
    url = "https:" + td[0];
    if (!url.endsWith("s.jpg")) media.push(url);
  }
  return [...new Set(media)];
}

// Add event listeners
document.querySelector(".figure__next").addEventListener("click", f_next);
document.querySelector(".figure__prev").addEventListener("click", f_prev);
document.querySelector(".figure__play").addEventListener("click", f_play);
document.querySelector(".figure__pause").addEventListener("click", f_pause);
document.querySelector(".figure__download").addEventListener("click", f_download);
document.querySelector(".figure__save").addEventListener("click", f_save);
image.addEventListener("pointerdown", process_pointerdown);
video.addEventListener("pointerdown", process_pointerdown);