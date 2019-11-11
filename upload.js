// JavaScript Document
window.onload = init;


function init() {
    
    let dropArea = document.getElementById('drop-area');
    let filesDone = 0;
    let filesToDo = 0;
    let progressBar = document.getElementById('progress-bar');
    let fileInput = document.getElementById('fileElem');
    
    retrieveImages();
    
    fileInput.addEventListener('change', function(){handleFiles(this.files);});

    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach (eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false)
    });

    function preventDefaults (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false)
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false)
    });

    function highlight(e) {
        dropArea.classList.add('highlight');
    }

    function unhighlight(e) {
        dropArea.classList.remove('highlight');
    }
    
    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        let dt = e.dataTransfer;
        let files = dt.files;

        handleFiles(files);
    }
    
    function handleFiles(files) {
        
        initializeProgress(files.length);

        for (let i = 0; i < files.length; i++) {
            
            let file = files[i]
            uploadFile(file);
            previewFile(file);
        }
    }
    
    function uploadFile(file) {
        
        let url = 'process.php'
        let formData = new FormData()

        formData.append('files[]', file)

        fetch(url, {
            method: 'POST',
            body: formData
        })
        .then(() => { /* Done. Inform the user */ progressDone();})
        .catch(() => { /* Error. Inform the user */ })
    }

    
    function previewFile(file) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function() {
            let img = document.createElement('img');
            img.src = reader.result;
            document.getElementById('gallery').appendChild(img);
        }
    }
    
    function initializeProgress(numfiles) {
        progressBar.value = 0;
        filesDone = 0;
        filesToDo = numfiles;
    }

    function progressDone() {
        filesDone ++;
        progressBar.value = filesDone / filesToDo * 100;
        
        if (progressBar.value == 100) {
            retrieveImages();
        }
    }
}

function retrieveImages() {
    
    // stuff for image retrieval

    var req = new XMLHttpRequest(); // New request object
    req.onload = function() {
        // This is where you handle what to do with the response.
        // The actual data is found on this.responseText
        var images = JSON.parse(this.responseText);
        
        var imageArea = document.getElementById('images');
        
        var imageTable = document.createElement('table');
        
        var perRow = 3;
        
        var numRows = images.length / perRow;
        
        if (numRows % 1 > 0) {
            
            var difference = 1 - (numRows % 1);
            
            numRows += difference;
        }
        
        var rowStart = 0;
        
        for (var i = 0; i < numRows; i ++) {
            var tr = document.createElement('tr');
            
            for (var j = 0; j < perRow; j ++) {
                var td = document.createElement('td');
                var img = document.createElement('img');
                img.src = images[rowStart + j][1];
                img.alt = images[rowStart + j][0];
                td.appendChild(img);
                tr.appendChild(td);
                
                if (rowStart + j == images.length - 1) {
                    break;
                }
            }
            
            rowStart += perRow;
            
            imageTable.appendChild(tr);
        }
        
        imageArea.innerHTML = '';
        imageArea.appendChild(imageTable);
    };
    req.open('get', 'retrieve-images.php', true);
    //                                       ^ Don't block the rest of the execution.
    //                                         Don't wait until the request finishes to
    //                                         continue.
    req.send();
    
}
