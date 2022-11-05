document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  // create source url
  proxy_url = "https://api.codetabs.com/v1/proxy?quest=";
  const url = proxy_url + document.querySelector(".form__url").value;
  // request data
  let media = [... new Set(JSON.parse(localStorage.getItem("urls")))];

  if (document.querySelector(".form__url").value !== "saved")
  {
    let response = await fetch(url);
    if (response.ok)
    {
      let source = await response.text();
      media = find_urls(source);
    }
  }
  console.log(media);
  play(media);
});



function play(media) {
  let ix = 0;

  // initial state
  if (media[ix].endsWith(".jpg")) enable_image();
  else enable_video();

  document
    .querySelector(".figure__img")
    .addEventListener("touchstart", process_touchstart, false);
  document
    .querySelector(".figure__vid")
    .addEventListener("touchstart", process_touchstart, false);

  document.querySelector(".figure__next").addEventListener("click", f_next);
  document.querySelector(".figure__prev").addEventListener("click", f_prev);
  document.querySelector(".figure__play").addEventListener("click", () => {
    document.querySelector(".figure__vid").play();
  });

  document.querySelector(".figure__pause").addEventListener("click", () => {
    document.querySelector(".figure__vid").pause();
  });

  document.querySelector(".figure__download").addEventListener("click", () => {
    let dl = document.createElement("a");
    dl.href =
      document.querySelector(".figure__vid").style.display == "block"
        ? document.querySelector(".figure__vid").src
        : document.querySelector(".figure__img").src;
    dl.download = "file" + ix;
    dl.click();
  });

  function f_next() {
    ix = ++ix % media.length;
    if (media[ix].endsWith(".jpg")) enable_image();
    else enable_video();
  }

  function f_prev() {
    --ix < 0 ? (ix = media.length - 1) : 1;
    if (media[ix].endsWith(".jpg")) enable_image();
    else enable_video();
  }

  function process_touchstart(e) {
    if (e.touches[0].clientX > e.target.offsetWidth / 2)
      ix = ++ix % media.length;
    else --ix < 0 ? (ix = media.length - 1) : 1;

    if (media[ix].endsWith(".jpg")) enable_image();
    else enable_video();
  }

  function enable_image() {
    document.querySelector(".figure__img").src = media[ix];
    document.querySelector(".figure__img").style.display = "block";
    document.querySelector(".figure__vid").style.display = "none";
    document.querySelector(".figure__play").style.display = "none";
    document.querySelector(".figure__pause").style.display = "none";
  }
  function enable_video() {
    document.querySelector(".figure__vid").src = media[ix];
    document.querySelector(".figure__vid").style.display = "block";
    document.querySelector(".figure__play").style.display = "block";
    document.querySelector(".figure__pause").style.display = "block";
    document.querySelector(".figure__img").style.display = "none";
    document.querySelector(".figure__vid").play();
    document.querySelector(".figure__vid").loop = true;
  }
}

if (!localStorage.getItem("urls"))
  localStorage.setItem("urls", JSON.stringify([]));

let urls = JSON.parse(localStorage.getItem("urls"));
console.log(urls);

document.querySelector(".figure__save").addEventListener("click", () => {
  let u = document.querySelector(".figure__vid").src;
  if (
    u.endsWith("jpg") ||
    u.endsWith("webm") ||
    u.endsWith("gif") ||
    u.endsWith("jpeg")
  ) {
    urls.push(u);
    localStorage.setItem("urls", JSON.stringify(urls));
    console.log(urls);
  }
});

function find_urls(source)
{
  let matches = source.matchAll(/(\/\/i.4cdn([/|.|\w|\s|-])*(.jpg|.webm))/g);
  let media = [];
  for (let td of matches) {
    url = "https:" + td[0];
    if (!url.endsWith("s.jpg")) media.push(url);
  }
  return [... new Set(media)];
}