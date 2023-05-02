function hasTrope(trope) {
    return $("mark").classList.contains(trope);
  }

function addPieChart(
colors,
genWrdsHLCount,
tribWrdsHLCount,
natWrdsHLCount,
conWrdsHLCount
) {
// update the doughnut chart
let pieChartHtml = `<script id="chartScript">
var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'doughnut',

    // The data for our dataset
    data: {
        labels: ['Generalization', 'Tribalism', 'Nature and Wildlife', 'Conflict and Violence'],
        datasets: [{
            label: ' # Words',
            backgroundColor: ['${colors[0]}', '${colors[1]}', '${colors[2]}', '${colors[3]}'],
            borderColor: '#ffffff',
            borderWidth: '6',
            data: [${genWrdsHLCount}, ${tribWrdsHLCount}, ${natWrdsHLCount}, ${conWrdsHLCount}],
        }]
    },

    // Configuration options go here
    options: {}
});
</script>`;
$("#chartCDNScript").after(pieChartHtml);

// Add note about pie chart functionality
let tropeBreakdownNote = `<p id="tropeBreakdownNote">Hover over the chart to see how many words of each trope we found. <br><br/> <span class="small"><b>Note:</b> If you wish to see certain tropes on the chart in isolation from others, click on any of the tropes in the legend to remove them from the chart. To add them back to the chart, click on the trope(s) again.</span></p>`;
// avoid reproducing note if already there
if (!document.querySelector("#tropeBreakdownNote"))
    $("#tropeBreakdownMessage").after(tropeBreakdownNote);
}

// This function will return the total number of words in the inputted text
function getTotHighlightedWords(obj) {
// get all counts, add them up, and return them
console.log("selecting hilit words", document.querySelectorAll("mark"));
let sum = 0;
Object.values(obj).forEach((el) => (sum += el));
console.log(obj);
return sum - obj["wl"]; // subtract wlCount from total sum
}

// This function highlights the words that match the rgx expression below
function hiliter(word, element, tropeClass, obj, isProbWord, isDupe) {
    let rgxp = new RegExp(`\\b${word}\\b`, "gi"); // match word exactly

    element.innerHTML = element.innerHTML.replace(rgxp, function (x) {
    obj[tropeClass] += x.split(" ").length;
    return `<mark class=${tropeClass}>${x}</mark>`;
    });

    return obj;
}

// This function will return the total number of words in the inputted text
function getTotWordCount(element) {
    return element.trim().split(/\s+/).length;
}

$("aside").hide();
$("#resultSummary").hide();
$("#chartScript").hide();

