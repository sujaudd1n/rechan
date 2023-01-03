// Set thread urls
if (!localStorage.getItem("thread_urls"))
  localStorage.setItem("thread_urls", JSON.stringify([]));

// Set single media url
if (!localStorage.getItem("media_urls"))
  localStorage.setItem("media_urls", JSON.stringify([]));

// Get media from localstorage
let urls = JSON.parse(localStorage.getItem("media_urls"));
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
  .addEventListener("click", () => {
    f_save(media[ix]);
  });

document
  .querySelector(".options__button--url")
  .addEventListener("click", show_form);
document
  .querySelector(".options__button--thread")
  .addEventListener("click", show_form);
document
  .querySelector(".options__button--saved")
  .addEventListener("click", show_form);
document
  .querySelector(".options__button--catalog")
  .addEventListener("click", show_form);

let form = document.querySelector(".form");

function show_form(e) {
  if (e.target.dataset.formtype === form.dataset.formtype) {
    form.style.display = "none";
    form.dataset.formtype = "notype";
  } else {
    form.style.display = "flex";
    form.dataset.formtype = e.target.dataset.formtype;

    switch (form.dataset.formtype) {
      case "url":
        render_media();
        break;
      case "thread":
        render_thread();
        break;
      case "saved":
        render_saved();
        break;
      case "catalog":
        render_catalog();
        break;
    }
  }
}

function render_catalog()
{
  form.children[0].value = "";
  form.children[0].focus();
  form.children[1].value = "Display";
  form.children[0].setAttribute("placeholder", "board");

  document.querySelector(".catalog").style.display = "block";
  video.pause();
  document.querySelector(".figure").style.display = "none";
  document.querySelector(".saved").style.display = "none";
  document.querySelector(".threads").style.display = "none";
}

function render_media()
{
  form.children[0].value = "";
  form.children[0].focus();
  form.children[1].value = "Play";
  form.children[0].setAttribute("placeholder", "url");

  document.querySelector(".figure").style.display = "flex";
  document.querySelector(".saved").style.display = "none";
  document.querySelector(".threads").style.display = "none";
  document.querySelector(".catalog").style.display = "none";
}

function render_thread() {
  form.children[0].setAttribute("placeholder", "thread");
  form.children[0].value = "";
  form.children[0].focus();
  form.children[1].value = "Save";

  document.querySelector(".figure").style.display = "none";
  video.pause();
  document.querySelector(".saved").style.display = "none";
  document.querySelector(".threads").style.display = "block";
  document.querySelector(".catalog").style.display = "none";

  let urls = JSON.parse(localStorage.getItem("thread_urls"));

  document.querySelector(".threads").textContent = "";

  for (let u of urls) {
    let div = create_thread_div(u)
    document.querySelector(".threads").appendChild(div);
  }
}

function create_thread_div(u)
{
    let div = document.createElement("div");
    div.setAttribute("class", "saved__items")
    let a = document.createElement("a");
    let dlt = document.createElement("button");

    dlt.textContent = "Delete";

    a.href = u;
    a.target = "_blank";
    a.textContent = "thread";

    div.appendChild(a);
    div.appendChild(dlt);
    return div;
}

function render_saved() {
  form.children[0].setAttribute("placeholder", "saved");
  form.children[0].value = "";
  form.children[0].focus();
  form.children[1].value = "Save";

  document.querySelector(".figure").style.display = "none";
  video.pause();
  document.querySelector(".threads").style.display = "none";
  document.querySelector(".saved").style.display = "block";

  document.querySelector(".saved").textContent = "";

  let urls = JSON.parse(localStorage.getItem("media_urls"));

  for (let u of urls) {
    let div = create_saved_div(u)
    document.querySelector(".saved").appendChild(div);
 }
}

function create_saved_div(u)
{
    let div = document.createElement("div");
    div.setAttribute("class", "saved__items")
    let a = document.createElement("a");
    let dlt = document.createElement("button");

    dlt.textContent = "Delete";

    a.href = u.url;
    a.target = "_blank";
    a.textContent = u.name;

    div.appendChild(a);
    div.appendChild(dlt);
    return div;
 

}

document.querySelector(".form__submit").addEventListener("click", async (e) => {
  if (e.target.parentElement.dataset.formtype === "url") {
    let url = document.querySelector(".form__url").value;
    let json_data = await get_data(url);
    let board = url.split("/")[3];
    let media = get_media(json_data, board);
    display();
  }
  else if (e.target.parentElement.dataset.formtype === "thread")
  {
    let url = document.querySelector(".form__url").value;
    let saved_urls = JSON.parse(localStorage.getItem("thread_urls"));
    saved_urls.push(url);
    localStorage.setItem("thread_urls", JSON.stringify(saved_urls));
  }
  else if (e.target.parentElement.dataset.formtype === "catalog")
  {
    let board = document.querySelector(".form__url").value;
    console.log("getting...")
    let json_data = await get_catalog(board);
    console.log("done...")
    console.log(json_data)

    let catalog_obj = []

    for (let obj of json_data)
    {
      for (let sobj of obj.threads)
      {
        catalog_obj.push(sobj)
      }
    }
    document.querySelector('.catalog').textContent = "";
    display_catalog(catalog_obj)


  }
});

function display_catalog(objs)
{
  for (let obj of objs)
    document.querySelector('.catalog').appendChild(ct(obj))

}

function ct(obj)
{
  console.log(obj)

  let div = document.createElement('div');
  let img = document.createElement('p');
  let no = document.createElement('a');
  let sub = document.createElement('p');

  img.textContent = obj.images;
  no.textContent = `https://boards.4chan.org/gif/thread/${obj.no}`;
  no.href = `https://boards.4chan.org/gif/thread/${obj.no}`;
  no.target = "_blank";
  sub.textContent = obj.sub;

  div.appendChild(sub);
  div.appendChild(img);
  div.appendChild(no);
  div.setAttribute('class', 'catalog-div')
  return div;
}


async function get_catalog(board) {
  proxy_url = "https://api.allorigins.win/raw?url=";
  let url = proxy_url + `https://a.4cdn.org/${board}/catalog.json`

  let response = await fetch(url);
  if (response.ok) {
    return await response.json();
}
}

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
  let saved_urls = JSON.parse(localStorage.getItem("media_urls"));
  saved_urls.push(obj);
  localStorage.setItem("media_urls", JSON.stringify(saved_urls));
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
    "Filename: " + url.name;
  document.querySelector(".figure__img").style.display = "block";
  document.querySelector(".figure__vid").style.display = "none";
  document.querySelector(".figure__vid").pause();
  document.querySelector(".figure__control--play").style.display = "none";
  document.querySelector(".figure__control--pause").style.display = "none";
}
function display_video(url) {
  document.querySelector(".figure__vid").src = url.url;
  document.querySelector(".figure__name").textContent =
    "Filename: " + url.name;
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
