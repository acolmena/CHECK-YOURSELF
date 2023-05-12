jQuery(document).ready(function ($) { 
    const exportToJsonFile = (jsonData, exportFramesLink) => {
        let dataStr = JSON.stringify(jsonData);
        let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
        let exportFileDefaultName = 'frames.json';
    
        // let linkElement = document.createElement('a');
        exportFramesLink.setAttribute('href', dataUri);
        exportFramesLink.setAttribute('download', exportFileDefaultName);
        // linkElement.click();
    }

    $('#exportFramesBtn').click(function () {
        exportToJsonFile(frames, document.querySelector('#exportFramesBtn'))
    })

});

