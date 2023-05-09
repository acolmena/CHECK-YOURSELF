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
    const accordionPrevOT = `<div class="accordion mb-4" id="accordionPanelsStayOpenExample">
                                <div class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                    <strong>How to use</strong> 
                                    </button>
                                </h2>
                                <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show">
                                    <div class="accordion-body">
                                        <ol>
                                            <li><strong>Enter</strong>  your frames' info in the fields below</li>
                                            <li><strong>Click “Add Frame”</strong> or <strong>press "Enter"</strong> when finished</li>
                                            <li>Make any necessary <strong>edits or deletions</strong> by clicking the corresponding buttons on each frame</li>
                                            <li>When your frames are finalized, <strong>scroll</strong> to the end of the page and <strong>click</strong> "Start Scanning"</li>
                                        </ol>
                                    </div>
                                </div>
                                </div>
                            </div>`
})