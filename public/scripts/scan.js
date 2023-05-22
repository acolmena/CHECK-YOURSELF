jQuery(document).ready(function ($) { 
    let i = 0;
    // Highlights the words that match the rgx expression below
    function hiliter(word, element, tropeClass, color) {
        let wrdCount = 0;
        let rgxp = new RegExp(`\\b${word}\\b`, "gi"); // match word exactly
        element.innerHTML = element.innerHTML.replace(rgxp, function (x) {
                wrdCount += 1;
                return `<mark class=${tropeClass} style='background-color: ${color}; border-radius: 7px;'>${x}</mark>`;
        });

        return [wrdCount, element];
    }

    // Returns total number of words in the inputted text
    function getTotWordCount(element) {
        return element.trim().split(/\s+/).length;
    }

    const makeChart = async (titlesArray, valuesArray, i, colorsArray) => {
        (async function() {
            new Chart(
            document.getElementById(`myChart${i - 1}`),
            {
                type: 'doughnut',
                data: {
                    labels: titlesArray,
                    datasets: [{
                        label: 'Number of Words Found',
                        data: valuesArray,
                         // These labels appear in the legend and in the tooltips when hovering different arcs
                        backgroundColor: colorsArray,
                    }],
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
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
                                                <p class="rounded-text-box" id="outputText${i}" style="background-color: #F4F5F5;
                                                                                                    border-radius: 20px; width: 50%;
                                                                                                    min-width: 400px;
                                                                                                    float: left;
                                                                                                    height: auto;
                                                                                                    padding: 3%;
                                                                                                    border-radius: 10px;
                                                                                                    margin-left: 5%;
                                                                                                    background-color: #F4F5F5;
                                                                                                    margin-bottom: 200px;">${outputHTML}</p>
                                                <div id="chartPar${i}" style="width: 650px; margin-bottom: 50px">
                                                    <canvas id="myChart${i}" aria-label="pie chart for scan" role="pie chart">
                                                        <p>Pie chart breaking down instances of frames found</p>
                                                    </canvas> 
                                                    
                                                </div>
                                         </div>`
        // insert next outputText box below original one
        newScanBtnDiv.insertAdjacentHTML("beforebegin", nextOutputTextAndChart);
    }

    const doHover = (ids, colorsArray) => {
        
        // $("mark").bind("mousemove", function (e) {
        //     console.log('doOverEnter')
        //     // $("#frameMessage").css({
        //     //   top: e.pageY,
        //     // });
        // });
      
        // $("html").click(function (closeMessage) {
        //     // if (!($(closeMessage.target).closest(`#${id}`).length > 0)) {
        //         if ($(`#${id}`).is(":visible")) {
        //             $(`#${id}`).hide();
        //         }
        //     // }
        // });

        for (let j = 0; j < ids.length; j++) {
            console.log(ids[j])
            $(`.${ids[j]}`).hover(function () {   // for mousenter
                // $("#frameMessage").show();
                // $("aside").hide();
                // $("#frameMessage").css("background-color", 'lightgreen'); // turn background of popup text this color
                $(`#${ids[j]}`).css("background-color", colorsArray[j]); // turn background of popup text this color
                $(`#${ids[j]}`).show();
                $(`.${ids[j]}`).css("cursor", "pointer")
            },
            function() {   // for mouseexit
                $(`#${ids[j]}`).hide();
            });
        }
    }

    let graphObj = {
        'totWrdCountAllFrames': 0
    }

    // const string = "dead tuna turaco pain amphibian reptil ya ya ay"

    $('#scanArticleBtn').click( function() {
        console.log(graphObj, 'beginning')
        i++;
        console.log(i)

        // 1) Grab input text and do preliminary cleanup
        let rawInput = document.querySelector("#inputText").value;
        let totWords = getTotWordCount(rawInput); // get total number of words that were inputted by user
        rawInput = rawInput.replace(/\n\r?/g, "<br>");
        $(`#outputText${i - 1}`).html(rawInput);

        // 2) Initialize arrays for chart, hover feature, and graphObj for exporting .csv file
        let titlesArray = []
        let valuesArray = []
        let colorsArray = []
        let ids = []; // store frame ids of highlighted words

        // 3) Loop over all frames and all their words to check if they're in the text that was inputted (& build up graphObj and arrays)
        let indFrameWrdCount;
        let outputHTML;
        let totFrameCount;
        for (let frame of frames) {
            let title = frame.title;
            titlesArray.push(title)
            let color = frame.color
            colorsArray.push(color)
            totFrameCount = 0;  // counter for tot count of words found for a particular frame
            if (!graphObj[title]) {
                graphObj[title] = {
                                        'totWrdCount': 0,
                                        'indWrdCounts': {}         
                                    }   // start frame object
            }         
            for (let word of frame.words) {
                [indFrameWrdCount, outputHTML] = hiliter(word, document.getElementById(`outputText${i - 1}`), frame._id, color)  // highlights words and returns count of total times an individual word was found
                if (!graphObj[title].indWrdCounts[word]) {
                    graphObj[title].indWrdCounts[word] = indFrameWrdCount;  // add word and count if word is not already in graphObj
                } else {
                    graphObj[title].indWrdCounts[word] += indFrameWrdCount;  // add to count if word is alread
                }
                totFrameCount += indFrameWrdCount
            }

            // Add hover event listener to highlighted frames
            ids.push(frame._id)

            // Add word counts to arrays and graphObj
            graphObj[title].totWrdCount += totFrameCount;
            valuesArray.push(totFrameCount)
            graphObj.totWrdCountAllFrames += totFrameCount;  // add total wrdCount of each frame to full total of all frames
        }

        // 4) Make chart
        makeChart(titlesArray, valuesArray, i, colorsArray)

        // 5) Show result block (output text and chart)
        $(`#results${i - 1}`).css('display', 'block')
        
        // 6) Set up & insert output text and chart for next scan
        setupNextScan(i, outputHTML)
        

        // 7) Do hover feature
        doHover(ids, colorsArray);

        // 8) Make it so that website automatically scrolls to current result
        document.querySelector(`#results${i - 1}`).scrollIntoView({behavior: "smooth"})

        // 9) hide scanner 
        document.querySelector('#inputForm').style.display = 'none'

        // 10) show button to make new scan
        newScanBtn.style.display = 'block'
        console.log(graphObj)
    })



    // scan again functionality
    const newScanBtn = document.querySelector('#newScanBtn');
    newScanBtn.addEventListener("click", function() { 
        let inputForm = document.querySelector('#inputForm');
        // 1) Show scanner (input box and "scan article" btn)
        inputForm.style.display = 'block'

        // 2) Clear textarea
        document.querySelector('#inputText').value = ''

        // 3) Hide 'Scan Again' button
        newScanBtn.style.display = 'none'

        // 4) Scroll down to scan area
        inputForm.scrollIntoView({behavior: "smooth"})

        // 5) Wrap outputText in collapsed accordion
        let resultDiv = document.querySelector(`#results${i - 1}`);
        let accordionPrevOT = `<div class="accordion-item" id="accordionItem${i - 1}">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i - 1}" aria-expanded="false" aria-controls="collapse${i - 1}" style="background-color: #b3f8f6;">
                                            Scan ${i}
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
        
      
    })


    const createCSV = (obj) => {
        // array that will store csv values
        let csvRows = [];
    
        // make headers
        const headers = 'Frame Titles,Total Word Count, Individual Words, Word Count For Individual Word'
    
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
    
    
    const exportToCSVFile = (obj, exportResultsLink) => {
        let csvData = createCSV(obj)
    
        // (from Geeks For Geeks) 
        // Creating a Blob for having a csv file format and passing the data with type
        const blob = new Blob([csvData], { type: 'text/csv' });
      
        // (from Geeks For Geeks)
        // Creating an object for downloading url
        const url = window.URL.createObjectURL(blob);

        
        exportResultsLink.setAttribute('href', url);
        exportResultsLink.setAttribute('download', 'results.csv');
    }
    
    $('#exportResultsBtn').click(function () {
        exportToCSVFile(graphObj, document.querySelector('#exportResultsBtn'))
    })
    
    
    
});




