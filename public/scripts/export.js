jQuery(document).ready(function ($) { 
    const exportToJsonFile = (obj, exportFramesLink) => {
        obj = obj.map((f) => {
            // remove _ids & _v's 
            return  {
                        title: f.title,
                        description: f.description,
                        words: f.words
                    }
        }) 
        let dataStr = JSON.stringify(obj);
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

