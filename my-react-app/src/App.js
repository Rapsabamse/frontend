import logo from './logo.svg';
import upload from './upload.svg';
import './App.css';
import React, { Component, useState } from "react";

var image = null
var url = null

function reqThreshold() {
  console.log("thresholding")
  console.log(image)

  url = document.getElementById("image").src
  console.log(url)
  //get secure url from server

  //POST image directly to s3 bucket

  //POST request to server to store any extra data
}

function reqBlur() {
  console.log("Blurring")
  console.log(image)

  url = document.getElementById("image").src
  console.log(url)

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
            <div className='procButtons'>
              <button onClick={reqThreshold}>Threshold</button>
              <button onClick={reqBlur}>Blur</button>
            </div>
          </div>
        )}

        <br />
        <br />
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
    </div>
  );
}

export default App;
