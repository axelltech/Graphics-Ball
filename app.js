document.getElementById('pngFileInput').addEventListener('change', handlePNGFileSelect);
document.getElementById('jpgFileInput').addEventListener('change', handleJPGFileSelect);
document.getElementById('changePNGButton').addEventListener('click', changePNGPictures);
document.getElementById('changeJPGButton').addEventListener('click', changeJPGPictures);

let jpgImagesData = [];
let pngImagesData = [];
let downloadPNGButtonEnabled = false;
let downloadJPGButtonEnabled = false;

function handleFileSelect(event, isPNG) {
  const fileInput = event.target;
  const imageContainer = isPNG ? document.getElementById('pngImageContainer') : document.getElementById('jpgImageContainer');
  const changeButton = isPNG ? document.getElementById('changePNGButton') : document.getElementById('changeJPGButton');

  imageContainer.innerHTML = '';

  const files = fileInput.files;
  const imagesData = isPNG ? pngImagesData : jpgImagesData;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();

    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;
      img.style.maxWidth = '145px';
      img.style.margin = '5px';

      const fileName = document.createElement('p');
      fileName.textContent = file.name;

      const itemContainer = document.createElement('div');
      itemContainer.classList.add('ITEM');
      itemContainer.appendChild(img);
      itemContainer.appendChild(fileName);

      imageContainer.appendChild(itemContainer);

      imagesData.push({
        img: img,
        name: file.name,
        dataURL: event.target.result,
        isPNG: isPNG
      });

      if (i === files.length - 1) {
        changeButton.disabled = false;
      }
    };

    reader.readAsDataURL(file);
  }
}

function handlePNGFileSelect(event) {
  handleFileSelect(event, true);
}

function handleJPGFileSelect(event) {
  handleFileSelect(event, false);
}

function changePictures(isPNG) {
  const imagesData = isPNG ? pngImagesData : jpgImagesData;
  const imageContainer = isPNG ? document.getElementById('pngImageContainer') : document.getElementById('jpgImageContainer');

  imageContainer.innerHTML = '';

  for (let i = 0; i < imagesData.length; i++) {
    const imageData = imagesData[i];
    const modifiedImg = new Image();
    modifiedImg.src = imageData.dataURL;
    modifiedImg.onload = function () {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 1000;
      canvas.height = 1000;

      if (imageData.isPNG) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const x = (canvas.width - modifiedImg.width) / 2;
      const y = (canvas.height - modifiedImg.height) / 2;
      ctx.drawImage(modifiedImg, x, y);

      const imgContainer = document.createElement('div');
      imgContainer.appendChild(canvas);

      const fileName = document.createElement('p');
      fileName.textContent = imageData.name;
      imgContainer.appendChild(fileName);

      const itemContainer = document.createElement('div');
      itemContainer.classList.add('ITEM');
      itemContainer.appendChild(imgContainer);

      const downloadButton = document.createElement('button');
      downloadButton.textContent = 'Download';
      downloadButton.addEventListener('click', function () {
        downloadCanvas(canvas, imageData.name, imageData.isPNG);
      });
      itemContainer.appendChild(downloadButton);

      imageContainer.appendChild(itemContainer);

      if (i === imagesData.length - 1) {
        if (isPNG) {
          downloadPNGButtonEnabled = true;
          const downloadPNGButton = document.getElementById('downloadPNGButton');
          downloadPNGButton.disabled = !downloadPNGButtonEnabled;
        } else {
          downloadJPGButtonEnabled = true;
          const downloadJPGButton = document.getElementById('downloadJPGButton');
          downloadJPGButton.disabled = !downloadJPGButtonEnabled;
        }
      }
    };
  }
}

function changePNGPictures() {
  changePictures(true);
}

function changeJPGPictures() {
  changePictures(false);
}

function downloadCanvas(canvas, fileName, isPNG) {
  const link = document.createElement('a');
  link.download = fileName;

  if (isPNG) {
    link.href = canvas.toDataURL('image/png');
  } else {
    link.href = canvas.toDataURL('image/jpeg', 0.9);
  }

  link.click();
}

document.getElementById('downloadPNGButton').addEventListener('click', function () {
  const zip = new JSZip();
  const imagesData = pngImagesData;

  for (let i = 0; i < imagesData.length; i++) {
    const imageData = imagesData[i];
    const modifiedImg = new Image();
    modifiedImg.src = imageData.dataURL;
    modifiedImg.onload = function () {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 1000;
      canvas.height = 1000;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const x = (canvas.width - modifiedImg.width) / 2;
      const y = (canvas.height - modifiedImg.height) / 2;
      ctx.drawImage(modifiedImg, x, y);

      zip.file(imageData.name, canvas.toDataURL('image/png').split('image/png;base64,')[1], { base64: true });

      if (i === imagesData.length - 1) {
        zip.generateAsync({ type: 'blob' }).then(function (content) {
          const zipFileName = 'png_images_modified.zip';
          saveAs(content, zipFileName);
        });
      }
    };
  }
});

