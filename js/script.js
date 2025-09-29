// ------------------------
// Abrir e fechar janelas
// ------------------------
function abrirJanela(id) {
  document.getElementById(id).style.display = "block";
}

function fecharJanela(id) {
  document.getElementById(id).style.display = "none";
}

// ------------------------
// Relógio
// ------------------------
function atualizarRelogio() {
  const clock = document.getElementById('clock');
  const now = new Date();
  clock.textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false});
}
setInterval(atualizarRelogio, 1000);
atualizarRelogio();

// ------------------------
// Menu iniciar
// ------------------------
function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

// ------------------------
// Light mode
// ------------------------
const chk = document.getElementById('chk');

chk.addEventListener('change', () => {
  if(chk.checked) {
    // Modo Claro
    document.body.classList.add('light');
    document.body.classList.remove('dark');
  } else {
    // Modo Escuro
    document.body.classList.add('dark');
    document.body.classList.remove('light');
  }
});

// ------------------------
// Wallpapers iniciais
// ------------------------
const wallpapers = [
  'wallpapers/fundo-classic.png',
  'wallpapers/fundo-alt.png'
];

const submenuWallpaper = document.querySelector('#menu li:nth-child(2) .submenu');

// Função para criar item no submenu
function adicionarWallpaperSubmenu(imgSrc, nome) {
  const li = document.createElement('li');
  li.style.height = '60px';
  li.style.display = 'flex';
  li.style.alignItems = 'center';
  li.style.cursor = 'pointer';
  li.style.marginBottom = '5px';

  const img = document.createElement('img');
  img.src = imgSrc;
  img.style.width = '50px';
  img.style.height = '50px';
  img.style.objectFit = 'cover';
  img.style.borderRadius = '6px';
  img.style.marginRight = '10px';

  const span = document.createElement('span');
  span.textContent = nome;

  li.appendChild(img);
  li.appendChild(span);

  li.addEventListener('click', () => {
    document.body.style.backgroundImage = `url(${imgSrc})`;
    document.body.style.backgroundColor = '';
  });

  submenuWallpaper.appendChild(li);
}

// Adicionar wallpapers iniciais
wallpapers.forEach((wall, index) => {
  adicionarWallpaperSubmenu(wall, `Wallpaper ${index + 1}`);
  if(index === 0) {
    // Definir o primeiro como fundo inicial
    document.body.style.backgroundImage = `url(${wall})`;
  }
});

// ------------------------
// Adicionar wallpapers pelo upload
// ------------------------
const botaoSelecionar = document.getElementById('botao-selecionar');
const inputImagem = document.getElementById('input-imagem');

botaoSelecionar.addEventListener('click', () => {
  inputImagem.click();
});

inputImagem.addEventListener('change', (event) => {
  const arquivo = event.target.files[0];
  if (!arquivo) return;

  const leitor = new FileReader();
  leitor.onload = (e) => {
    const imgSrc = e.target.result;
    wallpapers.push(imgSrc);
    adicionarWallpaperSubmenu(imgSrc, `Wallpaper ${wallpapers.length}`);
  };
  leitor.readAsDataURL(arquivo);
});

// ------------------------
// Informações do sistema
// ------------------------
function detectarGPU() {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return 'Desconhecida';
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  if (debugInfo) {
    return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
  }
  return 'Desconhecida';
}

function atualizarInfoSistema() {
  const cpuNucleos = navigator.hardwareConcurrency;
  document.getElementById('cpu-info').textContent = `CPU: ${cpuNucleos} núcleos`;

  const gpuNome = detectarGPU();
  document.getElementById('gpu-info').textContent = `GPU: ${gpuNome}`;
}

atualizarInfoSistema();

// ------------------------
// Tornar elementos arrastáveis (corrigido)
// ------------------------
function makeDraggable(elementId, handleSelector) {
  const el = document.getElementById(elementId);
  if (!el) return; // não existe o elemento

  const handle = el.querySelector(handleSelector) || el; 
  // fallback: se não encontrar o handle, usa o próprio elemento

  let offsetX = 0, offsetY = 0, isDragging = false;

  handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    el.style.transition = "none";
    document.body.style.userSelect = "none"; // evita selecionar texto
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    el.style.transition = "0.3s all";
    document.body.style.userSelect = "auto"; 
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    // Limitar movimento dentro da viewport
    const maxX = window.innerWidth - el.offsetWidth;
    const maxY = window.innerHeight - el.offsetHeight;
    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));

    el.style.left = x + "px";
    el.style.top = y + "px";
  });
}

// Tornar menu arrastável apenas pela header
makeDraggable("menu", ".header");

// Tornar todas as janelas arrastáveis pela barra de título
const todasJanelas = document.querySelectorAll('.window');
todasJanelas.forEach(win => makeDraggable(win.id, ".title-bar"));
