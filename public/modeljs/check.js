const URL = "https://teachablemachine.withgoogle.com/models/ZnBUgiBeq/";
let model, webcam, ctx, labelContainer, maxPredictions;


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

async function predict() {
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    const signs = {
        'Hello': 0,
        'Thank you': 0,
        'I love you': 0,
        'Please': 0,
        'Excuse me': 0
    }

    let bestMatch = '';
    let matchProbability = 0;
    
    for (let i = 0; i < maxPredictions; i++) {
        results[prediction[i].className] = prediction[i].probability.toFixed(2);
        for(sign in signs) {
            if (results[sign] >= matchProbability) {
                bestMatch = sign;
                matchProbability = results[sign]
            }
        }
    }
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