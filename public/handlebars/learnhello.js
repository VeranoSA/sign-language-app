async function start() {
    var name = localStorage.getItem('name');
    var data = await axios.get('https://basic-sign-language-api.herokuapp.com/getuser/' + name);
    console.log(data.data);
    var script = document.querySelector('.script').innerHTML;
    var compiledHtml = Handlebars.compile(script);
    try {
        if (data.data.data.player_score) {
            console.log(data.data)
            var fulldata = compiledHtml(data.data);
            //console.log(fulldata);
            var score = document.querySelector('.score');
            score.innerHTML = fulldata
        }
    } catch (error) {
        var obj = { name, data: { player_score: 0 } };
        var fulldata = compiledHtml(obj);
        //console.log(fulldata);
        var score = document.querySelector('.score');
        score.innerHTML = fulldata
    }
    var namee = localStorage.getItem('name')
    var local = await axios.get('http://basic-sign-language-api.herokuapp.com/getuser/' + namee)
    console.log(local.data);
    if (local.data.data.level) {
        if (local.data.data.level === 'Hello') {
            location.replace('./learn-Thank_you.html');
        } else if (local.data.data.level === 'Thank You') {
            location.replace('./learn-ILVU.html');
        } else if (local.data.data.level === 'I love you') {
            location.replace('./learn-please.html');
        } else if (local.data.data.level === 'Please') {
            location.replace('./learn-sorry.html');
        } else if (local.data.data.level === 'Sorry') {
            location.replace('./learn-done.html');
        }
    }
}
start()