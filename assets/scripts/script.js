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
    let matches = data.matchAll(/(\/\/i.4cdn([/|.|\w|\s|-])*.jpg)/g);
    let media = [];
    for (let td of matches)
    {
        url = "https:" + td[0];
        url = url.replace("s.jpg", ".jpg");
        console.log(url)
        media.push(url);
    }

    media = [...new Set(media)];

    let ix = 0;
    document.querySelector(".figure__img").src = media[ix];

    document.querySelector(".figure__prev").onclick = function() {
        console.log('clicked prev')
        --ix;
        if (ix < 0)
            ix = media.length - 1;
        document.querySelector(".figure__img").src = media[ix];
    }

    document.querySelector(".figure__next").onclick = function() {
        console.log('clicked prev')
        document.querySelector(".figure__img").src = media[++ix % media.length]
    }
}