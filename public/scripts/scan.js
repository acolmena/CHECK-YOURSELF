// import catchAsync from '../utils/catchAsync';
// import Frame from '../models/frame';
// console.log(frames)
// import frames from '.../routes/frames.js'
// alert("hello from scan.js")
// function hasTrope(trope) {
//     return $("mark").classList.contains(trope);
//   }

// function addPieChart(
// colors,
// genWrdsHLCount,
// tribWrdsHLCount,
// natWrdsHLCount,
// conWrdsHLCount
// ) {
// // update the doughnut chart
// let pieChartHtml = `<script id="chartScript">
// var ctx = document.getElementById('myChart').getContext('2d');
// var chart = new Chart(ctx, {
//     // The type of chart we want to create
//     type: 'doughnut',

//     // The data for our dataset
//     data: {
//         labels: ['Generalization', 'Tribalism', 'Nature and Wildlife', 'Conflict and Violence'],
//         datasets: [{
//             label: ' # Words',
//             backgroundColor: ['${colors[0]}', '${colors[1]}', '${colors[2]}', '${colors[3]}'],
//             borderColor: '#ffffff',
//             borderWidth: '6',
//             data: [${genWrdsHLCount}, ${tribWrdsHLCount}, ${natWrdsHLCount}, ${conWrdsHLCount}],
//         }]
//     },

//     // Configuration options go here
//     options: {}
// });
// </script>`;
// $("#chartCDNScript").after(pieChartHtml);

// // Add note about pie chart functionality
// let tropeBreakdownNote = `<p id="tropeBreakdownNote">Hover over the chart to see how many words of each trope we found. <br><br/> <span class="small"><b>Note:</b> If you wish to see certain tropes on the chart in isolation from others, click on any of the tropes in the legend to remove them from the chart. To add them back to the chart, click on the trope(s) again.</span></p>`;
// // avoid reproducing note if already there
// if (!document.querySelector("#tropeBreakdownNote"))
//     $("#tropeBreakdownMessage").after(tropeBreakdownNote);
// }

// // This function will return the total number of words in the inputted text
// function getTotHighlightedWords(obj) {
// // get all counts, add them up, and return them
// console.log("selecting hilit words", document.querySelectorAll("mark"));
// let sum = 0;
// Object.values(obj).forEach((el) => (sum += el));
// console.log(obj);
// return sum - obj["wl"]; // subtract wlCount from total sum
// }

// catchAsync(async () => {
//     return await Frame.find({});  // find all items in dbs
// })

// const frames = catchAsync();

jQuery(document).ready(function ($) { 
    let i = 0;
    // Highlights the words that match the rgx expression below
    function hiliter(word, element, tropeClass) {
        let wrdCount = 0;
        let rgxp = new RegExp(`\\b${word}\\b`, "gi"); // match word exactly
        // console.log(element)
        element.innerHTML = element.innerHTML.replace(rgxp, function (x) {
                wrdCount += 1;
                return `<mark class=${tropeClass} style='background-color: yellow; border-radius: 7px;'>${x}</mark>`;
        });

        return [wrdCount, element];
    }

    // Returns total number of words in the inputted text
    function getTotWordCount(element) {
        return element.trim().split(/\s+/).length;
    }

    const makeChart = async (titlesArray, valuesArray, i) => {
        (async function() {
        
            new Chart(
            document.getElementById(`myChart${i - 1}`),
            {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: valuesArray
                    }],
                    // These labels appear in the legend and in the tooltips when hovering different arcs
                    labels: titlesArray
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Breakdown of Frames Detected'
                        },
                        colors: {
                            forceOverride: true
                        }
                    }
                }
            }
            );
        })();
    }

    const setupNextScan = (i, outputHTML) => {
        let newScanBtnDiv = document.querySelector('#newScanBtnDiv');
        // console.log(outputHTML)  
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

    const doHover = (ids) => {
        
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

        for (let id of ids) {
            $(`.${id}`).hover(function () {
                console.log('hover')
                // $("#frameMessage").show();
                // $("aside").hide();
                // $("#frameMessage").css("background-color", 'lightgreen'); // turn background of popup text this color
                $(`#${id}`).css("background-color", 'lightgreen'); // turn background of popup text this color
                $(`#${id}`).show();
                $(`.${id}`).css("cursor", "pointer")
            },
            function() {
                $(`#${id}`).hide();
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
        console.log(rawInput)
        let totWords = getTotWordCount(rawInput); // get total number of words that were inputted by user
        console.log('totWords:', totWords)
        rawInput = rawInput.replace(/\n\r?/g, "<br>");
        $(`#outputText${i - 1}`).html(rawInput);

        // 2) Initialize arrays for chart, hover feature, and graphObj for exporting .csv file
        let titlesArray = []
        let valuesArray = []
        let ids = []; // store frame ids of highlighted words

        // 3) Loop over all frames and all their words to check if they're in the text that was inputted (& build up graphObj and arrays)
        let indFrameWrdCount;
        let outputHTML;
        let totFrameCount;
        for (let frame of frames) {
            let title = frame.title;
            titlesArray.push(title)
            totFrameCount = 0;  // counter for tot count of words found for a particular frame
            if (!graphObj[title]) {
                graphObj[title] = {
                                        'totWrdCount': 0,
                                        'indWrdCounts': {}         
                                    }   // start frame object
            }         
            for (let word of frame.words) {
                [indFrameWrdCount, outputHTML] = hiliter(word, document.getElementById(`outputText${i - 1}`), frame._id)  // highlights words and returns count of total times an individual word was found
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
        makeChart(titlesArray, valuesArray, i)

        // 5) Show result block (output text and chart)
        $(`#results${i - 1}`).css('display', 'block')
        
        // 6) Set up & insert output text and chart for next scan
        setupNextScan(i, outputHTML)
        

        // 7) Do hover feature
        doHover(ids);

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
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${i - 1}" aria-expanded="false" aria-controls="collapse${i - 1}">
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
});