$("#scanArticle").click(function () {
let rawInput = document.getElementById("inputText").value;
let totWords = getTotWordCount(rawInput); // get total number of words that were inputted by user
rawInput = rawInput.replace(/\n\r?/g, "<br>");
$("#outputText").html(rawInput);

// initialize graph object (graphObj)
let graphObj = { wl: 0, gen: 0, con: 0, trib: 0, nat: 0 };


console.time("nat hilit time");
for (let natWord of natureArray) {
    graphObj = hiliter(
    natWord,
    document.getElementById("outputText"),
    "nat",
    graphObj,
    false,
    false
    );
}
console.timeEnd("nat hilit time");

console.time("nat dupes hilit time");
for (let natDupeWord of natDuplicatesArray) {
    graphObj = hiliter(
    natDupeWord,
    document.getElementById("outputText"),
    "nat",
    graphObj,
    false,
    true
    );
}
console.timeEnd("nat dupes hilit time");

console.time("nat prob hilit time");
for (let natProbWord of natProbArray) {
    graphObj = hiliter(
    natProbWord,
    document.getElementById("outputText"),
    "nat",
    graphObj,
    true, // includes problem words
    false // doesn't includes duplicate words
    );
}
console.timeEnd("nat prob hilit time");

console.time("nat probAndDupe hilit time");
for (let natDupeProbWrd of natDupeAndProbArray) {
    graphObj = hiliter(
    natDupeProbWrd,
    document.getElementById("outputText"),
    "nat",
    graphObj,
    true, // includes problem words
    true // includes duplicate words
    );
}
console.timeEnd("nat probAndDupe hilit time");

console.time("wl hilit time");
for (let whitelistWord of whitelistArray) {
    graphObj = hiliter(
    whitelistWord,
    document.getElementById("outputText"),
    "wl",
    graphObj,
    false,
    false
    );
}
console.timeEnd("wl hilit time");

console.time("trib hilit time");
for (let tribWord of tribalismArray) {
    graphObj = hiliter(
    tribWord,
    document.getElementById("outputText"),
    "trib",
    graphObj,
    false,
    false
    );
}
console.timeEnd("trib hilit time");

console.time("con hilit time");
for (let conWord of conflictAndViolenceArray) {
    graphObj = hiliter(
    conWord,
    document.getElementById("outputText"),
    "con",
    graphObj,
    false,
    false
    );
}
console.timeEnd("con hilit time");

console.time("conDupes hilit time");
for (let conDupeWord of conAndVioDupesArray) {
    graphObj = hiliter(
    conDupeWord,
    document.getElementById("outputText"),
    "con",
    graphObj,
    false,
    true
    );
}
console.timeEnd("conDupes hilit time");

console.time("con prob hilit time");
for (let conProbWord of conAndVioProbArray) {
    graphObj = hiliter(
    conProbWord,
    document.getElementById("outputText"),
    "con",
    graphObj,
    true, // includes problem words
    false // doesn't include duplicate words
    );
}
console.timeEnd("con prob hilit time");

console.time("conDupesAndProb hilit time");
for (let conDupesProbWrd of conAndVioDupeAndProbArray) {
    graphObj = hiliter(
    conDupesProbWrd,
    document.getElementById("outputText"),
    "con",
    graphObj,
    true, // includes problem words
    true // includes duplicate words
    );
}
console.timeEnd("conDupesAndProb hilit time");

console.time("gen hilit time");
for (let genWord of generalizationArray) {
    graphObj = hiliter(
    genWord,
    document.getElementById("outputText"),
    "gen",
    graphObj,
    false,
    false
    );
}
console.timeEnd("gen hilit time");

graphObj = hiliter(
    "africa",
    document.getElementById("outputText"),
    "gen",
    graphObj,
    false,
    true
);

console.time("wl unhilit time");
// Making the wl words not be highlighted
let whitelistedWords = document.getElementsByClassName("wl"); // Find the elements
console.log(whitelistedWords);
let rgxpTropeTag = /gen|trib/i;
for (let whitelistWord of whitelistedWords) {
    whitelistWord.innerHTML = whitelistWord.innerHTML.replace(
    rgxpTropeTag,
    "wl"
    ); // Change the class name
}
console.timeEnd("wl unhilit time");

// // add up all highlighted words
// console.time("setting info for pie chart");
// console.log(document.querySelectorAll(".nat").length);
// let totHighlightedWords = getTotHighlightedWords(graphObj);
// console.log(totWords);
// let perTropeWrds = ((totHighlightedWords / totWords) * 100).toFixed(0);
// // declare these as global variables using window obj to be able to use them for color-blind friendly button
// console.log(document.querySelectorAll("mark .con").length);
// let wlSubtract = graphObj["wl"] ? 1 : 0;
// console.log(wlSubtract);
// window.genWrdsHLCount = graphObj["gen"];
// window.conWrdsHLCount = graphObj["con"];
// window.tribWrdsHLCount = graphObj["trib"];
// window.natWrdsHLCount = graphObj["nat"];
// console.timeEnd("setting info for pie chart");

// if CBF colors button is checked, set colors array to be CBF; else, set to original colors
let colors;
if ($("#clrBlndCheckbox").prop("checked")) {
    // order: gen popup background (PB), trib PB, nat PB, con PB, gen link color, trib link color, nat link color, con link color
    colors = [
    "#3DB7E9",
    "#f0e442",
    "#d55e00  ",
    "black  ",
    "#f0e442",
    "#3DB7E9",
    "#f0e442",
    "#f0e442",
    ]; // CBF colors for when you hover over word
    // change general highlighting colors and font color of highlighted words
    $(".gen").css("background-color", "#3DB7E9");
    $(".trib").css("background-color", "#f0e442");
    $(".nat").css("background-color", "#d55e00");
    $(".con").css({ "background-color": "black  ", color: "white" });
} else {
    // color order: gen PB, trib PB, nat PB, con PB, gen link color, trib link color, con link color
    colors = [
    "#a8edea",
    "#eaa8d2",
    "#a7ffa3",
    "#ffcc80",
    "#ff7451",
    "rgb(59, 84, 205)",
    "#ff7451",
    "rgb(59, 84, 205)",
    ];
}

console.log(colors);

// // Remove previous chart if there was one:
// if (document.querySelector("#chartScript")) {
//     // remove previous graph
//     $("#chartScript").remove();
//     $("#myChart").remove(); // IMPORTANT: canvas needs to be removed and added again (next line of code) to avoid pie chart glitch
//     $("#chartCDNScript").before('<canvas id="myChart"></canvas>');
// }
// // Add corresponding heading and text (always)
// const h2BreakdownTag = `<h2 id="tropeBreakdownHeader">Breakdown of words found</h2>`;
// // add ternary statement to avoid reproducing h2 tags
// !document.querySelector("#tropeBreakdownHeader") &&
//     $("#tropeMessage").after(h2BreakdownTag);
// let tropeBreakdownMessage = `<p id="tropeBreakdownMessage">We found <b>${totHighlightedWords}</b> ${
//     totHighlightedWords === 1 ? "word" : "words"
// } (~ ${perTropeWrds}% of this article) associated with tropes about Africa.</p>`;
// $("#tropeBreakdownMessage").remove(); // remove previous text
// $("#tropeBreakdownHeader").after(tropeBreakdownMessage); // update with new text
// // add text describing chart feature with legend
// // Create pie chart if ASTRSC found any trope words
// if (totHighlightedWords) {
//     addPieChart(
//     colors,
//     genWrdsHLCount,
//     tribWrdsHLCount,
//     natWrdsHLCount,
//     conWrdsHLCount
//     );
// } else {
//     $("#tropeBreakdownNote").remove(); // remove previous note
// }

// account for updating values

$("#outputText").css("display", "block");
$("mark").bind("mousemove", function (e) {
    $("#tropeMessage").css({
    top: e.pageY,
    });
});

$("html").click(function (closeMessage) {
    if (!($(closeMessage.target).closest("#tropeMessage").length > 0)) {
    if ($("#tropeMessage").is(":visible")) {
        $("#tropeMessage").hide();
    }
    }
});

$(".gen").hover(function () {
    $("#tropeMessage").show();
    $("aside").hide();
    $("#genLink").css("color", colors[4]); // change link color
    $("#tropeMessage").css("background-color", colors[0]); // turn background of popup text this color
    $("#generalization").show();
});

$(".trib").hover(function () {
    $("#tropeMessage").show();
    $("aside").hide();
    $("#tribLink").css("color", colors[5]); // change link color
    $("#tropeMessage").css("background-color", colors[1]);
    $("#tribalism").show();
});

$(".nat").hover(function () {
    $("#tropeMessage").show();
    $("aside").hide();
    $("#natLink").css("color", colors[6]); // change link color
    $("#tropeMessage").css("background-color", colors[2]);
    $("#nature").show();
});

$(".con").hover(function () {
    $("#tropeMessage").show();
    $("aside").hide();
    $("#conLink").css("color", colors[7]);
    $("#tropeMessage").css("background-color", colors[3]);
    $("#conflictAndViolence").show();
});

$("#voiceButton").css("display", "inline-block");

location.href = "#scannedResults";

$("html,body").animate(
    {
    scrollTop: $("#clrBlnd").offset().top,
    },
    750
);
});

