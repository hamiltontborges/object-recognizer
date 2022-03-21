// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/Q8e5cUQ3Q/";

let model, webcam, labelContainer, maxPredictions;

const btn = document.getElementById('btn');
const colunaObjetos = document.getElementById('coluna-objetos');

// Load the image model and setup the webcam
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // or files from your local hard drive
  // Note: the pose library adds "tmImage" object to your window (window.tmImage)
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Convenience function to setup a webcam
  const flip = true; // whether to flip the webcam
  webcam = new tmImage.Webcam(400, 400, flip, "environment"); // width, height, flip
  await webcam.setup({facingMode: "user"}); // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  // append elements to the DOM
  document.getElementById("webcam-container").appendChild(webcam.canvas);
  webcam.canvas ? changeBtnCamera() : btn.disabled = false;
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) { // and class labels
    labelContainer.appendChild(document.createElement("div"));
  }
  colunaObjetos.classList.remove('hidden');
}

async function loop() {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
  // predict can take in an image, video or canvas html element
  const prediction = await model.predict(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction = prediction[i].className;
    labelContainer.childNodes[i].innerHTML = classPrediction;
    if (prediction[i].probability > 0.95) {
      labelContainer.childNodes[i].classList.add("ativo")
    } else {
      labelContainer.childNodes[i].classList.remove("ativo")
    }
  }
}

const changeBtnCamera = () => {
  btn.disabled = true;
  btn.classList.add('desativado');
}

