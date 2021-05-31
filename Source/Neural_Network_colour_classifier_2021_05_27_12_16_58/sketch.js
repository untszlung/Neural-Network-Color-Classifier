let neuralNetwork;
let submitButton;

let rSlider, gSlider, bSlider;
let labelP;
let lossP;

function setup() {
  // Crude interface
  lossP = createP('loss');

  createCanvas(100, 100);

  labelP = createP('label');

  rSlider = createSlider(0, 255, 255);
  gSlider = createSlider(0, 255, 0);
  bSlider = createSlider(0, 255, 255);
  
  trainButton = createButton('training');
  trainButton.mousePressed(training);
  
  const modelInfo = {
    model: 'model.json',
    metadata: 'model_meta.json',
    weights: 'model.weights.bin'
  }
  
  
   let nnOptions = {
    dataUrl: 'colorData2.json',
    inputs: ['r', 'g', 'b'],
    outputs: ['label'],
    task: 'classification',
       layers: [
      {
        type: 'dense',
        units: 16,
        activation: 'sigmoid'
      },
      {
        type: 'dense',
        units: 16,
        activation: 'sigmoid'
      },
      {
        type: 'dense',
        activation: 'softmax'
      }
    ],
    debug: true
  };
  neuralNetwork = ml5.neuralNetwork(nnOptions, modelReady);

  neuralNetwork.load(modelInfo, classify);


 
}



function training() {
  neuralNetwork.normalizeData();
  const trainingOptions = {
    epochs: 1500,
    batchSize: 512
  }
  neuralNetwork.train(trainingOptions, whileTraining, finishedTraining);
  // Start guessing while training!
  classify();

}

function modelReady(){
  console.log('created model');
}

function whileTraining(epoch, logs) {
  lossP.html(`Epoch: ${epoch} - loss: ${logs.loss.toFixed(2)}`);
}

function finishedTraining(anything) {
  console.log('done!');
  neuralNetwork.save();
  console.log('save tranning model');
}

function classify() {
  let inputs = {
    r: rSlider.value(),
    g: gSlider.value(),
    b: bSlider.value()
  }
  neuralNetwork.classify([inputs.r, inputs.g, inputs.b], gotResults);
}

function gotResults(error, results) {
  if (error) {
    console.error(error);
  } else {
    labelP.html(`label:${results[0].label}, confidence: ${results[0].confidence.toFixed(2)}`);
    classify();
  }
}

function draw() {
  background(rSlider.value(), gSlider.value(), bSlider.value());
}
