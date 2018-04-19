const {
  fetch,
  localStorage,
  location
} = window

const marked = require('marked')

class Bookmarker {
  constructor () {
    this._RETRO_KEY = 'retro-bookmarks'
    this._cached = JSON.parse(localStorage.getItem(this._RETRO_KEY)) || {}
  }

  init () {
    Array.from(document.getElementsByTagName('li')).forEach((l, i) => {
      const bm = this._cached[i]
      const $link = l.firstChild

      l.insertAdjacentHTML('beforeend', `
        <details>
          <summary>
            ${bm === 42 ? 'X ' : (bm ? '!!! ' : '')}
            ${$link.outerHTML}
          </summary>
          <p>Notes:
            <input
              id="notes-${i}"
              value="${typeof bm === 'string' ? bm : ''}"
              ${bm === 42 ? 'disabled' : ''}
            >
          </p>
          <p>
            <button id="delete-${i}" type="button">Delete</button>
            <button id="update-${i}" type="button">Update</button>
            <button id="finish-${i}" type="button">Finished</button>
          </p>
        </details>
      `)
      l.removeChild($link)

      const [
        $del,
        $update,
        $finish,
        $notes
      ] = [
        `delete-${i}`,
        `update-${i}`,
        `finish-${i}`,
        `notes-${i}`
      ].map(id => document.getElementById(id))

      $del.addEventListener('click', () => {
        delete this._cached[i]
        this._update()
      })

      $update.addEventListener('click', () => {
        if (!$notes.value) {
          return
        }

        this._cached[i] = $notes.value
        this._update()
      })

      $finish.addEventListener('click', () => {
        this._cached[i] = 42
        this._update()
      })
    })
  }

  _update () {
    localStorage.setItem(this._RETRO_KEY, JSON.stringify(this._cached))
    location.reload(true)
  }
}

;(async () => {
  const [
    $lastModified,
    $main
  ] = [
    'last-modified',
    'main'
  ].map(id => document.getElementById(id))

  const res = await fetch('contents.md')
  const body = await res.text()
  const lastModified = res.headers.get('last-modified')

  $main.insertAdjacentHTML('beforeend', marked(body))
  $lastModified.textContent = (new Date(lastModified)).toLocaleString('en-US')

  const bm = new Bookmarker()
  bm.init()
})()
