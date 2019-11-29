// JavaScript Document
window.addEventListener('load', init);

var text;
var size;
var font;
var color;
var fname;
var ext;
var x;
var y;
var linkDisplay;

function init() {
    
    var dropArea = document.getElementById('drop-area');
    var filesDone = 0;
    var filesToDo = 0;
    var progressBar = document.getElementById('progress-bar');
    var fileInput = document.getElementById('fileElem');
    var updateBtn = document.getElementById('update');
    linkDisplay = document.getElementById('link');
    text = document.getElementById('text').value;
    size = document.getElementById('size').value;
    var colorInput = document.getElementById('color');
    var fontSelect = document.getElementById('font');
    color = 'ffffff';
    colorInput.value = '#' + color;
    fname = 'image-placeholder';
    ext = 'png';
    x = document.getElementById('x').value;
    y = document.getElementById('y').value;
    
    document.addEventListener("click", closeAllSelect);
    
    fontSelect.onchange = function () {
        //Testing fonts
        
        var ffName = fontSelect.value.split('/')[1].split('.')[0];
        var ffUrl = 'url(' + fontSelect.value + ')';
        var fontFace = new FontFace(ffName, ffUrl);
        fontFace.load().then(function(loaded_face) {
            document.fonts.add(loaded_face);
            document.getElementById('test').style.fontFamily = ffName + ', Verdana';
        }).catch(function(error) {
            // error occurred
            alert(error);
        });
    }
    
    colorInput.onchange = function () {
        color = colorInput.value.split('#')[1];
    }
    
    updateBtn.onclick = function (e) {
        e.preventDefault();
        
        // get the values from the options
        text = document.getElementById('text').value;
        size = document.getElementById('size').value;
        x = document.getElementById('x').value;
        y = document.getElementById('y').value;
        
        // update the sample image
        var options = {
            text: text,
            size: size,
            font: font,
            color: color,
            fname: fname,
            ext: ext,
            x: x,
            y: y
        };
                
        updateSample(options);
    }
    
    retrieveImages();
    
    retrieveFonts();
    
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

    function highlight() {
        dropArea.classList.add('highlight');
    }

    function unhighlight() {
        dropArea.classList.remove('highlight');
    }
    
    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        var dt = e.dataTransfer;
        var files = dt.files;

        handleFiles(files);
    }
    
    function handleFiles(files) {
        
        initializeProgress(files.length);

        for (var i = 0; i < files.length; i++) {
            
            var file = files[i];
            uploadFile(file);
            previewFile(file);
        }
    }
    
    function uploadFile(file) {
        
        var url = 'process.php'
        var formData = new FormData()

        formData.append('files[]', file)

        fetch(url, {
            method: 'POST',
            body: formData
        })
        .then(() => { /* Done. Inform the user */ progressDone();})
        .catch(() => { /* Error. Inform the user */ })
    }

    
    function previewFile(file) {
        if (file.type.includes('image')){
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function() {
                var img = document.createElement('img');
                img.src = reader.result;
                document.getElementById('gallery').appendChild(img);
            }
        }
        else {
            var img = document.createElement('img');
            img.src = 'font-icon.png';
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
            retrieveFonts();
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
        imageArea.innerHTML = '';
        
        for (var i = 0; i < images.length; i ++) {
            
            // create an image element and set its attributes
            var thumbnail = document.createElement('div');
            thumbnail.className = 'thumbnail';
            var img = document.createElement('img');
            img.src = images[i][1];
            img.alt = images[i][0];
            thumbnail.appendChild(img);
            
            //add the new image to the image area
            if (img.alt == 'image-placeholder.png') {
                thumbnail.classList.add('selected');
                imageArea.insertBefore(thumbnail, imageArea.firstChild);
            }
            else {
                thumbnail.classList.add('unselected');
                imageArea.appendChild(thumbnail);
            }
        }
        
        
        //Old way using table with set columns
        /*var imageTable = document.createElement('table');
        
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
                img.className = 'unselected';
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
        imageArea.appendChild(imageTable);*/
        
        
        document.querySelectorAll('.thumbnail').forEach(item => {
            item.addEventListener('click', event => {
                // set all selected images to unselected
                document.querySelectorAll('.selected').forEach(selected => {
                    selected.classList.remove('selected');
                    selected.classList.add('unselected');
                });
                // change the current image to selected
                item.classList.add('selected');
                item.classList.remove('unselected');
                
                fname = item.firstChild.alt.split('.')[0];
                ext = item.firstChild.alt.split('.')[1];
                
                // update the sample image
                var options = {
                    text: text,
                    size: size,
                    font: font,
                    color: color,
                    fname: fname,
                    ext: ext,
                    x: x,
                    y: y
                };
                
                updateSample(options);
            });
        });
    };
    req.open('get', 'retrieve-images.php', true);
    //                                       ^ Don't block the rest of the execution.
    //                                         Don't wait until the request finishes to
    //                                         continue.
    req.send();
}

