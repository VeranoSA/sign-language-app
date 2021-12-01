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
        var obj = {};
        obj['name'] = name;
        data['data'] = {
            player_score: 0
        };
        var fulldata = compiledHtml(obj);
        //console.log(fulldata);
        var score = document.querySelector('.score');
        score.innerHTML = fulldata
    }

}
start()