import './Recorder.css'
import React from 'react';
import ReactDom from 'react-dom';
import axios from "axios";

const ScreenRecording = () => {
  
  var strName = null;
  var strEmail = null;
  const video = document.getElementById('video');
  const screen = document.getElementById('screen');

  async function captureMediaDevices(mediaConstraints = {
      video: {
        width: 1280,
        height: 720
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      }
    }) {
    const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
    
    video.src = null;
    video.srcObject = stream;
    video.muted = true;
    
    return stream;
  }
  
  async function captureScreen(mediaConstraints = {
      video: {
        cursor: 'always',
        resizeMode: 'crop-and-scale'
      }
    }) {
    const screenStream = await navigator.mediaDevices.getDisplayMedia(mediaConstraints);
    
    return screenStream;
  }
  
  let recorder1 = null;
  let recorder2 = null;
  var strFile1 = null;
  var strFile2 = null;
  var screenblob = null;
  var webcamblob = null;
  let screenOnly = true;

  function stopRecording() {
    
   recorder1.stream.getTracks().forEach(track => track.stop());
   if(screenOnly==false)
   recorder2.stream.getTracks().forEach(track => track.stop());
  }

  async function recordScreen() {
    const screenStream = await captureScreen();
    const audioStream = await captureMediaDevices({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      },
      video: false
    });
    const videoStream = await captureMediaDevices({
      audio: false,
      video: {
        width: 1280,
        height: 720
      }
    });

    const stream1 = new MediaStream([...screenStream.getTracks(),...audioStream.getTracks()]);
    const stream2 = new MediaStream(videoStream);

    screen.src = null;
    screen.srcObject = stream1;
    screen.muted = true;
    screen.autoplay = true;
    video.src = null;
    video.srcObject = stream2;
    video.muted = true;
    video.autoplay = true;

    recorder1 = new MediaRecorder(stream1);
    let chunks1 = [];
  
    recorder1.ondataavailable = event => {
      if (event.data.size > 0) {
        chunks1.push(event.data);
      }
    }
    
    recorder1.onstop = () => {
      const blob = new Blob(chunks1, {
        type: 'video/webm'
      })
      chunks1 = [];
      screenblob = blob;
      const blobUrl = URL.createObjectURL(blob);
      strFile1 = blobUrl;
      
      const tracks = stream2.getTracks();
      tracks.forEach(function(track) {
        track.stop();
      });

     }
     recorder1.start(200);
  }
  
  async function recordScreenVideoAudio() {
    screenOnly = false;
    const screenStream = await captureScreen();
    const videoStream = await captureMediaDevices({
      audio: false,
      video: {
        width: 1280,
        height: 720
      }
    });
    const audioStream = await captureMediaDevices({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      },
      video: false
    });
    
    const stream1 = new MediaStream([...screenStream.getTracks(),...audioStream.getTracks()]);
    const stream2 = new MediaStream([...videoStream.getTracks(),...audioStream.getTracks()]);
    
    screen.src = null;
    screen.srcObject = stream1;
    screen.muted = true;
    screen.autoplay = true;
    video.src = null;
    video.srcObject = stream2;
    video.muted = true;
    video.autoplay = true;
    
    recorder1 = new MediaRecorder(stream1);
    recorder2 = new MediaRecorder(stream2);
    let chunks1 = [];
    let chunks2 = [];
  
    recorder1.ondataavailable = event => {
      if (event.data.size > 0) {
        chunks1.push(event.data);
      }
    }
    
    recorder1.onstop = () => {
      const blob = new Blob(chunks1, {
        type: 'video/webm'
      })
      chunks1 = [];
      screenblob = blob;
      const blobUrl = URL.createObjectURL(blob);
      strFile1 = blobUrl;

     }

    recorder2.ondataavailable = event => {
      if (event.data.size > 0) {
        chunks2.push(event.data);
      }
    }
    
    recorder2.onstop = () => {
      const blob = new Blob(chunks2, {
        type: 'video/webm'
      })
      chunks2 = [];
      webcamblob = blob;
      const blobUrl = URL.createObjectURL(blob);
      strFile2 = blobUrl;
  
     }
    recorder1.start(200);
    recorder2.start(200);
  }
  const previewRecording = () => {
    if (screenOnly == false)
    {
      screen.srcObject = null;
      screen.src = strFile1;
      screen.muted = true;
      screen.autoplay = true;
      video.srcObject = null;
      video.src = strFile2;
      video.muted = false;
      video.autoplay = true;
    }
    else if (screenOnly == true)
    {
      screen.srcObject = null;
      screen.src = strFile1;
      screen.muted = false;
      screen.autoplay = true; 
    }
  }
  const downloadRecording = () => {
    let screenRecordingPath = "screen";
    let screenRecordingType = "webm"
    const pathName1 = `${screenRecordingPath}.${screenRecordingType}`;
    try {
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // for IE
        window.navigator.msSaveOrOpenBlob(strFile1, pathName1);
      } else {
        // for Chrome
        const link = document.createElement("a");
        link.href = strFile1;
        link.download = pathName1;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error(err);
    }
    if(screenOnly==false)
    {
    let videoRecordingPath = "video";
    let videoRecordingType = "webm"
    const pathName2 = `${videoRecordingPath}.${videoRecordingType}`;
    try {
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // for IE
        window.navigator.msSaveOrOpenBlob(strFile2, pathName2);
      } else {
        // for Chrome
        const link = document.createElement("a");
        link.href = strFile2;
        link.download = pathName2;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error(err);
    }
  }
  };
  const uploadRecording = () => {

    strName = document.getElementById("name").value;
    strEmail = document.getElementById("email").value;
    alert("name: "+strName);
    alert("email: "+strEmail);
    alert("This is screen recorder"+screenblob.size);
    alert("This is screen recorder"+screenblob.type);

    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";

    const screenformData = new FormData();
    const recordsformData = new FormData();

    // Update the formData object
    screenformData.append("file2upload", screenblob);
    recordsformData.append("email", strEmail);
    recordsformData.append("name", strName);

    // Details of the uploaded file
      console.log(screenblob);

    // Request made to the backend api
    // Send formData object
    axios.post("https://balaji.today/upload_screen.php", screenformData);
    axios.post("https://balaji.today/upload51.php", recordsformData);

    alert("Upload success for screen recorder"+screenblob.size);
    
    if (screenOnly == false)
    {
      alert("This is video recorder"+webcamblob.size);
      alert("This is video recorder"+webcamblob.type);

      const b = document.createElement("b");
      document.body.appendChild(b);
      b.style = "display: none";

      const webcamformData = new FormData();

      // Update the formData object
      webcamformData.append("file2upload", webcamblob);
      webcamformData.append("name", strName+strEmail);
      webcamformData.append("email", strEmail);

      // Details of the uploaded file
      console.log(webcamblob);

      // Request made to the backend api
      // Send formData object
      axios.post("https://balaji.today/upload_webcam.php", webcamformData);

      alert("Upload success for video recorder"+webcamblob.size);
    }

  };

  return(
      <center>
      <div>
        <button onClick={recordScreen}>Record screen</button>
        <button onClick={recordScreenVideoAudio}>Record Screen, video and audio</button>
        <button onClick={stopRecording}>Stop!</button>
        <button onClick={previewRecording}>Preview</button>
        <button onClick={downloadRecording}>Download</button>
        <button onClick={uploadRecording}>Upload</button>
      </div>
      </center>
  )
}
function Video(){
  return (<div className="Display">
            <center>
              <video id='screen' className="Display-screen" width="640" height="480" autoplay muted></video>
              <video id='video' className="Display-video" width="320" height="240" autoplay muted></video>
            </center>
          </div>)
}

ReactDom.render(
  <React.StrictMode>
  <Video />
  </React.StrictMode>,
  document.getElementById('vid')
);

export default ScreenRecording;