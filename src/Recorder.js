import './Recorder.css'
import React from 'react';
import ReactDom from 'react-dom';
import axios from "axios";

const ScreenRecording = () => {
  
  var strName = null;
  var strEmail = null;
  const video = document.getElementById('video');

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
  
  let recorder = null;
  var strFile = null;
  var webcamblob = null;

  function stopRecording() {
   recorder.stream.getTracks().forEach(track => track.stop());
  }

  async function recordVideo() {
    
    const stream = await captureMediaDevices();
    
    video.src = null;
    video.srcObject = stream;
    video.muted = true;
    video.autoplay = true;
    
    recorder = new MediaRecorder(stream);
    let chunks = [];
  
    recorder.ondataavailable = event => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    }
    
    recorder.onstop = () => {
      const blob = new Blob(chunks, {
        type: 'video/webm'
      })
      chunks = [];
      webcamblob = blob;
      const blobUrl = URL.createObjectURL(blob);
      strFile = blobUrl;

     }

    recorder.start(200);
  }

  const previewRecording = () => {
    video.srcObject = null;
    video.src = strFile;
    video.muted = false;
    video.autoplay = true;
  }

  const uploadRecording = () => {

    strName = document.getElementById("name").value;
    strEmail = document.getElementById("email").value;
    alert("name: "+strName);
    alert("email: "+strEmail);

    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";

    const formData = new FormData();

    // Update the formData object
    formData.append("file2upload", webcamblob);
    formData.append("email", strEmail);
    formData.append("name", strName);

    // Request made to the backend api
    // Send formData object
    axios.post("https://balaji.today/uploadcandidateform53.php", formData);

    cleardata();
    
    alert("Upload success!");
  };

  const cleardata = () => {
      URL.revokeObjectURL(strFile);
      webcamblob = null;
  }

  return(
      <center>
      <div>
        <button onClick={recordVideo}>Record video</button>
        <button onClick={stopRecording}>Stop recording</button>
        <button onClick={previewRecording}>Replay</button>
        <button onClick={uploadRecording}>Upload and close</button>
      </div>
      </center>
  )
}
function Video(){
  return (<div className="Display">
            <center>
              <video id='video' className="Display-video" width="800" height="600" autoplay muted></video>
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