function retrieveFonts() {
    
    // stuff for font retrieval

    var req = new XMLHttpRequest(); // New request object
    req.onload = function() {
        // This is where you handle what to do with the response.
        // The actual data is found on this.responseText
        var fonts = JSON.parse(this.responseText);
        
        var fontSelect = document.getElementById('font');
        fontSelect.innerHTML = '';
        
        for (var i = 0; i < fonts.length; i ++) {
            
            // create an option element and set its attributes
            var option = document.createElement('option');
            option.value = fonts[i][0].split('.')[0];
            var span = document.createElement('span');
            span.textContent = fonts[i][0].split('.')[0];
            
            var ffName = fonts[i][1].split('/')[1].split('.')[0];
            var ffUrl = 'url(' + fonts[i][1] + ')';
            var fontFace = new FontFace(ffName, ffUrl);
            fontFace.load().then(function(loaded_face) {
                document.fonts.add(loaded_face);
            }).catch(function(error) {
                // error occurred
                alert(error);
            });
            span.style.fontFamily = ffName + ', Verdana';
            option.appendChild(span);
            
            fontSelect.appendChild(option);
        }
        
        font = fontSelect.options[0].value;
    
        initCustomSelects();
    };
    req.open('get', 'retrieve-fonts.php', true);
    //                                       ^ Don't block the rest of the execution.
    //                                         Don't wait until the request finishes to
    //                                         continue.
    req.send();
}

function updateSample(options) {
    
    var sample = document.getElementById('sample');
    
    sample.src = 'custom_image.php?text=' + options.text + '&size=' + options.size + '&font=' + options.font + '&color=' + options.color + '&fname=' + options.fname + '&ext=' + options.ext + '&x=' + options.x + '&y=' + options.y;
        
    linkDisplay.value = sample.src;
}

function initCustomSelects() {
    
    var customSelects = document.getElementsByClassName('custom-select'); // this is a list of divs with the class custom-select
    
    for (var i = 0; i < customSelects.length; i ++) {
        
        var selectElement = customSelects[i].getElementsByTagName('select')[0]; // get the first select inside the div
        customSelects[i].innerHTML = '';
        customSelects[i].appendChild(selectElement);
        var selectedItem = document.createElement('div'); // create a new div to represent the selected item
        selectedItem.className = 'select-selected';
        selectedItem.innerHTML = selectElement.options[selectElement.selectedIndex].innerHTML; // set the new div's inner html to that of the selected item's
        customSelects[i].appendChild(selectedItem); // append this new item to the custom select
        
        var selectItems = document.createElement('div');
        selectItems.className = 'select-items';
        selectItems.classList.add('select-hide');
        
        for (var j = 0; j < selectElement.length; j ++) {
            var option = document.createElement('div');
            option.innerHTML = selectElement.options[j].innerHTML;
            option.addEventListener('click', function() {
                var select = this.parentNode.parentNode.getElementsByTagName('select')[0];
                var selected = this.parentNode.previousSibling;
                
                for (var i = 0; i < select.length; i ++) {
                    if (select.options[i].innerHTML == this.innerHTML) {
                        select.selectedIndex = i;
                        font = select.value;
                        selected.innerHTML = this.innerHTML;
                        var same = this.parentNode.getElementsByClassName('same-as-selected');
                        
                        for (var j = 0; j < same.length; j ++) {
                            same[j].removeAttribute('class');
                        }
                        
                        this.setAttribute('class', 'same-as-selected');
                        break;
                    }
                }
                selected.click();
            });
        selectItems.appendChild(option);
        }
        customSelects[i].appendChild(selectItems);
        
        selectedItem.addEventListener('click', function (e) {
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle('select-hide');
            this.classList.toggle('select-arrow-active');
        });
    }
}

function closeAllSelect(elmnt) {
 
  var selectItems, selected, arrNo = [];
  selectItems = document.getElementsByClassName("select-items");
  selected = document.getElementsByClassName("select-selected");
  for (var i = 0; i < selected.length; i ++) {
    if (elmnt == selected[i]) {
      arrNo.push(i)
    } else {
      selected[i].classList.remove("select-arrow-active");
    }
  }
  for (i = 0; i < selectItems.length; i ++) {
    if (arrNo.indexOf(i)) {
      selectItems[i].classList.add("select-hide");
    }
  }
}
