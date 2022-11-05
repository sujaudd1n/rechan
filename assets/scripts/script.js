document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  proxy_url = "https://api.codetabs.com/v1/proxy?quest=";
  const url = proxy_url + document.querySelector(".form__url").value;
  fetch(url)
    .then((response) => response.text())
    .then((data) => {
      play(data);
    });
});

function play(data) {
  let matches = data.matchAll(/(\/\/i.4cdn([/|.|\w|\s|-])*(.jpg|.webm))/g);
  let media = [];
  for (let td of matches) {
    url = "https:" + td[0];
    if (!url.endsWith("s.jpg")) media.push(url);
  }

  media = [...new Set(media)];

  let ix = 0;

  // initial state
  if (media[ix].endsWith(".jpg")) enable_image();
  else enable_video();

  document
    .querySelector(".figure__img")
    .addEventListener("touchstart", process_touchmove, false);
  document
    .querySelector(".figure__vid")
    .addEventListener("touchstart", process_touchmove, false);

    document.querySelector(".figure__next").addEventListener("click", f_next);
    document.querySelector(".figure__prev").addEventListener("click", f_prev);
    document.querySelector(".figure__play").addEventListener("click", () => {
        document.querySelector(".figure__vid").play();
    });

    document.querySelector(".figure__pause").addEventListener("click", () => {
        document.querySelector(".figure__vid").pause();
    });

    function f_next()
    {
        ix = ++ix % media.length;
    if (media[ix].endsWith(".jpg")) enable_image();
    else enable_video();
    }

    function f_prev()
    {
        --ix < 0 ? ix = media.length - 1 : 1;
    if (media[ix].endsWith(".jpg")) enable_image();
    else enable_video();

    }

  function process_touchmove(e) {
    
    if (e.touches[0].clientX > e.target.offsetWidth / 2)
        ix = ++ix % media.length;
    else
        --ix < 0 ? ix = media.length - 1 : 1;
    

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
