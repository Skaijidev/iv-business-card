// базовая сцена
const canvas = document.getElementById("hero-canvas");
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050811, 0.14);

// камера
const camera = new THREE.PerspectiveCamera(
  35,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 0, 8);

// рендерер
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// основной объект (можно заменить на импорт .glb позже)
const group = new THREE.Group();
scene.add(group);

// материал с эмиссией, чтобы выглядел «неонно»
const material = new THREE.MeshStandardMaterial({
  color: 0x6c5ce7,
  emissive: 0x6c5ce7,
  emissiveIntensity: 0.8,
  metalness: 0.4,
  roughness: 0.2
});

// геометрия — что‑то абстрактное
const geoMain = new THREE.IcosahedronGeometry(1.4, 1);
const meshMain = new THREE.Mesh(geoMain, material);
group.add(meshMain);

// маленькие шарики вокруг
const smallMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  emissive: 0xffffff,
  emissiveIntensity: 1,
  metalness: 0.1,
  roughness: 0.4
});

for (let i = 0; i < 60; i++) {
  const s = 0.05 + Math.random() * 0.12;
  const m = new THREE.Mesh(new THREE.SphereGeometry(s, 16, 16), smallMat);
  const r = 2.3 + Math.random() * 2.5;
  const angle = Math.random() * Math.PI * 2;
  const y = (Math.random() - 0.5) * 3;
  m.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
  group.add(m);
}

// свет
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

const dir = new THREE.DirectionalLight(0xffffff, 1.2);
dir.position.set(3, 5, 6);
scene.add(dir);

// позиция курсора (нормализованная)
const mouse = { x: 0, y: 0 };        // от -1 до 1
const targetRot = { x: 0, y: 0 };    // куда хотим повернуть группу
const targetCamOffset = { x: 0, y: 0 };

function onMouseMove(e) {
  const x = (e.clientX / window.innerWidth) * 2 - 1;
  const y = (e.clientY / window.innerHeight) * 2 - 1;
  mouse.x = x;
  mouse.y = y;

  // целевой угол поворота и лёгкий параллакс камеры
  targetRot.y = x * 0.6;     // поворот по вертикальной оси
  targetRot.x = -y * 0.4;    // наклон вверх/вниз

  targetCamOffset.x = x * 0.6;
  targetCamOffset.y = y * 0.4;
}

window.addEventListener("mousemove", onMouseMove);

// адаптация под размер окна
function onResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
window.addEventListener("resize", onResize);

// анимация
let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const t = clock.getElapsedTime();

  // лёгкое авто‑вращение, чтобы не стояло статично
  group.rotation.y += 0.005;
  group.rotation.x += 0.002;

  // плавное приближение к целевым углам от курсора
  group.rotation.y += (targetRot.y - group.rotation.y) * 0.08;
  group.rotation.x += (targetRot.x - group.rotation.x) * 0.08;

  // камера чуть двигается за мышью
  camera.position.x += (targetCamOffset.x - camera.position.x) * 0.06;
  camera.position.y += (targetCamOffset.y - camera.position.y) * 0.06;

  // лёгкая пульсация масштаба
  const scale = 1 + Math.sin(t * 1.3) * 0.04;
  group.scale.set(scale, scale, scale);

  renderer.render(scene, camera);
}

animate();
