import logo from './logo.svg';
import upload from './upload.svg';
import img1 from './img1.jpg';
import img2 from './img2.png'
import './App.css';
import React, { Component, useState } from "react";
import {decode as base64_decode, encode as base64_encode} from 'base-64';

//TODO  Base64 -> Image
//      Download image - DONE
//      Connect webpage to webbserver
//      Create connection to database
//      Create connection to image processing module
//      Separate into different files, cleanup

async function downloadImage(imageSrc, nameOfDownload = 'my-image.jpeg') {
  const response = await fetch(imageSrc);

  const blobImage = await response.blob();

  const href = URL.createObjectURL(blobImage);

  const anchorElement = document.createElement('a');
  anchorElement.href = href;
  anchorElement.download = nameOfDownload;

  document.body.appendChild(anchorElement);
  anchorElement.click();

  document.body.removeChild(anchorElement);
  window.URL.revokeObjectURL(href);
}


var image = null
var url64 = null

//Creates a canvas, converts to dataUrl then converted to base64
function toDataURL(src, outputformat) {
  return new Promise(function(resolve) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
      var canvas = document.createElement('CANVAS');
      var ctx = canvas.getContext('2d');
      var dataURL;
      canvas.height = this.naturalHeight;
      canvas.width = this.naturalWidth;
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL(outputformat);
      resolve(dataURL);
    };
    img.src = src;
    if (img.complete || img.complete === undefined) {
      img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
      img.src = src;
    }
  });
}

async function reqThreshold() {
  console.log("thresholding")

  //Converts the uploaded image into base64
  image = document.getElementById("image");
  await toDataURL(image.src, 'image/JPEG')
  .then(function(dataURL) {
    // Handle the data URL here
    url64 = dataURL
  })

  //to test that image is converted
  console.log(url64)

  downloadImage(url64, 'threshold.jpeg')


  //get secure url from server

  //POST image directly to s3 bucket

  //POST request to server to store any extra data
}

async function reqBlur() {
  console.log("Blurring")

  //Converts the uploaded image into base64
  image = document.getElementById("image");
  await toDataURL(image.src, 'image/JPEG')
  .then(function(dataURL) {
    // Handle the data URL here
    url64 = dataURL
  })

  //to test that image is converted
  console.log(url64)
  
  //get secure url from server

  //POST image directly to s3 bucket

  //POST request to server to store any extra data
}

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  return (
    <div className="App">
      <div className='App-header'>
        <img src={logo} alt='Magic logo' id='logo'></img>
      </div>
      <div className='main'>
        {selectedImage && (
          <div>
            <div className='imageInput'>
              <img 
                id='image'
                alt="not found"
                src={URL.createObjectURL(selectedImage)}
              />
            </div>
            <br />
            
          </div>
        )}

        <br />
        <br />
        <div className='procButtons'>
          <button onClick={reqThreshold}>Threshold</button>
          <button onClick={reqBlur}>Blur</button>
        </div>
        <label className="custom-file-upload">
          <p>Upload image</p>
          <img src={upload} id='uploadIMG'></img>
          <input
            type="file"
            name="myImage"
            onChange={(event) => {
              image = event.target.files[0];
              console.log(event.target.files[0]);
              setSelectedImage(event.target.files[0]);
            }}
          />
        </label>
      </div>
      
      <div className='imageDatabase'>
        <h1 id='galleryDesc'>Last images processed</h1>
        <img className='galleryImg' id='tmp' src={img1}></img>
        <img className='galleryImg' src={img2}></img>
        <img className='galleryImg' src={img1}></img>
        <img className='galleryImg' src={img2}></img>
        <img className='galleryImg' src={img1}></img>
        <img className='galleryImg' src={img1}></img>
        <img className='galleryImg' src={img2}></img>
        <img className='galleryImg' src={img1}></img>
      </div>
    </div>
  );
}

export default App;