document.getElementById('downloadJPGButton').addEventListener('click', function () {
  const zip = new JSZip();
  const imagesData = jpgImagesData;

  for (let i = 0; i < imagesData.length; i++) {
    const imageData = imagesData[i];
    const modifiedImg = new Image();
    modifiedImg.src = imageData.dataURL;
    modifiedImg.onload = function () {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 1000;
      canvas.height = 1000;

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const x = (canvas.width - modifiedImg.width) / 2;
      const y = (canvas.height - modifiedImg.height) / 2;
      ctx.drawImage(modifiedImg, x, y);

      zip.file(imageData.name, canvas.toDataURL('image/jpeg', 0.9).split('image/jpeg;base64,')[1], { base64: true });

      if (i === imagesData.length - 1) {
        zip.generateAsync({ type: 'blob' }).then(function (content) {
          const zipFileName = 'jpg_images_modified.zip';
          saveAs(content, zipFileName);
        });
      }
    };
  }
});



// const imageUploader = document.getElementById('imageUploader');
//     const imageGallery = document.getElementById('imageGallery');
//     const watermarkUploader = document.getElementById('watermarkUploader');
//     const addWatermarkButton = document.getElementById('addWatermarkButton');
//     const changePicturesButton = document.getElementById('changePicturesButton');
//     const downloadAllButton = document.getElementById('downloadAllButton');
//     let watermarkImage = null;
//     let originalImages = [];
//     let finalImages = [];

//     function addImageToGallery(file) {
//       const imageDiv = document.createElement('div');
//       imageDiv.className = 'image';

//       const image = document.createElement('img');
//       image.src = URL.createObjectURL(file);
//       const originalImageName = file.name;
//       originalImages.push({ name: originalImageName, src: image.src });

//       imageDiv.appendChild(image);
//       imageGallery.appendChild(imageDiv);
//     }

//     addWatermarkButton.addEventListener('click', () => {
//       if (watermarkImage) {
//         try {
//           localStorage.setItem('watermarkImage', watermarkImage);
//           alert('Watermark-ul a fost adăugat în localStorage și poate fi folosit ulterior.');
//         } catch (error) {
//           alert('A apărut o eroare la adăugarea watermark-ului în localStorage.');
//         }
//       }
//     });

//     changePicturesButton.addEventListener('click', () => {
//       finalImages = [];
//       const watermarkDataURL = localStorage.getItem('watermarkImage');
//       if (watermarkDataURL) {
//         const watermark = new Image();
//         watermark.src = watermarkDataURL;
//         watermark.onload = () => {
//           originalImages.forEach((imgData) => {
//             const tempImage = new Image();
//             tempImage.src = imgData.src;
//             tempImage.onload = () => {
//               const tempCanvas = document.createElement('canvas');
//               tempCanvas.width = tempImage.width;
//               tempCanvas.height = tempImage.height;
//               const tempContext = tempCanvas.getContext('2d');
//               tempContext.drawImage(tempImage, 0, 0);
//               tempContext.drawImage(watermark, 0, 0, watermark.width, watermark.height);

//               const finalImage = new Image();
//               finalImage.src = tempCanvas.toDataURL('image/jpeg', 1.0);

//               finalImages.push({ name: imgData.name, src: finalImage.src });

//               const finalImageDiv = document.createElement('div');
//               finalImageDiv.className = 'image';

//               const finalImageElement = document.createElement('img');
//               finalImageElement.src = finalImage.src;
//               finalImageDiv.appendChild(finalImageElement);

//               const downloadButton = document.createElement('a');
//               downloadButton.textContent = 'Download final picture';
//               downloadButton.href = finalImage.src;
//               downloadButton.download = imgData.name;

//               finalImageDiv.appendChild(downloadButton);
//               imageGallery.appendChild(finalImageDiv);

//               if (finalImages.length === originalImages.length) {
//                 downloadAllButton.disabled = false;
//               }
//             };
//           });
//         };
//       }
//     });

//     imageUploader.addEventListener('change', (event) => {
//       const files = event.target.files;
//       if (files) {
//         for (const file of files) {
//           addImageToGallery(file);
//         }
//         addWatermarkButton.removeAttribute('disabled');
//         changePicturesButton.removeAttribute('disabled');
//         downloadAllButton.disabled = true;
//       }
//     });

