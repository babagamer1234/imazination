let video = document.createElement('video');
video.autoplay = true;

navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => { video.srcObject = stream; });

let model;
handpose.load().then(m => model = m);

async function detectHands(callback) {
  if (model && video.readyState === 4) {
    const predictions = await model.estimateHands(video);
    if (predictions.length > 0) {
      const tip = predictions[0].annotations.indexFinger[3];
      callback(tip);
    }
  }
  requestAnimationFrame(() => detectHands(callback));
}
