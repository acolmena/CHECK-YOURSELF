// const showFrameMessage = (frameId) => {
//     const frameMessage = document.querySelector('#frameMessage');
//     frameMessage.style.display = 'block';
//     document.querySelector('aside').style.display = 'none';
//     frameMessage.style.backgroundColor = 'yellow';
//     document.getElementById(`${frameId}`).style.display = 'block';

// //     $("aside").hide();
// //     $("#genLink").css("color", colors[4]); // change link color
// //     $("#tropeMessage").css("background-color", colors[0]); // turn background of popup text this color
// //     $("#generalization").show();
// }

const string = "dead tuna turaco pain amphibian reptil ya ya ay"

// create eventListener when hovering over highlighted frames 
for (let frame of frames) {
    console.log('hello')
    document.getElementsByClassName(`${frame._id}`).addEventListener("mouseover", function() {
        console.log('hello')
        const frameMessage = document.querySelector('#frameMessage');
        frameMessage.style.display = 'block';
        document.querySelector('aside').style.display = 'none';
        frameMessage.style.backgroundColor = 'yellow';
        document.getElementById(`${frameId}`).style.display = 'block';
    });
}
