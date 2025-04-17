const select = document.getElementById('country'), phoneInput = document.getElementById('phone'), pasteBtn = document.getElementById('paste'), generateBtn = document.getElementById('generate'), result = document.getElementById('result'), linkInput = document.getElementById('link'), copyBtn = document.getElementById('copy'), openAnchor = document.getElementById('open'), themeToggle = document.getElementById('themeToggle'), customSelect = document.getElementById('country-select'), selectedSpan = customSelect.querySelector('.selected'), optionsUl = customSelect.querySelector('.options')

const countries = [{ name: 'Turkey', code: '90' }, { name: 'United States', code: '1' }]

function populateCountries() {
  countries.forEach(c => {
    const o = document.createElement('option')
    o.value = c.code
    o.textContent = `${c.name} (+${c.code})`
    select.appendChild(o)
  })
  select.value = '90'
}

function cleanNumber(v) {
  let d = v.replace(/\D/g, '')
  if (d.startsWith('0')) d = d.replace(/^0+/, '')
  return d
}

async function pasteFromClipboard() {
  try { phoneInput.value = await navigator.clipboard.readText() } catch { }
}

function generateLink() {
  const code = select.value
  let num = cleanNumber(phoneInput.value)
  if (!num) return
  if (!num.startsWith(code)) num = code + num
  const url = `https://wa.me/${num}`
  linkInput.value = url
  openAnchor.href = url
  result.classList.remove('hidden')
}

async function copyLink() { try { await navigator.clipboard.writeText(linkInput.value) } catch { } }

function setTheme(t) {
  if (t === 'light') { document.body.classList.add('light'); themeToggle.textContent = '🌙' }
  else { document.body.classList.remove('light'); themeToggle.textContent = '☀️' }
  localStorage.setItem('theme', t)
}

function buildCustom() {
  optionsUl.innerHTML = ''
  countries.forEach(c => {
    const li = document.createElement('li')
    li.textContent = `${c.name} (+${c.code})`
    li.dataset.code = c.code
    li.tabIndex = 0
    li.addEventListener('click', e => { selectCountry(li); e.stopPropagation() })
    optionsUl.appendChild(li)
  })
  selectCountry(optionsUl.firstChild, false)
}

function selectCountry(li, close = true) {
  selectedSpan.textContent = li.textContent
  select.value = li.dataset.code
  if (close) toggleOptions(false)
}

function toggleOptions(o) { customSelect.classList.toggle('open', o === undefined ? !customSelect.classList.contains('open') : o) }

customSelect.addEventListener('click', () => toggleOptions())
document.addEventListener('click', e => { if (!customSelect.contains(e.target)) toggleOptions(false) })
customSelect.addEventListener('keydown', e => {
  const items = [...optionsUl.children]
  let i = items.findIndex(el => el.dataset.code === select.value)
  if (e.key === 'ArrowDown') { i = (i + 1) % items.length; selectCountry(items[i], false) }
  if (e.key === 'ArrowUp') { i = (i - 1 + items.length) % items.length; selectCountry(items[i], false) }
  if (e.key === 'Enter' || e.key === ' ') { toggleOptions() }
  if (e.key === 'Escape') { toggleOptions(false) }
})

populateCountries()
buildCustom()
pasteBtn.addEventListener('click', pasteFromClipboard)
generateBtn.addEventListener('click', generateLink)
copyBtn.addEventListener('click', copyLink)
themeToggle.addEventListener('click', () => setTheme(document.body.classList.contains('light') ? 'dark' : 'light'))
setTheme(localStorage.getItem('theme') || 'dark')
