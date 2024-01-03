import upload from './upload.svg';
import loadingImg from './loading.webp';
import './App.css';
import React, { Component, useState, useEffect } from "react";
const { XMLParser} = require("fast-xml-parser");

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


var image = null;
var blurBtn = null;
var contourBtn = null;

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

const s3link = process.env.REACT_APP_S3_API_LINK;
const apiLink = process.env.REACT_APP_API_GATEWAY_LINK;
async function getImagesList() {
  return await fetch(apiLink + "/Test/listimages");
};

async function uploadImage(url64, editType) {
  let base64 = url64.slice(url64.indexOf(";") + 1).substr(7);
  const jsonStr = "{ " + '"body" : "' + base64 + '", "editType": "' + editType + '" }';
  const response = await fetch(apiLink + "/Test/editAndUpload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: jsonStr
  });
  return response.json();
};

function showProcButtons() {
  blurBtn = document.getElementById("blurBtn");
  contourBtn = document.getElementById("contourBtn");
  contourBtn.style.visibility="visible";
  contourBtn.style.position="relative";
  blurBtn.style.visibility="visible";
  blurBtn.style.position="relative";
};

function hideProcButtons() {
  blurBtn = document.getElementById("blurBtn");
  contourBtn = document.getElementById("contourBtn");
  contourBtn.style.visibility="hidden";
  contourBtn.style.position="absolute";
  blurBtn.style.visibility="hidden";
  blurBtn.style.position="absolute";
};

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [sideImages, setSideImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  useEffect(() => {
    getImagesList().then(response => {
      if (response.ok) {
        let XML = ""
        response.text().then(result => {
          XML = result
          const parser = new XMLParser();
          let json = parser.parse(XML);
          let newImageLinks = [];
          if (json["ListBucketResult"]["Contents"] != null) {
              const s3objects = json["ListBucketResult"]["Contents"];
              if (Array.isArray(s3objects)) {
                  for (var i = 0; i < s3objects.length; i++) {
                    newImageLinks.push(s3link + s3objects[i]["Key"]);
                  }
              } else {
                newImageLinks.push(s3link + s3objects["Key"]);
              }
              setSideImages(newImageLinks);
          }
        });
      }
    })
  }, [sideImages]); 

  async function reqBlur() {
    await reqUpload('blur');
  };
  async function reqContour() {
    await reqUpload('contour');
  };
  async function reqSharpen() {
    await reqUpload('sharpen');
  };

  //uploads image and edits with the specific editType. if successful, adds blurred image to sideImages
  async function reqUpload(editType) {
    image = document.getElementById("image");
    let url64 = ""
    await toDataURL(image.src, 'image/JPEG')
    .then(function(dataURL) {
      url64 = dataURL;
    })
    setIsUploading(true);
    uploadImage(url64, editType).then((response) => {
      if (Object.hasOwn(response, 'statusCode')) {
        if (response['statusCode'] === 200) {
          let tempSideImages = [...sideImages];
          tempSideImages.push(response['url']);
          setSideImages(tempSideImages);
          setIsUploading(false);
          setUploadStatus("Upload successful!");
          setSelectedImage(null);
          hideProcButtons();
          return;
        }
      }
      setUploadStatus("Upload failed!");
    });
  }

  return (
    <div className="App">
      <div className='main'>
        {selectedImage && (
          <div>
            <div className='imageInput'>
              <img 
                id='image'
                alt="not found"
                src={URL.createObjectURL(selectedImage)}
              />{
                isUploading ? (<img id="loadingImg" src={loadingImg} width="350" height="350"/>) : <></>
              }
            </div>
            <br />
            
          </div>
        )}

        <br />
        <br />
        <div className='procButtons'>
          <button id='contourBtn' onClick={reqContour}>Contour</button>
          <button id='blurBtn' onClick={reqBlur}>Blur</button>
          <button id='blurBtn' onClick={reqSharpen}>Sharpen</button>
        </div>
        <h1>{uploadStatus}</h1>
        <label className="custom-file-upload">
          <p>Upload image</p>
          <img src={upload} id='uploadIMG'></img>
          <input
            type="file"
            name="myImage"
            onChange={(event) => {
              image = event.target.files[0];
              setSelectedImage(event.target.files[0]);
              if(event.target.files[0] == null){
                hideProcButtons();
              }
              else{
                showProcButtons();
              }
            }}
          />
        </label>
      </div>
      
      <div className='imageDatabase'>
        <h1 id='galleryDesc'>Gallery:</h1>
         {sideImages.map((item, index) => (
        <img className='galleryImg' src={item} key={index} id={'img' + item}></img>
      ))}
      </div>
    </div>
  );
}

export default App;
