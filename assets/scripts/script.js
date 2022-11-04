document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    proxy_url = "https://api.codetabs.com/v1/proxy?quest="
    const url = proxy_url + document.querySelector(".form__url").value;
    fetch(url)
    .then(response => response.text())
    .then(data => {play(data)})
})

function play(data)
{
    let matches = data.matchAll(/(\/\/i.4cdn([/|.|\w|\s|-])*(.jpg|.webm))/g);
    let media = [];
    for (let td of matches)
    {
        url = "https:" + td[0];
        //url = url.replace("s.jpg", ".jpg");
        if (!url.endsWith("s.jpg"))
        media.push(url);
    }

    media = [...new Set(media)];

    let ix = 0;
    if (media[ix].endsWith(".jpg"))
    {
        document.querySelector(".figure__img").src = media[ix];
        document.querySelector(".figure__img").style.display = "block";
    }
    else
    {
        document.querySelector(".figure__vid").src = media[ix];
        document.querySelector(".figure__vid").style.display = "block";
    }

    document.querySelector(".figure__prev").onclick = function() {
        --ix;
        if (ix < 0)
            ix = media.length - 1;
    if (media[ix].endsWith(".jpg"))
    {
        document.querySelector(".figure__img").src = media[ix];
        document.querySelector(".figure__img").style.display = "block";
        document.querySelector(".figure__vid").style.display = "none";
    }
    else
    {
        document.querySelector(".figure__vid").src = media[ix];
        document.querySelector(".figure__vid").style.display = "block";
        document.querySelector(".figure__img").style.display = "none";
    }
    }

    document.querySelector(".figure__next").onclick = function() {
    ix = ++ix % media.length;
    if (media[ix].endsWith(".jpg"))
    {
        document.querySelector(".figure__img").src = media[ix];
        document.querySelector(".figure__img").style.display = "block";
        document.querySelector(".figure__vid").style.display = "none";
    }
    else
    {
        document.querySelector(".figure__vid").src = media[ix];
        document.querySelector(".figure__vid").style.display = "block";
        document.querySelector(".figure__img").style.display = "none";
    }
    }
}