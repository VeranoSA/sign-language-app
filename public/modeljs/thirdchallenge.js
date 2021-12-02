const URL = "https://teachablemachine.withgoogle.com/models/ZnBUgiBeq/";
let model, webcam, ctx, labelContainer, maxPredictions;
(async() => {
    var namee = localStorage.getItem('name')
    var local = await axios.get('http://basic-sign-language-api.herokuapp.com/getuser/' + namee)
    console.log(local.data);
    if (local.data.data.levelName) {
        if (local === 'Hello') {
            location.replace('/learn-Thank_you.html');
        } else if (local === 'Thank You') {
            location.replace('/learn-ILVU.html');
        } else if (local === 'I love you') {
            location.replace('/learn-please.html');
        } else if (local === 'Please') {
            location.replace('/learn-sorry.html');
        } else if (local === 'Sorry') {
            location.replace('/learn-done.html');
        }
    }
})();

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // Note: the pose library adds a tmPose object to your window (window.tmPose)
    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const size = 200;
    const flip = true; // whether to flip the webcam
    webcam = new tmPose.Webcam(size, size, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append/get elements to the DOM
    const canvas = document.getElementById("canvas");
    canvas.width = size;
    canvas.height = size;
    ctx = canvas.getContext("2d");
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop(timestamp) {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const {
        pose,
        posenetOutput
    } = await model.estimatePose(webcam.canvas);
    // Prediction 2: run input through teachable machine classification model
    const prediction = await model.predict(posenetOutput);
    /*
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction =
                prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;
        }
*/
    // finally draw the poses

    //reference get data first
    var name = localStorage.getItem('name');
    //console.log(name)
    var status = await axios.get('http://basic-sign-language-api.herokuapp.com/getuser/' + name);
    if (status.data.userStatus == 'New User') {
        console.log('true');
        var number = ((prediction[0].probability.toFixed(2)) * 100)
        var label = prediction[0].className
        console.log(number, label)
        labelContainer.innerHTML = "Congratulations you know how to sign " + label;
        location.replace('./learn-Thank_you.html');
        if (number == 100) {
            localStorage.setItem('levelDone', 'Hello');
            await axios.post('http://basic-sign-language-api.herokuapp.com/submit', { name, levelName: 'Hello', score: 10 })
            location.replace('./learn-Thank_you.html');
        } else {

        }
    } else {
        var number = ((prediction[2].probability.toFixed(2)) * 100)
        var label = prediction[2].className
        console.log(number, label)
        labelContainer.innerHTML = label + ': ' + number + '%';
        if (number == 100) {
            localStorage.setItem('levelDone', 'Hello');
            await axios.post('http://basic-sign-language-api.herokuapp.com/submit', { name, levelName: 'Hello', score: 10 })
            location.replace('./learn-Thank_you.html');
        }
    };
    drawPose(pose);
}

function drawPose(pose) {
    if (webcam.canvas) {
        ctx.drawImage(webcam.canvas, 0, 0);
        // draw the keypoints and skeleton
        if (pose) {
            const minPartConfidence = 0.5;
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
        }
    }
};