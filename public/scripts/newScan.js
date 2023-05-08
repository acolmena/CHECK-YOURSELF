const newScanBtn = document.querySelector('#newScanBtn');
newScanBtn.addEventListener("click", function() { 
    // 1) Show scanner (input box and "scan article" btn)
    document.querySelector('#inputForm').style.display = 'block'

    // 2) Clear textarea
    document.querySelector('#inputText').value = ''

    // 3) Hide 'Scan Again' button
    newScanBtn.style.display = 'none'
    // 4) Wrap outputText in collapsed accordion

})