//     watermarkUploader.addEventListener('change', (event) => {
//       const file = event.target.files[0];
//       if (file && file.type === 'image/png') {
//         watermarkImage = URL.createObjectURL(file);
//         addWatermarkButton.removeAttribute('disabled');
//         changePicturesButton.removeAttribute('disabled');
//         downloadAllButton.disabled = true;
//       }
//     });

//     downloadAllButton.addEventListener('click', () => {
//       if (finalImages.length > 0) {
//         const zip = new JSZip();
//         finalImages.forEach((imgData) => {
//           const img = new Image();
//           img.src = imgData.src;
//           img.onload = () => {
//             const canvas = document.createElement('canvas');
//             const ctx = canvas.getContext('2d');
//             canvas.width = img.width;
//             canvas.height = img.height;
//             ctx.drawImage(img, 0, 0);

//             zip.file(imgData.name, canvas.toDataURL('image/jpeg', 1.0).split('base64,')[1], { base64: true });

//             if (zip.files.length === finalImages.length) {
//               zip.generateAsync({ type: 'blob' }).then(function (content) {
//                 const zipFileName = 'final_images.zip';
//                 saveAs(content, zipFileName);
//               });
//             }
//           };
//         });
//       }
//     });

const imageUploader = document.getElementById('imageUploader');
        const watermarkUploader = document.getElementById('watermarkUploader');
        const addWatermarkButton = document.getElementById('addWatermarkButton');
        const changePicturesButton = document.getElementById('changePicturesButton');
        const downloadAllButton = document.getElementById('downloadAllButton');
        let watermarkImage = null;
        let originalImages = [];
        let finalImages = [];

        imageUploader.addEventListener('change', handleImageUpload);
        watermarkUploader.addEventListener('change', handleWatermarkUpload);
        addWatermarkButton.addEventListener('click', handleAddWatermark);
        changePicturesButton.addEventListener('click', handleChangePictures);
        downloadAllButton.addEventListener('click', handleDownloadAll);

        function handleImageUpload(event) {
            const files = event.target.files;
            if (files) {
                originalImages = Array.from(files);
                // Afiseaza imaginile incarcate initial
                const imageGallery = document.getElementById('imageGallery');
                imageGallery.innerHTML = '';
                originalImages.forEach((file) => {
                    const imageDiv = document.createElement('div');
                    imageDiv.className = 'image';
                    const image = document.createElement('img');
                    image.src = URL.createObjectURL(file);
                    imageDiv.appendChild(image);
                    imageGallery.appendChild(imageDiv);
                });
                addWatermarkButton.removeAttribute('disabled');
                changePicturesButton.removeAttribute('disabled');
                downloadAllButton.disabled = true;
            }
        }

        function handleWatermarkUpload(event) {
            const file = event.target.files[0];
            if (file && file.type === 'image/png') {
                watermarkImage = URL.createObjectURL(file);
                addWatermarkButton.removeAttribute('disabled');
                changePicturesButton.removeAttribute('disabled');
                downloadAllButton.disabled = true;
            }
        }

        function handleAddWatermark() {
            if (watermarkImage) {
                try {
                    localStorage.setItem('watermarkImage', watermarkImage);
                    alert('The watermark has been added to localStorage and can be used later.');
                } catch (error) {
                    alert('An error occurred while adding the watermark to localStorage.');
                }
            }
        }

        function handleChangePictures() {
            finalImages = [];
            const watermarkDataURL = localStorage.getItem('watermarkImage');
            if (watermarkDataURL) {
                const watermark = new Image();
                watermark.src = watermarkDataURL;
                watermark.onload = () => {
                    originalImages.forEach((file) => {
                        const img = new Image();
                        img.src = URL.createObjectURL(file);
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            canvas.width = img.width;
                            canvas.height = img.height;

                            ctx.drawImage(img, 0, 0);
                            ctx.drawImage(watermark, 0, 0, watermark.width, watermark.height);

                            const finalImage = canvas.toDataURL('image/jpeg', 1.0);
                            finalImages.push({ name: file.name, src: finalImage });

                            const finalImageDiv = document.createElement('div');
                            finalImageDiv.className = 'image';

                            const finalImageElement = document.createElement('img');
                            finalImageElement.src = finalImage;
                            finalImageDiv.appendChild(finalImageElement);

                            const downloadButton = document.createElement('a');
                            downloadButton.textContent = 'Download final picture';
                            downloadButton.href = finalImage;
                            downloadButton.download = file.name;

                            finalImageDiv.appendChild(downloadButton);
                            imageGallery.appendChild(finalImageDiv);

                            if (finalImages.length === originalImages.length) {
                                downloadAllButton.disabled = false;
                            }
                        };
                    });
                };
            }
        }

        function handleDownloadAll() {
            if (finalImages.length > 0) {
                const zip = new JSZip();
                const imgFolder = zip.folder('images');

                finalImages.forEach((imgData) => {
                    imgFolder.file(imgData.name, imgData.src.split('base64,')[1], { base64: true });
                });

                zip.generateAsync({ type: 'blob' }).then(function (content) {
                    const zipFileName = 'final_images_watermarked.zip';
                    saveAs(content, zipFileName);
                });
            }
        }

