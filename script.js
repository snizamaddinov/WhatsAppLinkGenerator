const select=document.getElementById('country')
const phoneInput=document.getElementById('phone')
const pasteBtn=document.getElementById('paste')
const generateBtn=document.getElementById('generate')
const result=document.getElementById('result')
const linkInput=document.getElementById('link')
const copyBtn=document.getElementById('copy')
const openAnchor=document.getElementById('open')
const themeToggle=document.getElementById('themeToggle')

const countries=[{name:'Turkey',code:'90'},{name:'United States',code:'1'}]

function populateCountries(){
  countries.forEach(c=>{
    const opt=document.createElement('option')
    opt.value=c.code
    opt.textContent=`${c.name} (+${c.code})`
    select.appendChild(opt)
  })
  select.value='90'
}

function cleanNumber(raw){
  let digits=raw.replace(/\D/g,'')
  if(digits.startsWith('0'))digits=digits.replace(/^0+/,'')
  return digits
}

async function pasteFromClipboard(){
  try{
    const text=await navigator.clipboard.readText()
    phoneInput.value=text
  }catch(e){}
}

function generateLink(){
  const code=select.value
  let number=cleanNumber(phoneInput.value)
  if(!number)return
  if(!number.startsWith(code))number=code+number
  const url=`https://wa.me/${number}`
  linkInput.value=url
  openAnchor.href=url
  result.classList.remove('hidden')
}

async function copyLink(){
  try{
    await navigator.clipboard.writeText(linkInput.value)
  }catch(e){}
}

function setTheme(theme){
  if(theme==='light'){
    document.body.classList.add('light')
    themeToggle.textContent='🌙'
  }else{
    document.body.classList.remove('light')
    themeToggle.textContent='☀️'
  }
  localStorage.setItem('theme',theme)
}

populateCountries()
pasteBtn.addEventListener('click',pasteFromClipboard)
generateBtn.addEventListener('click',generateLink)
copyBtn.addEventListener('click',copyLink)
themeToggle.addEventListener('click',()=>setTheme(document.body.classList.contains('light')?'dark':'light'))

setTheme(localStorage.getItem('theme')||'dark')
