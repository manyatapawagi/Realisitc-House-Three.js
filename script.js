    import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';
    import { RGBELoader } from 'https://unpkg.com/three@0.162.0/examples/jsm/loaders/RGBELoader.js';
    import { EXRLoader } from 'https://unpkg.com/three@0.162.0/examples/jsm/loaders/EXRLoader.js';

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xbdbfbf);
    scene.rotation.y = Math.PI / 2;

    const aspectRatio = window.innerWidth / window.innerHeight;
    const cameraWidth = 150;
    const cameraHeight = cameraWidth / aspectRatio;

    const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(350, 350, 350);
    camera.lookAt(0, 10, 0);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    const AmbientLight = new THREE.AmbientLight(0x404040, 1);
    AmbientLight.position.set(0, 0, 0);
    scene.add(AmbientLight);
    camera.position.z = 5;

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    directionalLight.position.set(-30, 120, 30);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);

    const hdriLoader = new RGBELoader()
    hdriLoader.load('studio_small_09_1k.hdr', function (texture) {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        texture.dispose();
        scene.environment = envMap
    });

    function createHouse() {
        const house = new THREE.Group();

        const loader = new EXRLoader();
        const wallTexture = loader.load('textures/wood3.exr');
        const doorBoundaryTexture = loader.load('textures/brick1.exr');
        const tileTexture = loader.load('textures/tiles1.exr');        
        const doorTexture = loader.load('textures/wood1.exr');

        const geometry1 = new THREE.BoxGeometry(45, 25, 55);
        const material1 = new THREE.MeshStandardMaterial({
            map: wallTexture,
            metalness: 0.7
        });
        const base = new THREE.Mesh(geometry1, material1);
        house.add(base);

        const geometry2 = new THREE.BoxGeometry(47, 4, 59);
        const material2 = new THREE.MeshStandardMaterial({
            map: doorTexture,
            metalness: 0.9
        });
        const roof = new THREE.Mesh(geometry2, material2);
        roof.position.set(0, 12.5, 0);
        house.add(roof);

        const geometry3 = new THREE.BoxGeometry(32, 32, 54);
        const roofTop = new THREE.Mesh(geometry3, material1);
        roofTop.rotation.z = Math.PI/4;
        roofTop.position.set(0, 15, 0);
        house.add(roofTop);

        const geometry4 = new THREE.BoxGeometry(36, 1, 60);
        const material3 = new THREE.MeshStandardMaterial({
            map: tileTexture,
            metalness: 0.9
        });

        const slantRoof1 = new THREE.Mesh(geometry4, material3);
        slantRoof1.rotation.z = -Math.PI/4;
        slantRoof1.position.set(13, 25, 0);
        house.add(slantRoof1);

        const slantRoof2 = new THREE.Mesh(geometry4, material3);
        slantRoof2.rotation.z = Math.PI/4;
        slantRoof2.position.set(-13, 25, 0);
        house.add(slantRoof2);

        const geometry5 = new THREE.BoxGeometry(10, 16, 3);
        const door = new THREE.Mesh(geometry5, material2);
        door.position.set(0, -3, 27);
        house.add(door);

        const geometry6 = new THREE.BoxGeometry(55, 2, 65);
        const material4 = new THREE.MeshStandardMaterial({
            map: doorBoundaryTexture,
            metalness: 0.6
        });
        const doorBase = new THREE.Mesh(geometry6, material4);
        doorBase.position.set(0, -12, 0);
        house.add(doorBase);

        const geometry7 = new THREE.BoxGeometry(5, 23, 5);
        
        const pole1 = new THREE.Mesh(geometry7, material4);
        pole1.position.set(22, -1, 27);
        house.add(pole1);

        const pole2 = new THREE.Mesh(geometry7, material4);
        pole2.position.set(-22, -1, 27);
        house.add(pole2);

        const pole3 = new THREE.Mesh(geometry7, material4);
        pole3.position.set(-22, -1, -27);
        house.add(pole3);

        const pole4 = new THREE.Mesh(geometry7, material4);
        pole4.position.set(22, -1, -27);
        house.add(pole4);

        return house;
    }

    const house = createHouse();
    house.scale.set(2, 2.5, 2);
    house.rotation.y = -Math.PI/4;
    scene.add(house);

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        controls.update();
    }
    animate();