// $("#clrBlndCheckbox").change(function () {
// if (this.checked) {
//     $(".about-links").css("color", "#d55e00");
//     $(".about-links").hover(function () {
//     $(".about-links").css("color", "#d55e00");
//     });

//     // Make inputText border thicker and black
//     $("#inputText").css("border", "3px solid black")

//     // Change scan article button color
//     $("#scanArticle").css("border-color", "#3DB7E9");
//     $("#scanArticle").hover(
//     function () {
//         $(this).css("background-color", "#66ccee");
//     },
//     function () {
//         $(this).css("background-color", "white");
//     }
//     );
//     // Change CBF background color
//     $("#clrBlnd").css("background-color", "#f0e442");
//     $("#clrBlnd").css("border", "3px solid #f0e442");
//     // Change hover colors
//     $(".gen").hover(function () {
//     $("#tropeMessage").css("background-color", "#3DB7E9");
//     $("#generalization").css("color", "white"); // make font color white
//     $("#genLink").css("color", "black");
//     });

//     $(".trib").hover(function () {
//     $("#tropeMessage").css("background-color", "#f0e442");
//     $("#tribLink").css("color", "#3DB7E9");
//     });

//     $(".nat").hover(function () {
//     $("#tropeMessage").css("background-color", "#d55e00");
//     $("#nature").css("color", "white");
//     $("#natLink").css("color", "black");
//     });

