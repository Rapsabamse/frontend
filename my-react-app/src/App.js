import logo from './logo.svg';
import upload from './upload.svg';
import img1 from './img1.jpg';
import img2 from './img2.png'
import './App.css';
import React, { Component, useState } from "react";
import {decode as base64_decode, encode as base64_encode} from 'base-64';

//TODO  Base64 -> Image
//      Download image - DONE
//      Make base64 a JSON file - Prob DONE
//      Connect webpage to webbserver - Hampus
//      Create connection to database - Esbjörn
//      Create connection to image processing module - Esbjörn
//      Separate into different files, cleanup
//      Create code for the gallery
//      fix Download

async function downloadImage(nameOfDownload = 'processed.png') {
  window.open(image.src, "_blank");

  //Used to download local files, not needed for current implementation
  /*const response = await fetch(imageSrc);

  const blobImage = await response.blob();

  const href = URL.createObjectURL(blobImage);

  const anchorElement = document.createElement('a');
  anchorElement.href = href;
  anchorElement.download = nameOfDownload;

  document.body.appendChild(anchorElement);
  anchorElement.click();

  document.body.removeChild(anchorElement);
  window.URL.revokeObjectURL(href);*/
}


var image = null
var url64 = null
var downloadBtn = null;
var blurBtn = null;
var threshBtn = null;

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
  //Converts the uploaded image into base64
  image = document.getElementById("image");
  await toDataURL(image.src, 'image/JPEG')
  .then(function(dataURL) {
    // Handle the data URL here
    url64 = dataURL
  })

  //Create a JSON object of the url
  let splitUrl = url64.slice(url64.indexOf(";") + 1)
  const jsonStr = "{ " + '"body" : "' + splitUrl + '" }'
  const jsonObj = JSON.parse(jsonStr)

  //to test that image is converted
  console.log(jsonObj)


  //get secure url from server

  //POST image directly to s3 bucket

  //POST request to server to store any extra data

  //Get response when image is done
  image.src = "https://images-dv1566.s3.amazonaws.com/829621ba-a233-4e66-8890-30678c6e9f81.png"

  //show download button
  downloadBtn.style.visibility = "visible"
  downloadBtn.style.position = "relative"
}

async function reqBlur() {
  //Converts the uploaded image into base64
  image = document.getElementById("image");
  await toDataURL(image.src, 'image/JPEG')
  .then(function(dataURL) {
    // Handle the data URL here
    url64 = dataURL
  })

  //Create a JSON object of the url
  let splitUrl = url64.slice(url64.indexOf(";") + 1)
  const jsonStr = "{ " + '"body" : "' + splitUrl + '" }'
  const jsonObj = JSON.parse(jsonStr)

  //to test that image is converted
  
  //get secure url from server

  //POST image directly to s3 bucket

  //POST request to server to store any extra data


  //Get response when image is done
  
  //Placeholder to change image
  image.src = "https://images-dv1566.s3.amazonaws.com/829621ba-a233-4e66-8890-30678c6e9f81.png"

  //show download button
  downloadBtn.style.visibility = "visible"
  downloadBtn.style.position = "relative"
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
          <button id='threshBtn' onClick={reqThreshold}>Threshold</button>
          <button id='blurBtn' onClick={reqBlur}>Blur</button>
          <button id='downloadBtn' onClick={downloadImage}>Download</button>
        </div>
        <label className="custom-file-upload">
          <p>Upload image</p>
          <img src={upload} id='uploadIMG'></img>
          <input
            type="file"
            name="myImage"
            onChange={(event) => {
              //Get buttons from document/website
              downloadBtn = document.getElementById("downloadBtn")
              blurBtn = document.getElementById("blurBtn")
              threshBtn = document.getElementById("threshBtn")
              
              //Get uploaded image
              image = event.target.files[0];
              //console.log(event.target.files[0]);
              setSelectedImage(event.target.files[0]);

              //Hide buttons when necessary
              if(event.target.files[0] == null){
                threshBtn.style.visibility="hidden"
                threshBtn.style.position="absolute"
                blurBtn.style.visibility="hidden"
                blurBtn.style.position="absolute"
              }
              else{
                threshBtn.style.visibility="visible"
                threshBtn.style.position="relative"
                blurBtn.style.visibility="visible"
                blurBtn.style.position="relative"
              }
              downloadBtn.style.visibility = "hidden"
              downloadBtn.style.position = "absolute"
            }}
          />
        </label>
      </div>
      
      <div className='imageDatabase'>
        <h1 id='galleryDesc'>Last images processed</h1>
        <img className='galleryImg' id='img1' src="https://images-dv1566.s3.amazonaws.com/829621ba-a233-4e66-8890-30678c6e9f81.png"></img>
        <img className='galleryImg' id='img2' src={img2}></img>
        <img className='galleryImg' id='img3' src={img1}></img>
        <img className='galleryImg' id='img4' src={img2}></img>
        <img className='galleryImg' id='img5' src={img1}></img>
        <img className='galleryImg' id='img6' src={img1}></img>
        <img className='galleryImg' id='img7' src={img2}></img>
        <img className='galleryImg' id='img8' src={img1}></img>
      </div>
    </div>
  );
}

export default App;
