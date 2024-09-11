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

bookmarksContainer.appendChild(bookmark)
