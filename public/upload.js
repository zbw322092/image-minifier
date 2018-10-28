// ************************ Drag and drop ***************** //
let dropArea = document.getElementById("drop-area");

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false);
  document.body.addEventListener(eventName, preventDefaults, false);
});

// Highlight drop area when item is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false);

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight(e) {
  dropArea.classList.add('highlight');
}

function unhighlight(e) {
  dropArea.classList.remove('active');
}

function handleDrop(e) {
  var dt = e.dataTransfer;
  var files = dt.files;

  handleFiles(files);
}

let uploadProgress = [];
let progressBar = document.getElementById('progress-bar');

function updateProgress(percent) {
  progressBar.value = percent;
}

function generateRandomId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function handleFiles(files) {
  files = [...files];
  files.forEach(previewFile);
  uploadFiles(files);
}


function previewFile(file) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = function () {
    const containerDiv = document.createElement('div');
    containerDiv.classList.add('file-container')
    let img = document.createElement('img');
    img.src = reader.result;
    containerDiv.appendChild(img);
    document.getElementById('gallery').appendChild(containerDiv);
  }
}

function uploadFiles(files) {
  var url = window.origin + '/api/upload';
  var xhr = new XMLHttpRequest();
  var formData = new FormData();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

  // Update progress (can be used to show progress indicator)
  xhr.upload.addEventListener("progress", function (e) {
    updateProgress((e.loaded * 100.0 / e.total) || 100);
  })

  xhr.addEventListener('readystatechange', function (e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // updateProgress(100); // <- Add this
      console.log('xhr.response: ', xhr.response);
      const response = JSON.parse(xhr.response) || {};
      const zipFilename = response.filename || '';
      const zipUrl = window.origin + '/zip-download/' + zipFilename;
      console.log(zipUrl);
      const aTag = document.createElement("a");
      // safari doesn't support this yet
      if (typeof aTag.download === 'undefined') {
        window.location = zipUrl;
      } else {
        aTag.href = zipUrl;
        aTag.download = `compressed_images_${Date.now()}`;
        document.body.appendChild(aTag);
        aTag.click();
      }
    }
    else if (xhr.readyState == 4 && xhr.status != 200) {
      // Error. Inform the user
    }
  })

  files.forEach((file, index) => {
    formData.append(`file${index}`, file);
  })
  xhr.send(formData);
}