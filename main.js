var gid = n => document.getElementById(n);
Chart.defaults.global.legend.display = false;
function nullf(){null;}
bdocument = document

function rq(url) {
    request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.send();
    return request;
}
try {
    var lastId = rq("https://www.dwitter.net/api/dweets/?limit=1").responseText.split("\"id\":")[1].split(",")[0];
    gid('last').textContent = "Last dweet: " + lastId + " made by " +
        JSON.parse(rq("https://www.dwitter.net/api/dweets/?limit=1").responseText).results[0]['author']['username'];

    function search() {
        if (gid('limit').value=='all') { gid('limit').value=lastId-1; }
        var found = 0;
        gid("sbutton").textContent = 'Searching... Please wait parsing all the ' + gid('limit').value + "..."
        var dweets = rq("https://www.dwitter.net/api/dweets/?limit=" + gid('limit').value + "&offset=" + gid('offset').value)
            .responseText
        json = JSON.parse(dweets)
        dweets = json.results
        gid('result').innerHTML = '';
        if (gid("limit").value != '') {
            for (i = 0; i < dweets.length; i++) {
                if (dweets[i].code.indexOf(gid('code').value) > -1 &&
                    dweets[i].author['username'].indexOf(gid('author').value) > -1) {
                    gid('result').innerHTML += "<a style='font-size:25' class='c' href='http://www.dwitter.net/d/" +
                        dweets[i].id + "'>d/" + dweets[i].id + "</a><a class='c'> by </a>"

                    gid('result').innerHTML += "<a class='c' href='http://www.dwitter.net/u/" +
                        dweets[i].author['username'] + "'>" + dweets[i].author['username'] + "</a><br />"

                    gid("result").innerHTML += "<a class='c'>Stats: " + dweets[i].awesome_count + " likes, " + dweets[i]
                        .code.length + " characters, awesomeness: " + (140 - dweets[i].code.length / (dweets[i].awesome_count) *
                            100 / 140 - 40).toString() + "%</a><br>"

                    if(gid('showc').checked) var comments = JSON.parse(rq("https://www.dwitter.net/api/comments/?reply_to=" + dweets[i].id).responseText
                        .replace(new RegExp('\\"(/h[^"]*)\\"', 'g'), "'$1'").split("\\'").join("'"))
                    if(gid('showc').checked) comments = comments.results

                    if(gid('showc').checked) comments.length > 0 ? gid("result").innerHTML += "<a class='c' style='font-size:19'>Comments: </a>" :
                        null;
                    if(gid('showc').checked)
                    for (let j = 0; j < comments.length; j++) {
                        gid("result").innerHTML += "<a class='c'>u/" + comments[j].author + " --> " + comments[j].text +
                            "</a>"
                    }

                    code = dweets[i].code.split(",").join(", ").split(");").join(")</br>")
                    gid('result').innerHTML +=
                        "<pre><code class='c'><textarea style='margin: 0px; width: 100%; height: 10%;'>" + code +
                        "</textarea></code><br><iframe class='visual' src='http://dweet.dwitter.net/id/"+dweets[i].id+"'></iframe></pre>"
                    found++;
                    ch.data.labels.push(dweets[i].id)
                    ch.data.datasets[0].data.push(dweets[i].awesome_count)
                    ch.data.datasets[1].data.push((140 - dweets[i].code.length / (dweets[i].awesome_count) * 100 / 140 -
                        40))
                    ch.data.datasets[2].data.push(dweets[i].code.length/5);
                }
            }
        } else {
            gid('error').innerHTML = "Limit can't be null."
        }
        gid('error').innerHTML = ""
        gid("sbutton").innerHTML = 'Found ' + found + "/" + gid('limit').value + " results!"
        setInterval(function(){for(dweetVisual of bdocument.getElementsByClassName`visual`){dweetVisual.contentWindow.playDemo()}}, 1000)
    }
} catch (e) {
    gid("error").textContent = e
}