//     $(".con").hover(function () {
//     $("#tropeMessage").css("background-color", "black");
//     $("#conflictAndViolence").css("color", "white");
//     $("#conLink").css("color", "#f0e442");
//     });

//     // Change highlight color
//     $(".gen").css("background-color", "#3DB7E9");
//     $(".trib").css("background-color", "#f0e442");
//     $(".nat").css("background-color", "#d55e00");
//     $(".con").css({
//     "background-color": "black",
//     color: "white",
//     });

//     // Change outputText and toolDescrip areas' background color
//     $(".rounded-text-box").css("background-color", "#ffffff");

//     // Show border
//     $(".rounded-text-box").css("border", "solid black");

//     // Change headers' color to black
//     $("h2").css("color", "black");

//     // Change chart colors
//     let pieChartColorBlindFriendly = `<script id="chartScript">
//     var ctx = document.getElementById('myChart').getContext('2d');
//     var chart = new Chart(ctx, {
//         // The type of chart we want to create
//         type: 'doughnut',
    
//         // The data for our dataset
//         data: {
//             labels: ['Generalization', 'Tribalism', 'Nature and Wildlife', 'Conflict and Violence'],
//             datasets: [{
//                 label: ' # Words',
//                 backgroundColor: ['#3DB7E9', '#f0e442', '#d55e00', 'black'],
//                 borderColor: 'rgb(255, 255, 255)',
//                 borderWidth: '6',
//                 data: [${window.genWrdsHLCount}, ${window.tribWrdsHLCount}, ${window.natWrdsHLCount}, ${window.conWrdsHLCount}],
//             }]
//         },
    
//         // Configuration options go here
//         options: {}
//     });
//     </script>`;
//     $("#chartScript").remove();
//     $("#myChart").remove(); // IMPORTANT: canvas needs to be removed and added again (next line of code) to avoid pie chart glitch
//     $("#chartCDNScript").before('<canvas id="myChart"></canvas>');
//     $("#chartCDNScript").after(pieChartColorBlindFriendly);

//     // change 'show voice' button color
//     $("#voiceButton").css("border-color", "#d55e00");
//     $("#voiceButton").hover(
//     function () {
//         $(this).css("background-color", "#d55e00");
//     },
//     function () {
//         $(this).css("background-color", "white");
//     }
//     );
//     // Change table background color to yellow
//     $("#thead").css("background-color", "#f0e442");
// } else {
//     $(".about-links").css("color", "#e96656");
//     $(".about-links").hover(function () {
//     $(".about-links").css("color", "#e96656");
//     }); 

