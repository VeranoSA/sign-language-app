async function getName() {
    var inputName = document.querySelector('.input');
    var status = await axios.get('http://basic-sign-language-api.herokuapp.com/getuser/' + inputName.value);
    if (status.data.err) {
        var signUpUser = await axios.get('http://basic-sign-language-api.herokuapp.com/newuser/' + inputName.value);
        name = signUpUser.data.name;
    } else {
        //we have the user
        name = status.data.name;
    }
    localStorage.setItem('name', inputName.value);
    var elem = document.querySelector('.hide');
    elem.style.display = 'block';


}