//add shado the best

        //start drop shadow

        document.addEventListener('DOMContentLoaded', function() {
          const fileInput = document.getElementById('file-input');
          const uploadButton = document.getElementById('upload-button');
          const addStylizationButton = document.getElementById('add-stylization');
          const previewShadowButton = document.getElementById('preview-shadow');
          const downloadZipButton = document.getElementById('download-zip-button');
          const horizontalOffsetInput = document.getElementById('horizontal-offset');
          const verticalOffsetInput = document.getElementById('vertical-offset');
          const blurRadiusInput = document.getElementById('blur-radius');
          const imageContainer = document.getElementById('image-container');
          const previewCanvas = document.getElementById('preview-canvas');
          const previewCtx = previewCanvas.getContext('2d');
          let imagesData = [];
        
          uploadButton.addEventListener('click', function() {
            fileInput.click();
          });
        
          fileInput.addEventListener('change', function(event) {
            const files = event.target.files;
            for (const file of files) {
              if (file && file.type === 'image/png') {
                const imageURL = URL.createObjectURL(file);
                const imageWrapper = document.createElement('div');
                imageWrapper.classList.add('image-wrapper');
        
                const image = document.createElement('img');
                image.src = imageURL;
        
                imageWrapper.appendChild(image);
                imageContainer.appendChild(imageWrapper);
        
                imagesData.push({ image, fileName: file.name });
        
                addStylizationButton.removeAttribute('disabled');
                previewShadowButton.removeAttribute('disabled');
              } else {
                alert('Please select only PNG images.');
              }
            }
          });
        
          function applyStylization() {
            const horizontalOffset = parseInt(horizontalOffsetInput.value);
            const verticalOffset = parseInt(verticalOffsetInput.value);
            const blurRadius = parseInt(blurRadiusInput.value);
        
            imagesData.forEach(({ image, fileName }, index) => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              canvas.width = image.naturalWidth;
              canvas.height = image.naturalHeight;
        
              ctx.drawImage(image, 0, 0);
              ctx.filter = `drop-shadow(${horizontalOffset}px ${verticalOffset}px ${blurRadius}px #5a5a5a)`;
              ctx.globalCompositeOperation = 'source-over';
              ctx.drawImage(image, 0, 0);
        
              const imgData = canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
              imagesData[index].processedData = imgData;
        
              const downloadLink = document.createElement('a');
              downloadLink.href = imgData;
              downloadLink.download = fileName;
              downloadLink.textContent = 'Download Picture';
        
              image.parentElement.appendChild(downloadLink);
            });
        
            downloadZipButton.removeAttribute('disabled');
          }
        
          addStylizationButton.addEventListener('click', applyStylization);
        
          previewShadowButton.addEventListener('click', function() {
            const horizontalOffset = parseInt(horizontalOffsetInput.value);
            const verticalOffset = parseInt(verticalOffsetInput.value);
            const blurRadius = parseInt(blurRadiusInput.value);
        
            const image = imagesData[0].image;
        
            previewCanvas.width = image.naturalWidth;
            previewCanvas.height = image.naturalHeight;
            previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
            previewCtx.drawImage(image, 0, 0);
            previewCtx.filter = `drop-shadow(${horizontalOffset}px ${verticalOffset}px ${blurRadius}px #5a5a5a)`;
            previewCtx.drawImage(image, 0, 0);
        
            previewCanvas.style.display = 'block';
          });
        
          downloadZipButton.addEventListener('click', function() {
            const zip = new JSZip();
        
            imagesData.forEach(({ processedData, fileName }) => {
              zip.file(fileName, processedData.split('base64,')[1], { base64: true });
            });
        
            zip.generateAsync({ type: 'blob' }).then(function(content) {
              const zipFileName = 'shaded-images.zip';
              saveAs(content, zipFileName);
            });
          });
        });
        

  // end drop shadow