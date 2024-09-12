function htmlElementFromString(htmlString) {
    const element = new DOMParser().parseFromString(htmlString, 'text/html')
    return element.body
}

// Load A Bookmark Element
function LoadBookmarkElement({ name, url }) {
    fetch('/bookmark.html')
        .then((response) => {
            return response.text()
        })
        .then((data) => {
            let bookmark = htmlElementFromString(data)

            bookmark
                .querySelector('#delete')
                .addEventListener('click', deleteBookmark)
            bookmark
                .querySelector('#edit')
                .addEventListener('click', () => editBookmark({ name, url }))
            let link = bookmark.querySelector('#url')
            link.textContent = name
            link.href = url
            link.target = '_blank'

            bookmarksContainer.appendChild(bookmark.firstChild)
        })
        .catch((error) => console.error('Error loading component:', error))
}
