// Elements
const nameInput = document.getElementById('website-name')
const urlInput = document.getElementById('website-url')
const modal = document.getElementById('modal')
const bookmarksContainer = document.getElementById('bookmarks-container')
const bookmarkForm = document.getElementById('bookform')
const closeModalButton = document.getElementById('close-modal')
const saveButton = document.getElementById('save-button')
const showModal = document.getElementById('show-modal')
const errorMessage = document.getElementById('error-message')
const overlay = document.getElementById('overlay')

// Event listeners
bookmarkForm.addEventListener('submit', saveBookmark)
closeModalButton.addEventListener('click', () => modal.classList.add('hidden'))
overlay.addEventListener('click', () => modal.classList.add('hidden'))

showModal.addEventListener('click', (e) => {
    bookmarkForm.reset()
    console.log(modal)
    modal.classList.remove('hidden')
})

// Variables
let editing = false
let bookmarkIndex = 0

// Load bookmarks
/**
 *@bookmarks {name: string, url: string}[]
 */

let bookmarks = localStorage.getItem('bookmarks')
bookmarks = bookmarks ? JSON.parse(bookmarks) : []
loadBookMarks()

// Load All Bookmark Elements
function loadBookMarks() {
    bookmarksContainer.innerHTML = ''
    for (const bookmark of bookmarks) {
        LoadBookmarkElement(bookmark)
    }
}

// Load A Bookmark Element
function LoadBookmarkElement({ name, url }) {
    fetch('/bookmark.html')
        .then((response) => {
            return response.text()
        })
        .then((data) => {
            let bookmark = htmlElementFromString(data)

            bookmark.querySelector("#delete").addEventListener('click', () => deleteBookmark(name))
            bookmark.querySelector("#edit").addEventListener('click', () =>
                editBookmark({ name, url })
            )
            let link = bookmark.querySelector("#url");
            link.textContent = name
            link.href = url
            link.target = '_blank'

            bookmarksContainer.appendChild(bookmark.firstChild)
        })
        .catch((error) => console.error('Error loading component:', error))
}

function htmlElementFromString(htmlString) {
    const element = new DOMParser().parseFromString(htmlString, 'text/html')
    return element.body
}

// Set the modal state to the current bookmark
function editBookmark({ name, url }) {
    bookmarkIndex = bookmarks.indexOf(
        bookmarks.filter((bookmark) => bookmark.name === name)[0]
    )
    editing = true

    nameInput.value = name
    urlInput.value = url

    modal.classList.remove('hidden')
}

// Remove a bookmark from the bookmark list
function deleteBookmark(name) {
    if (confirm('Are you sure you want to delete this bookmark?')) {
        bookmarks.splice(bookmarkIndex, 1)
        updateBooks()
    }
}

function validate(url) {
    const exp =
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
    const regex = new RegExp(exp)
    return regex.test(url)
}

// Save a Bookmark
function saveBookmark(e) {
    e.preventDefault()
    e.stopImmediatePropagation()

    const data = new FormData(e.target)
    const newBookmark = {}
    for (const [name, value] of data) {
        if (!value) {
            errorMessage.textContent = 'Both fields must be filled!'
            return
        }
        newBookmark[name] = value
    }

    if (!validate(newBookmark.url)) {
        errorMessage.textContent = 'URL must be valid!'
        return
    }

    addBook(newBookmark)
    modal.classList.add('hidden')
    e.target.reset()
}

function addBook(newBookmark) {
    if (editing) {
        bookmarks[bookmarkIndex] = newBookmark
        editing = false
    } else {
        bookmarks.push(newBookmark)
    }
    updateBooks()
}

function updateBooks() {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    loadBookMarks()
}