//     // Change inputText border back
//     $("#inputText").css("border", "1.5px solid rgba(0, 0, 0, 0.1)")

//     // Change back scan article button color
//     $("#scanArticle").css("border-color", "#34D293");
//     $("#scanArticle").hover(
//     function () {
//         $(this).css("background-color", "#34D293");
//     },
//     function () {
//         $(this).css("background-color", "white");
//     }
//     );
//     // Change back CBF background color
//     $("#clrBlnd").css({
//     color: "#333333",
//     "background-color": "#ffca99",
//     border: "3px solid rgb(255, 173, 105)",
//     });
//     // Change hover to original colors
//     $(".gen").hover(function () {
//     $("#tropeMessage").css("background-color", "#a8edea");
//     $("#generalization").css("color", "black");
//     $("#genLink").css("color", "#ff7451");
//     });

//     $(".trib").hover(function () {
//     $("#tropeMessage").css("background-color", "#eaa8d2");
//     $("#tribLink").css("color", "rgb(59, 84, 205)");
//     });

//     $(".nat").hover(function () {
//     $("#tropeMessage").css("background-color", "#a7ffa3");
//     $("#nature").css("color", "black");
//     $("#natLink").css("color", "#ff7451");
//     });

//     $(".con").hover(function () {
//     $("#tropeMessage").css("background-color", "#ffcc80");
//     $("#conflictAndViolence").css("color", "black");
//     $("#conLink").css("color", "rgb(59, 84, 205)");
//     });
    

//     // Change highlight to original colors
//     $(".gen").css("background-color", "#a8edea");
//     $(".trib").css("background-color", "#eaa8d2");
//     $(".nat").css("background-color", "#a7ffa3");
//     $(".con").css({ "background-color": "#ffcc80", color: "black" });

//     // Change outputText and toolDescrip areas' color back
//     $(".rounded-text-box").css("background-color", "#f5f5f5");

//     // Hide border again
//     $(".rounded-text-box").css("border-style", "hidden");

//     // Change headers' color back to teal-ish
//     $("h2").css("color", "#34D293");

//     // Change chart colors
//     let pieChartOg = `<script id="chartScript">
//         var ctx = document.getElementById('myChart').getContext('2d');
//         var chart = new Chart(ctx, {
//             // The type of chart we want to create
//             type: 'doughnut',
        
//             // The data for our dataset
//             data: {
//                 labels: ['Generalization', 'Tribalism', 'Nature and Wildlife', 'Conflict and Violence'],
//                 datasets: [{
//                     label: ' # Words',
//                     backgroundColor: ['rgb(168, 237, 234)', 'rgb(234, 168, 210)', 'rgb(167, 255, 163)', '#ffcc80'],
//                     borderColor: 'rgb(255, 255, 255)',
//                     borderWidth: '6',
//                     data: [${window.genWrdsHLCount}, ${window.tribWrdsHLCount}, ${window.natWrdsHLCount}, ${window.conWrdsHLCount}],
//                 }]
//             },
        
//             // Configuration options go here
//             options: {}
//         });
//         </script>`;
//     $("#chartScript").remove();
//     $("#myChart").remove(); // IMPORTANT: canvas needs to be removed and added again (next line of code) to avoid pie chart glitch
//     $("#chartCDNScript").before('<canvas id="myChart"></canvas>');
//     $("#chartCDNScript").after(pieChartOg);

//     // change 'show voice' button color back
//     $("#voiceButton").css("border-color", "#A29BDA");
//     $("#voiceButton").hover(
//     function () {
//         $(this).css("background-color", "#A29BDA");
//     },
//     function () {
//         $(this).css("background-color", "white");
//     }
//     );
//     // Change table background color back to teal-ish
//     $("#thead").css("background-color", "rgba(0, 233, 117, 0.58)");

//     // Change h4 color back to teal-ish
//     // $("h4").css("color", "#34D293");
// }

// });
