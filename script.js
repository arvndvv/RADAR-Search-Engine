let reset, searchbtn, searchTerm;
const getMaxChars = () => {
    const width = window.innerWidth || document.body.clientWidth;
    let maxChars;
    if (width < 414) maxChars = 90;
    if (width >= 600 && width < 1400) maxChars = 130;
    if (width >= 1400) maxChars = 180;
    return maxChars;
};
const Search = async(searchTerm) => {
        try {
            this.searchTerm = searchTerm;
            this.maxChars = getMaxChars();
            // console.log(maxChars)
            this.noOfResults = 20;
            this.wiki = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${this.searchTerm}&gsrlimit=${this.noOfResults}&prop=pageimages|extracts&exchars=${this.maxChars}&exintro&explaintext&exlimit=max&format=json&origin=*`
            this.url = encodeURI(this.wiki);
            this.res = await fetch(this.url);
            this.data = await this.res.json()
            this.dataObj = this.data.query.pages;
            // console.log(dataObj)
            this.dataArray = [];
            for (let x in this.dataObj) {
                this.dataArray.push(this.dataObj[x]);
            }
            return this.dataArray;
        } catch (err) {

            return { title: 'could not find any result.', failed: true }
        }

        // console.log(dataArray)
        // dataArray.forEach(element => {
        //     console.log(element.title)
        // });
    }
    // Search('aasd').then(data => {
    //     data.forEach(element => {
    //         console.log(element.thumbnail)
    //     });
    // })

window.addEventListener('load', () => {

    reset = document.getElementById('reset');
    searchbtn = document.getElementById('search');
    searchTerm = document.getElementById('searchTerm');
    // user inputing, reset button appear
    form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        searchbtn.click();
    })
    searchTerm.oninput = () => {
            let resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = ''
            reset.classList.add('showrst')
            document.querySelectorAll('.initial').forEach(el => {
                el.classList.remove('initial');
            })
        }
        // user click reset button, input is cleared
    reset.addEventListener('click', (e) => {

        searchTerm.value = '';

        reset.classList.remove('showrst')

    });
    // user click search button
    searchbtn.addEventListener('click', () => {
        let keywords = searchTerm.value.trim();

        // reset.classList.remove('showrst');
        displayResults(keywords);
    })
})

//create div//

function createDiv(classname) {
    div = document.createElement('div');
    div.className = classname;
    return div;

}

//display results
displayResults = async(keywords) => {
    try {
        let resultsDiv = document.getElementById('results');
        let results = await Search(keywords);
        // console.log(results)
        if (!results.failed) {
            results.forEach(element => {
                // console.log(element)
                // result = createDiv('result');
                result = document.createElement('a');
                result.className = 'result';
                result.setAttribute('href', `https://en.wikipedia.org/?curid=${element.pageid}`);
                // result.dataset.id = element.pageid;
                title = createDiv('title');
                title.textContent = element.title;
                abstract = createDiv('abstract');
                summary = createDiv('summary');
                summary.textContent = element.extract;

                if (element.thumbnail) {
                    imgDiv = createDiv('img');
                    img = document.createElement('img');
                    img.setAttribute('src', element.thumbnail.source);
                    imgDiv.appendChild(img);
                    abstract.appendChild(imgDiv)

                }
                //
                abstract.appendChild(summary)
                result.appendChild(title);
                result.appendChild(abstract);
                resultsDiv.appendChild(result);

            });

        } else {

            error = createDiv('error');
            error.textContent = results.title;

            resultsDiv.appendChild(error);

        }

    } catch (err) {

        console.log('err');
    }


}