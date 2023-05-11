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

    const doHover = (ids) => {
        
        $("mark").bind("mousemove", function (e) {
            console.log('doOverEnter')
            $("#frameMessage").css({
              top: e.pageY,
            });
        });
      
        $("html").click(function (closeMessage) {
            if (!($(closeMessage.target).closest("#frameMessage").length > 0)) {
                if ($("#frameMessage").is(":visible")) {
                    $("#frameMessage").hide();
                }
            }
        });

        for (let id of ids) {
            $(`.${id}`).hover(function () {
                console.log('hover')
                $("#frameMessage").show();
                $("aside").hide();
                $("#frameMessage").css("background-color", 'lightgreen'); // turn background of popup text this color
                $(`#${id}`).show();
                $(`.${id}`).css("cursor", "pointer")
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
        let outputText = document.querySelector(`#outputText${i - 1}`);
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








// Main function: hilights words for outputText and builds up graphObj 
// function hilitFrames(frames, element) {
//     console.log(typeof frames)
//     console.log(element)
//     const graphObj = {
//                         'totWrdCountAllFrames': 0
//                      }
//     for (let frame of frames) {
//         graphObj[frame.title] = {
//                                     'totWrdCount': 0,
//                                     'indWrdCounts': {}         
//                                 }   // start frame object
//         let totFrameCount = 0;  // counter for tot count of words found for a particular frame
//         for (let word of frame.words) {
//             let indFrameWrdCount = hiliter(word, element, frame.title)  // highlights words and returns count of total times an individual word was found
//             graphObj[frame.title].indWrdCounts[word] = indFrameWrdCount;
//             totFrameCount += indFrameWrdCount
//         }
//         graphObj[frame.title].totWrdCount = totFrameCount;
//         graphObj.totWrdCountAllFrames += totFrameCount;  // add total wrdCount of each frame to full total of all frames
//     }
//     console.log(graphObj, string)
//     document.querySelector('#outputText').style.display = 'block'
// }







// $("#scanArticle").click(function () {
// let rawInput = document.getElementById("inputText").value;
// let totWords = getTotWordCount(rawInput); // get total number of words that were inputted by user
// rawInput = rawInput.replace(/\n\r?/g, "<br>");
// $("#outputText").html(rawInput);

// // initialize graph object (graphObj)
// let graphObj = { wl: 0, gen: 0, con: 0, trib: 0, nat: 0 };


// console.time("gen hilit time");
// for (let genWord of generalizationArray) {
//     graphObj = hiliter(
//     genWord,
//     document.getElementById("outputText"),
//     "gen",
//     graphObj,
//     false,
//     false
//     );
// }
// console.timeEnd("gen hilit time");


// console.time("wl unhilit time");
// // Making the wl words not be highlighted
// let whitelistedWords = document.getElementsByClassName("wl"); // Find the elements
// console.log(whitelistedWords);
// let rgxpTropeTag = /gen|trib/i;
// for (let whitelistWord of whitelistedWords) {
//     whitelistWord.innerHTML = whitelistWord.innerHTML.replace(
//     rgxpTropeTag,
//     "wl"
//     ); // Change the class name
// }
// console.timeEnd("wl unhilit time");

// // // add up all highlighted words
// // console.time("setting info for pie chart");
// // console.log(document.querySelectorAll(".nat").length);
// // let totHighlightedWords = getTotHighlightedWords(graphObj);
// // console.log(totWords);
// // let perTropeWrds = ((totHighlightedWords / totWords) * 100).toFixed(0);
// // // declare these as global variables using window obj to be able to use them for color-blind friendly button
// // console.log(document.querySelectorAll("mark .con").length);
// // let wlSubtract = graphObj["wl"] ? 1 : 0;
// // console.log(wlSubtract);
// // window.genWrdsHLCount = graphObj["gen"];
// // window.conWrdsHLCount = graphObj["con"];
// // window.tribWrdsHLCount = graphObj["trib"];
// // window.natWrdsHLCount = graphObj["nat"];
// // console.timeEnd("setting info for pie chart");

// // if CBF colors button is checked, set colors array to be CBF; else, set to original colors
// let colors;
// if ($("#clrBlndCheckbox").prop("checked")) {
//     // order: gen popup background (PB), trib PB, nat PB, con PB, gen link color, trib link color, nat link color, con link color
//     colors = [
//     "#3DB7E9",
//     "#f0e442",
//     "#d55e00  ",
//     "black  ",
//     "#f0e442",
//     "#3DB7E9",
//     "#f0e442",
//     "#f0e442",
//     ]; // CBF colors for when you hover over word
//     // change general highlighting colors and font color of highlighted words
//     $(".gen").css("background-color", "#3DB7E9");
//     $(".trib").css("background-color", "#f0e442");
//     $(".nat").css("background-color", "#d55e00");
//     $(".con").css({ "background-color": "black  ", color: "white" });
// } else {
//     // color order: gen PB, trib PB, nat PB, con PB, gen link color, trib link color, con link color
//     colors = [
//     "#a8edea",
//     "#eaa8d2",
//     "#a7ffa3",
//     "#ffcc80",
//     "#ff7451",
//     "rgb(59, 84, 205)",
//     "#ff7451",
//     "rgb(59, 84, 205)",
//     ];
// }

// console.log(colors);

// // // Remove previous chart if there was one:
// // if (document.querySelector("#chartScript")) {
// //     // remove previous graph
// //     $("#chartScript").remove();
// //     $("#myChart").remove(); // IMPORTANT: canvas needs to be removed and added again (next line of code) to avoid pie chart glitch
// //     $("#chartCDNScript").before('<canvas id="myChart"></canvas>');
// // }
// // // Add corresponding heading and text (always)
// // const h2BreakdownTag = `<h2 id="tropeBreakdownHeader">Breakdown of words found</h2>`;
// // // add ternary statement to avoid reproducing h2 tags
// // !document.querySelector("#tropeBreakdownHeader") &&
// //     $("#tropeMessage").after(h2BreakdownTag);
// // let tropeBreakdownMessage = `<p id="tropeBreakdownMessage">We found <b>${totHighlightedWords}</b> ${
// //     totHighlightedWords === 1 ? "word" : "words"
// // } (~ ${perTropeWrds}% of this article) associated with tropes about Africa.</p>`;
// // $("#tropeBreakdownMessage").remove(); // remove previous text
// // $("#tropeBreakdownHeader").after(tropeBreakdownMessage); // update with new text
// // // add text describing chart feature with legend
// // // Create pie chart if ASTRSC found any trope words
// // if (totHighlightedWords) {
// //     addPieChart(
// //     colors,
// //     genWrdsHLCount,
// //     tribWrdsHLCount,
// //     natWrdsHLCount,
// //     conWrdsHLCount
// //     );
// // } else {
// //     $("#tropeBreakdownNote").remove(); // remove previous note
// // }

// // account for updating values

// $("#outputText").css("display", "block");
// $("mark").bind("mousemove", function (e) {
//     $("#tropeMessage").css({
//     top: e.pageY,
//     });
// });

// $("html").click(function (closeMessage) {
//     if (!($(closeMessage.target).closest("#tropeMessage").length > 0)) {
//     if ($("#tropeMessage").is(":visible")) {
//         $("#tropeMessage").hide();
//     }
//     }
// });

// $(".gen").hover(function () {
//     $("#tropeMessage").show();
//     $("aside").hide();
//     $("#genLink").css("color", colors[4]); // change link color
//     $("#tropeMessage").css("background-color", colors[0]); // turn background of popup text this color
//     $("#generalization").show();
// });

// $(".trib").hover(function () {
//     $("#tropeMessage").show();
//     $("aside").hide();
//     $("#tribLink").css("color", colors[5]); // change link color
//     $("#tropeMessage").css("background-color", colors[1]);
//     $("#tribalism").show();
// });

// $(".nat").hover(function () {
//     $("#tropeMessage").show();
//     $("aside").hide();
//     $("#natLink").css("color", colors[6]); // change link color
//     $("#tropeMessage").css("background-color", colors[2]);
//     $("#nature").show();
// });

// $(".con").hover(function () {
//     $("#tropeMessage").show();
//     $("aside").hide();
//     $("#conLink").css("color", colors[7]);
//     $("#tropeMessage").css("background-color", colors[3]);
//     $("#conflictAndViolence").show();
// });

// $("#voiceButton").css("display", "inline-block");

// location.href = "#scannedResults";

// $("html,body").animate(
//     {
//     scrollTop: $("#clrBlnd").offset().top,
//     },
//     750
// );
// });

// // $("#clrBlndCheckbox").change(function () {
// // if (this.checked) {
// //     $(".about-links").css("color", "#d55e00");
// //     $(".about-links").hover(function () {
// //     $(".about-links").css("color", "#d55e00");
// //     });

// //     // Make inputText border thicker and black
// //     $("#inputText").css("border", "3px solid black")

// //     // Change scan article button color
// //     $("#scanArticle").css("border-color", "#3DB7E9");
// //     $("#scanArticle").hover(
// //     function () {
// //         $(this).css("background-color", "#66ccee");
// //     },
// //     function () {
// //         $(this).css("background-color", "white");
// //     }
// //     );
// //     // Change CBF background color
// //     $("#clrBlnd").css("background-color", "#f0e442");
// //     $("#clrBlnd").css("border", "3px solid #f0e442");
// //     // Change hover colors
// //     $(".gen").hover(function () {
// //     $("#tropeMessage").css("background-color", "#3DB7E9");
// //     $("#generalization").css("color", "white"); // make font color white
// //     $("#genLink").css("color", "black");
// //     });

// //     $(".trib").hover(function () {
// //     $("#tropeMessage").css("background-color", "#f0e442");
// //     $("#tribLink").css("color", "#3DB7E9");
// //     });

// //     $(".nat").hover(function () {
// //     $("#tropeMessage").css("background-color", "#d55e00");
// //     $("#nature").css("color", "white");
// //     $("#natLink").css("color", "black");
// //     });

// //     $(".con").hover(function () {
// //     $("#tropeMessage").css("background-color", "black");
// //     $("#conflictAndViolence").css("color", "white");
// //     $("#conLink").css("color", "#f0e442");
// //     });

// //     // Change highlight color
// //     $(".gen").css("background-color", "#3DB7E9");
// //     $(".trib").css("background-color", "#f0e442");
// //     $(".nat").css("background-color", "#d55e00");
// //     $(".con").css({
// //     "background-color": "black",
// //     color: "white",
// //     });

// //     // Change outputText and toolDescrip areas' background color
// //     $(".rounded-text-box").css("background-color", "#ffffff");

// //     // Show border
// //     $(".rounded-text-box").css("border", "solid black");

// //     // Change headers' color to black
// //     $("h2").css("color", "black");

// //     // Change chart colors
// //     let pieChartColorBlindFriendly = `<script id="chartScript">
// //     var ctx = document.getElementById('myChart').getContext('2d');
// //     var chart = new Chart(ctx, {
// //         // The type of chart we want to create
// //         type: 'doughnut',
    
// //         // The data for our dataset
// //         data: {
// //             labels: ['Generalization', 'Tribalism', 'Nature and Wildlife', 'Conflict and Violence'],
// //             datasets: [{
// //                 label: ' # Words',
// //                 backgroundColor: ['#3DB7E9', '#f0e442', '#d55e00', 'black'],
// //                 borderColor: 'rgb(255, 255, 255)',
// //                 borderWidth: '6',
// //                 data: [${window.genWrdsHLCount}, ${window.tribWrdsHLCount}, ${window.natWrdsHLCount}, ${window.conWrdsHLCount}],
// //             }]
// //         },
    
// //         // Configuration options go here
// //         options: {}
// //     });
// //     </script>`;
// //     $("#chartScript").remove();
// //     $("#myChart").remove(); // IMPORTANT: canvas needs to be removed and added again (next line of code) to avoid pie chart glitch
// //     $("#chartCDNScript").before('<canvas id="myChart"></canvas>');
// //     $("#chartCDNScript").after(pieChartColorBlindFriendly);

// //     // change 'show voice' button color
// //     $("#voiceButton").css("border-color", "#d55e00");
// //     $("#voiceButton").hover(
// //     function () {
// //         $(this).css("background-color", "#d55e00");
// //     },
// //     function () {
// //         $(this).css("background-color", "white");
// //     }
// //     );
// //     // Change table background color to yellow
// //     $("#thead").css("background-color", "#f0e442");
// // } else {
// //     $(".about-links").css("color", "#e96656");
// //     $(".about-links").hover(function () {
// //     $(".about-links").css("color", "#e96656");
// //     }); 

// //     // Change inputText border back
// //     $("#inputText").css("border", "1.5px solid rgba(0, 0, 0, 0.1)")

// //     // Change back scan article button color
// //     $("#scanArticle").css("border-color", "#34D293");
// //     $("#scanArticle").hover(
// //     function () {
// //         $(this).css("background-color", "#34D293");
// //     },
// //     function () {
// //         $(this).css("background-color", "white");
// //     }
// //     );
// //     // Change back CBF background color
// //     $("#clrBlnd").css({
// //     color: "#333333",
// //     "background-color": "#ffca99",
// //     border: "3px solid rgb(255, 173, 105)",
// //     });
// //     // Change hover to original colors
// //     $(".gen").hover(function () {
// //     $("#tropeMessage").css("background-color", "#a8edea");
// //     $("#generalization").css("color", "black");
// //     $("#genLink").css("color", "#ff7451");
// //     });

// //     $(".trib").hover(function () {
// //     $("#tropeMessage").css("background-color", "#eaa8d2");
// //     $("#tribLink").css("color", "rgb(59, 84, 205)");
// //     });

// //     $(".nat").hover(function () {
// //     $("#tropeMessage").css("background-color", "#a7ffa3");
// //     $("#nature").css("color", "black");
// //     $("#natLink").css("color", "#ff7451");
// //     });

// //     $(".con").hover(function () {
// //     $("#tropeMessage").css("background-color", "#ffcc80");
// //     $("#conflictAndViolence").css("color", "black");
// //     $("#conLink").css("color", "rgb(59, 84, 205)");
// //     });
    

// //     // Change highlight to original colors
// //     $(".gen").css("background-color", "#a8edea");
// //     $(".trib").css("background-color", "#eaa8d2");
// //     $(".nat").css("background-color", "#a7ffa3");
// //     $(".con").css({ "background-color": "#ffcc80", color: "black" });

// //     // Change outputText and toolDescrip areas' color back
// //     $(".rounded-text-box").css("background-color", "#f5f5f5");

// //     // Hide border again
// //     $(".rounded-text-box").css("border-style", "hidden");

// //     // Change headers' color back to teal-ish
// //     $("h2").css("color", "#34D293");

// //     // Change chart colors
// //     let pieChartOg = `<script id="chartScript">
// //         var ctx = document.getElementById('myChart').getContext('2d');
// //         var chart = new Chart(ctx, {
// //             // The type of chart we want to create
// //             type: 'doughnut',
        
// //             // The data for our dataset
// //             data: {
// //                 labels: ['Generalization', 'Tribalism', 'Nature and Wildlife', 'Conflict and Violence'],
// //                 datasets: [{
// //                     label: ' # Words',
// //                     backgroundColor: ['rgb(168, 237, 234)', 'rgb(234, 168, 210)', 'rgb(167, 255, 163)', '#ffcc80'],
// //                     borderColor: 'rgb(255, 255, 255)',
// //                     borderWidth: '6',
// //                     data: [${window.genWrdsHLCount}, ${window.tribWrdsHLCount}, ${window.natWrdsHLCount}, ${window.conWrdsHLCount}],
// //                 }]
// //             },
        
// //             // Configuration options go here
// //             options: {}
// //         });
// //         </script>`;
// //     $("#chartScript").remove();
// //     $("#myChart").remove(); // IMPORTANT: canvas needs to be removed and added again (next line of code) to avoid pie chart glitch
// //     $("#chartCDNScript").before('<canvas id="myChart"></canvas>');
// //     $("#chartCDNScript").after(pieChartOg);

// //     // change 'show voice' button color back
// //     $("#voiceButton").css("border-color", "#A29BDA");
// //     $("#voiceButton").hover(
// //     function () {
// //         $(this).css("background-color", "#A29BDA");
// //     },
// //     function () {
// //         $(this).css("background-color", "white");
// //     }
// //     );
// //     // Change table background color back to teal-ish
// //     $("#thead").css("background-color", "rgba(0, 233, 117, 0.58)");

// //     // Change h4 color back to teal-ish
// //     // $("h4").css("color", "#34D293");
// // }

// // });
