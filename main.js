<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My 3D Hero</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            width: 100vw;
            height: 100vh;
            background: #0a0e27;
            font-family: system-ui, -apple-system, sans-serif;
            color: #fff;
            overflow: hidden;
        }
        canvas {
            display: block;
            width: 100%;
            height: 100%;
        }
        .text {
            position: absolute;
            top: 50%;
            left: 5%;
            transform: translateY(-50%);
            z-index: 10;
            pointer-events: none;
        }
        .text h1 {
            font-size: 4rem;
            margin-bottom: 1rem;
        }
        .text p {
            font-size: 1.2rem;
            opacity: 0.7;
            max-width: 400px;
        }
    </style>
</head>
<body>
    <canvas id="hero-canvas"></canvas>
    <div class="text">
        <h1>Мой 3D сайт</h1>
        <p>Интерактивный объект, реагирующий на курсор.</p>
    </div>

    <!-- Three.js без пробелов и с актуальной версией -->
    <script src="https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.min.js"></script>
    <script>
        // Инициализация
        const canvas = document.getElementById("hero-canvas");
        if (!canvas) {
            console.error("Canvas not found!");
            throw new Error("Missing canvas element");
        }

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0e27);

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Создаём 3D объект
        const geometry = new THREE.IcosahedronGeometry(2, 4);
        const material = new THREE.MeshPhongMaterial({
            color: 0x6c5ce7,
            emissive: 0x6c5ce7,
            shininess: 100
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Освещение
        const light = new THREE.PointLight(0xffffff, 1, 100);
        light.position.set(5, 5, 5);
        scene.add(light);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Переменные для курсора
        let mouseX = 0;
        let mouseY = 0;

        window.addEventListener("mousemove", (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;          // X: от -1 (слева) до +1 (справа)
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;       // Y: от +1 (сверху) до -1 (снизу)
        });

        // Адаптивность
        window.addEventListener("resize", () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Плавная анимация с интерполяцией
        let targetRotationX = 0;
        let targetRotationY = 0;
        const rotationSpeed = 0.05;

        function animate() {
            requestAnimationFrame(animate);

            // Целевые углы поворота на основе позиции мыши
            targetRotationX = mouseY * 1.5;
            targetRotationY = mouseX * 1.5;

            // Плавный переход к цели
            mesh.rotation.x += (targetRotationX - mesh.rotation.x) * rotationSpeed;
            mesh.rotation.y += (targetRotationY - mesh.rotation.y) * rotationSpeed;

            renderer.render(scene, camera);
        }

        animate();
    </script>
</body>
</html>
