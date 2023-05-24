// jQuery(document).ready(function ($) { 
//     const exportToJsonFile = (obj, exportFramesLink) => {
//         obj = obj.map((f) => {
//             // remove _ids & _v's 
//             return  {
//                         title: f.title,
//                         description: f.description,
//                         words: f.words,
//                         color: f.color
//                     }
//         }) 
//         let dataStr = JSON.stringify(obj);
//         let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
//         let filename = prompt('Enter Filename:') || 'frames.json'
    
//         // let linkElement = document.createElement('a');
//         exportFramesLink.setAttribute('href', dataUri);
//         exportFramesLink.setAttribute('download', filename);
//         // linkElement.click();
//     }

//     $('#exportFramesLink').click(function () {
//         exportToJsonFile(frames, document.querySelector('#exportFramesLink'))
//     })

// });

