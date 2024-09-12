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
        bookmarksContainer.appendChild(createBookmarkElement(bookmark))
    }
}

function createBookmarkElement({ name, url }) {
    let bookmark = document.createElement('div')
    bookmark.classList.add('bookmark')

    let bookmarkContent = document.createElement('div')
    bookmarkContent.classList.add('bookmark-content')

    let title = document.createElement('div')

    let icon = document.createElement('i')
    icon.classList.add('fa-solid')
    icon.classList.add('fa-globe')

    let link = document.createElement('a')
    link.id = 'url'
    link.textContent = name
    link.href = url
    link.target = '_blank'

    title.appendChild(icon)
    title.appendChild(link)

    let buttons = document.createElement('div')

    let deleteButton = document.createElement('i')
    deleteButton.classList.add('fas')
    deleteButton.classList.add('fa-times')
    deleteButton.addEventListener('click', () => deleteBookmark(name))

    let editButton = document.createElement('button')
    editButton.id = 'edit'
    editButton.textContent = 'Edit'
    editButton.addEventListener('click', () => editBookmark({ name, url }))

    buttons.appendChild(editButton)
    buttons.appendChild(deleteButton)

    buttons.classList.add('bookmark-group')
    title.classList.add('bookmark-group')

    bookmarkContent.appendChild(title)
    bookmarkContent.appendChild(buttons)
    bookmark.appendChild(bookmarkContent)
    return bookmark
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
function deleteBookmark() {
    bookmarkIndex = bookmarks.indexOf(
        bookmarks.filter((bookmark) => bookmark.name === name)[0]
    )
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
