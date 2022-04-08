//import { settingsGui } from './settingsGui'
import { buildUI,Table } from './vimReact'
import * as VIM from 'vim-webgl-viewer/'
import Stats from 'stats-js'

// Parse URL
const params = new URLSearchParams(window.location.search)
let url = params.has('vim')
  ? params.get('vim')
  : 'https://vim.azureedge.net/samples/residence.vim'

url = params.has('model')
? params.get('model')
: 'https://vim.azureedge.net/samples/residence.vim'


let transparency = 'all' as VIM.Transparency.Mode
if (params.has('transparency')) {
  const t = params.get('transparency')
  transparency = VIM.Transparency.isValid(t) ? t : 'all'
}

// Create Viewer
const ui = buildUI()

const viewer = new VIM.Viewer({
  canvas: {id : ui.canvas},
  groundPlane: {
    show: true,
    texture:
      'https://vimdevelopment01storage.blob.core.windows.net/textures/vim-floor-soft.png',
    opacity: 1,
    size: 5
  }
})
viewer.camera

// Load Model
viewer.loadVim(
  'https://vimdevelopment01storage.blob.core.windows.net/samples/residence_nozip.vim',
  {
    position: {x:0, y: 0, z:0},
    rotation: {x:270, y: 0, z:0},
    scale: 1,
    transparency: transparency,
  },
  (progress) => 
    ui.setProgress(progress.loaded)
  )

// Make viewer accessible in console
globalThis.viewer = viewer

const previous = viewer.onMouseClick.bind(viewer)
viewer.onMouseClick = (hit) => {
  previous(hit)
  updateTable(hit.object)
}


async function updateTable(object: VIM.Object){
  if(!object){
    ui.setTable(undefined)
    return
  }
  
  const table : Table = []
  const bim = await object.getBimElement()
  for(let pair of bim){
    const value = typeof(pair[1]) === 'number'
      ? round2(pair[1]).toString() 
      : pair[1]
    table.push([pair[0], value])
  }
  ui.setTable(table)
}

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100

/*
// Add a new DAT.gui controller
settingsGui.bind(viewer.settings, (settings) => {
  viewer.settings = settings
  viewer.ApplySettings()
})
*/

// Add Stats display
const stats = new Stats()
stats.dom.style.top = '84px'
stats.dom.style.left = '16px'
document.body.appendChild(stats.dom)
animate()

function animate () {
  requestAnimationFrame(() => animate())

  if (stats) {
    stats.update()
  }
}



