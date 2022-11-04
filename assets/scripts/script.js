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
    //console.log(data)
    let matches = data.matchAll(/(\/\/i.4cdn([/|.|\w|\s|-])*.jpg)/g);
    console.log(matches)
    let media = []
    for (let td of matches)
    {
        console.log(td[0])
        media.push("https:" + td[0])
        let img = document.createElement('img')
        u = "https:" + td[0]
        img.src = u
        document.querySelector('.figure').prepend(img)
    }
    console.log(media)
}