jQuery(document).ready(function ($) { 
    let i = 0;
    // Highlights the words that match the rgx expression below
    function hiliter(word, element, tropeClass, color) {
        let wrdCount = 0;
        let rgxp = new RegExp(`\\b${word}\\b`, "gi"); // match word exactly
        element.innerHTML = element.innerHTML.replace(rgxp, function (x, offset) {
            if (
                element.innerHTML.slice(offset + x.length, offset + x.length + 6) ===
                  "</mark" ||
                element.innerHTML.slice(offset - 2, offset) == '">'
              ) return x;    // if outside has already been highlighted, don't highlight again
            wrdCount += 1;
            return `<mark class=${tropeClass} style='background-color: ${color}; border-radius: 7px;'>${x}</mark>`;
        });
        return [wrdCount, element];
    }

    // Returns total number of words in the inputted text
    function getTotWordCount(element) {
        return element.trim().split(/\s+/).length;
    }

    const makeChart = async (frameTitlesArray, valuesArray, i, colorsArray) => {
        (async function() {
            new Chart(
            document.getElementById(`myChart${i - 1}`),
            {
                type: 'doughnut',
                data: {
                    labels: frameTitlesArray,
                    datasets: [{
                        label: 'Number of Words Found',
                        data: valuesArray,
                         // These labels appear in the legend and in the tooltips when hovering different arcs
                        backgroundColor: colorsArray,
                        borderWidth: 2,
                        borderColor: '#F4F3F3'
                    }],
                },
                options: {
                    plugins: {
                        title: {
                            display: false,
                            text: 'Breakdown of Frames Detected'
                        }
                    }
                }
            }
            );
        })();
    }

    const setupNextScan = (i, outputHTML) => {
        let newScanBtnDiv = document.querySelector('#newScanBtnDiv'); 
        let nextOutputTextAndChart = `<div id="results${i}"  style="display: none;">
                                                <p class="rounded-text-box border border-1 border-black" id="outputText${i}" style="
                                                                                                    background-color: #F4F5F5;
                                                                                                    border-radius: 20px; width: 50%;
                                                                                                    min-width: 400px;
                                                                                                    float: left;
                                                                                                    height: auto;
                                                                                                    padding: 3%;
                                                                                                    border-radius: 10px;
                                                                                                    margin-left: 5%;
                                                                                                    background-color: #FFFFFF;
                                                                                                    margin-bottom: 200px;">${outputHTML}</p>
                                                <div class="d-grid gap-2 col-2 mx-auto" id="chartPar${i}" style="width: 650px; margin-bottom: 50px">
                                                    <canvas id="myChart${i}" aria-label="pie chart for scan" role="pie chart">
                                                        <p>Pie chart breaking down instances of frames found</p>
                                                    </canvas> 
                                                    
                                                </div>
                                         </div>`
        // insert next outputText box below original one
        newScanBtnDiv.insertAdjacentHTML("beforebegin", nextOutputTextAndChart);
    }

    const doHover = (index, ids, colorsArray) => {
        
        for (let j = 0; j < ids.length; j++) {
            console.log(ids[j])
            $(`.${ids[j]}`).hover(function () {   // for mousenter
                $("#frameMessage").show();
                $("aside").hide();
                // $("#frameMessage").css("background-color", 'lightgreen'); // turn background of popup text this color
                $(`#${ids[j]}`).css("background-color", colorsArray[j]); // turn background of popup text this color
                $(`#${ids[j]}`).show();
                $(`.${ids[j]}`).css("cursor", "pointer")
            })
            // ,
            // function() {   // for mouseexit
            //     $(`#${ids[j]}`).hide();
            // });

            $(`#outputText${index}`).bind("mousemove", function (e) {
                console.log('topPage')
                $("#frameMessage").css({
                  top: e.pageY,
                });
            });
          
            $("html").click(function (closeMessage) {
                if (!($(closeMessage.target).closest(`#${ids[j]}`).length > 0)) {
                    // if ($(`#${ids[j]}`).is(":visible")) {
                        $(`#${ids[j]}`).hide();
                    }
                // }
            });
        }
    }

    // Initialize objects for exporting .csv files
    let graphObj = {
        'totWrdCountAllFrames': 0
    }
    let txtContentRows = ['Scan #, Text Title, Text Content']
    let articleAllRows = ['Article Title,Article Word Count,Frames Found,Words Found For Each Frame,Frequency of Words in Article,Total # Words Found For Frame,Total Words Highlighted,Percentage of Article Highlighted'];  // make rows array and insert headers
    // let articleAnalysisObj = {};

    $('#scanArticleBtn').click( function() {
        console.log(graphObj, 'beginning')
        i++;
        console.log(i)   

        // 0) Restructure words arrays so that the values with > 1 word and the ones that have dashes go before the ones that don't
        let firstArr;
        let secondArr;
        let restructuredFrames = []
        for (let frame of frames) {
            // Add hover event listener to highlighted frames
            firstArr = [];
            secondArr = [];
            for (let word of frame.words) {
                if (word.split(" ").length >= 2 || word.includes('-')) {
                    firstArr.push(word)
                } else {
                    secondArr.push(word)
                }
            }
            console.log(firstArr, secondArr)
            let restructuredWrds = firstArr.concat(secondArr)
            restructuredFrames.push(
                {
                    "_id": frame._id,
                    "title": frame.title,
                    "words": restructuredWrds, 
                    "color": frame.color             
                }
            )
        }
        console.log(restructuredFrames)

        // 1) Grab input text, do preliminary cleanup, and add to objects for exporting csv files 
        let rawInput = document.querySelector("#inputText").value;
        let textTitle = document.querySelector("#inputTitle").value;
        let totWords = getTotWordCount(rawInput + " " + textTitle); // get total number of words that were inputted by user
        txtContentRows.push(`${i},${textTitle},${rawInput}`)
        articleIndRows = `${textTitle},${totWords}`
        rawInput = rawInput.replace(/\n\r?/g, "<br>");
        $(`#outputText${i - 1}`).html(`<h5>${textTitle}</h5><br>` + rawInput);

        // 1.5) 
        
        // 2) Initialize arrays for chart, hover feature, and graphObj for exporting .csv file
        let frameTitlesArray = []
        let valuesArray = []  // will hold count of wrds found for each frame
        let colorsArray = []
        let ids = []; // store frame ids of highlighted words
 

        // 3) Loop over all frames and all their words to check if they're in the text that was inputted (& build up graphObj and arrays)
        let indWrdCount;
        let outputHTML;
        let totFrameCount;
        let j = 0;
        let k;
        let totWrdsHilitedPerText = 0;
        for (let frame of restructuredFrames) {
            j++;
            let color = frame.color
            colorsArray.push(color)
            ids.push(frame._id)
            let frameTitle = frame.title;
            frameTitlesArray.push(frameTitle)
            totFrameCount = 0;  // counter for tot count of words found for a particular frame
            if (!graphObj[frameTitle]) {
                graphObj[frameTitle] = {
                                        'totWrdCount': 0,
                                        'indWrdCounts': {}         
                                    }   // start frame object
            }         
            k = 0;
            let subsequentWrd = false;
            for (let word of frame.words) {
                k++;
                [indWrdCount, outputHTML] = hiliter(word, document.getElementById(`outputText${i - 1}`), frame._id, color)  // highlights words and returns count of total times an individual word was found
                // for text analysis results table
                if (indWrdCount) {
                    if (!subsequentWrd) {  // if this is the first word of the frame to be added to the table
                        if (j === 1) {
                            articleIndRows += `,${frameTitle},${word},${indWrdCount}`;
                            console.log('enter')
                        } else {
                            articleAllRows.push(articleIndRows)
                            articleIndRows = ''
                            articleIndRows = `,,${frameTitle},${word},${indWrdCount}`;
                        }
                        subsequentWrd = true;
                        
                    } else {
                        articleAllRows.push(articleIndRows)
                        articleIndRows = ''
                        articleIndRows = `,,,${word},${indWrdCount}`
                        // if (k !== frame.words.length) {
                        //     articleAllRows.push(articleIndRows)
                        //     articleIndRows = ''
                        // }
                    }
                    
                }
                if (!graphObj[frameTitle].indWrdCounts[word]) {
                    graphObj[frameTitle].indWrdCounts[word] = indWrdCount;  // add word and count if word is not already in graphObj
                } else {
                    graphObj[frameTitle].indWrdCounts[word] += indWrdCount;  // add to count if word is alread
                }
                totFrameCount += indWrdCount
            }

            
            if (totFrameCount) {
                articleIndRows += `,${totFrameCount}`
                if (j !== restructuredFrames.length) {
                    articleAllRows.push(articleIndRows)
                    articleIndRows = ''
                }
               
            }
            // Add word counts to arrays and graphObj
            graphObj[frameTitle].totWrdCount += totFrameCount;
            valuesArray.push(totFrameCount)
            graphObj.totWrdCountAllFrames += totFrameCount;  // add total wrdCount of each frame to full total of all frames
            totWrdsHilitedPerText += totFrameCount;
        }

        let percentHilited = (totWrdsHilitedPerText / totWords) * 100;
        articleIndRows += `,${totWrdsHilitedPerText},${percentHilited}`
        articleAllRows.push(articleIndRows)
        articleIndRows = ''

        // 4) Make chart
        makeChart(frameTitlesArray, valuesArray, i, colorsArray)

        // 5) Show result block (output text and chart)
        $(`#results${i - 1}`).css('display', 'block')
        
        // 6) Set up & insert output text and chart for next scan
        setupNextScan(i, outputHTML)
        

        // 7) Do hover feature
        doHover(i - 1, ids, colorsArray);

        // 8) Make it so that website automatically scrolls to current result
        document.querySelector(`#results${i - 1}`).scrollIntoView({behavior: "smooth"})

        // 9) hide scanner 
        // document.querySelector('#inputForm').style.display = 'none'
        $('#inputForm').hide();

        // 10) show button to make new scan
        newScanBtn.style.display = 'block'
        console.log(txtContentRows)
        console.log(articleAllRows)
    })



    // scan again functionality
    const newScanBtn = document.querySelector('#newScanBtn');
    newScanBtn.addEventListener("click", function() { 
        let inputForm = document.querySelector('#inputForm');
        // 1) Show scanner (input box and "scan article" btn)
        // inputForm.style.display = 'block'
        $('#inputForm').show();

        // 2) Hide 'Scan Again' button
        newScanBtn.style.display = 'none'

        // 3) Scroll down to scan area
        inputForm.scrollIntoView({behavior: "smooth"})

        // 4) Wrap outputText in collapsed accordion
        let resultDiv = document.querySelector(`#results${i - 1}`);
        let textTitle = document.querySelector("#inputTitle").value;
        let accordionPrevOT = `<div class="accordion-item" id="accordionItem${i - 1}">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed text-black" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i - 1}" aria-expanded="false" aria-controls="collapse${i - 1}" style="background-color: #BF97F8;padding: 9px 24px;font-family: 'Archivo Black', sans-serif;">
                                            <strong style="font-weight: 600">Scan ${i}: ${textTitle}</strong>
                                        </button>
                                    </h2>
                                    <div id="collapse${i - 1}" class="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                        <div class="accordion-body" id="accordionBody${i-1}"></div>
                                    </div>
                                </div>`
        
        $(`#results${i - 1}`).remove();
        if (i === 1) {
            $('#accordion').html(accordionPrevOT);
            // Show accordion
            $('#accordion').show()
        } else {
            $(`#accordionItem${i - 2}`).after(accordionPrevOT);  // attach current accordion after previous one
        }
        $(`#accordionBody${i-1}`).html(resultDiv)  
        
        // 5) Clear textarea & input title area
        document.querySelector('#inputText').value = ''
        document.querySelector('#inputTitle').value = ''
      
    })


    const createCSV = (obj) => {
        // array that will store csv values
        let csvRows = [];
    
        // make headers
        const headers = 'Frame Titles,Total Words Found, Individual Words, Number of Words Found For Individual Word'
    
        // push headers onto csvRows
        csvRows.push(headers)
    
        for (let frameKey of Object.keys(obj)) {
            let indFrameObj = obj[frameKey]
            let frameRowArr = [frameKey]
            for (let indFrameKey of Object.keys(indFrameObj)) {
                if (indFrameKey === 'totWrdCount') {
                    frameRowArr.push(obj[frameKey][indFrameKey])  // insert total wrd count for frame in row
                } else {
                    // loop through each word and make new rows 
                    let individualWrds = Object.keys(obj[frameKey][indFrameKey]);
                    for (let k = 0; k < individualWrds.length; k++) {
                        let wrd = individualWrds[k]
                        let indWrdCount = obj[frameKey]['indWrdCounts'][wrd]
                       
                        // add first word to same row that has frame title
                        if (k === 0) {
                            frameRowArr.push(wrd)  // push wrd
                            frameRowArr.push(indWrdCount)   // push wrd count
                            console.log(frameRowArr)
                            console.log('csvRows', csvRows)
                            csvRows.push(frameRowArr.join(','))  // make into string separated by commas and push into csvRows
                        } else {
                            frameRowArr = `,,${wrd},${indWrdCount}`;
                            csvRows.push(frameRowArr)
                        }
    
                    }
                }
            }
    
        }
        return csvRows.join('\n')
    
    
    }
    
    
    const exportToCSVFile = (info, exportResultsLink, defaultName) => {
            let csvData;
            if (defaultName === 'overall-results') {
                csvData = createCSV(info)
            } else {
                csvData = info.join('\n')
            }
           
    
            // (from Geeks For Geeks) 
            // Creating a Blob for having a csv file format and passing the data with type
            const blob = new Blob([csvData], { type: 'text/csv' });
        
            // (from Geeks For Geeks)
            // Creating an object for downloading url
            const url = window.URL.createObjectURL(blob);

            let filename = prompt(`Enter Filename (default name is '${defaultName}.csv'):`) || `${defaultName}.csv`

            exportResultsLink.setAttribute('href', url);
            exportResultsLink.setAttribute('download', filename);
    }

    const exportToJsonFile = (obj, exportFramesLink) => {
        obj = obj.map((f) => {
            // remove _ids & _v's 
            return  {
                        title: f.title,
                        description: f.description,
                        words: f.words,
                        color: f.color
                    }
        }) 
        let dataStr = JSON.stringify(obj);
        let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
        let filename = prompt("Enter Filename (default name is 'frames.json'):") || 'frames.json'
    
        // let linkElement = document.createElement('a');
        exportFramesLink.setAttribute('href', dataUri);
        exportFramesLink.setAttribute('download', filename);
        // linkElement.click();
    }
    
    // Exporting Results
    $('#exportOverallResultsLink').click(function () {
        exportToCSVFile(graphObj, document.querySelector('#exportOverallResultsLink'), 'overall-results')
    })

    $('#exportArticleResultsLink').click(function () {
        exportToCSVFile(articleAllRows, document.querySelector('#exportArticleResultsLink'), 'results-of-each-article')
    })



    // $('#exportBothContentLink').click(function () {
    //     exportToJsonFile(frames, document.querySelector('#exportFramesLink'))
    //     exportToCSVFile(txtContentRows, document.querySelector('#exportTxtContentLink'), 'analyzed-text-content')
    // })


    // Exporting Content
    $('#exportFramesLink').click(function () {
        exportToJsonFile(frames, document.querySelector('#exportFramesLink'))
    })

    $('#exportTxtContentLink').click(function () {
        console.log(txtContentRows)
        exportToCSVFile(txtContentRows, document.querySelector('#exportTxtContentLink'), 'analyzed-text-content')
    })
    
    
    
});




