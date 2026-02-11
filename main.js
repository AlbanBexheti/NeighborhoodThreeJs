import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { createMaterials } from './src/materials.js';
import { BuildingInfoPanel } from './src/buildingInfoPanel.js';

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;   
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
document.body.appendChild(renderer.domElement);

// --- Scene Setup ---
const scene = new THREE.Scene();
renderer.setClearColor(0x87CEEB, 1);
const campusGroup = new THREE.Group();
scene.add(campusGroup);
campusGroup.scale.setScalar(1);
campusGroup.rotation.x = -Math.PI / 2;

// --- Camera Setup ---
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(80.85, 339.77, -197.06);
camera.up.set(0, 1, 0);
camera.lookAt(80.85, 0, -197.06);

// --- Controls ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(80.85, 0, -197.06);
controls.update();

// --- Lighting ---
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x4a7c23, 0.6);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
dirLight.position.set(200, 200, 100);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 500;
dirLight.shadow.camera.bottom = -500;
dirLight.shadow.camera.left = -500;
dirLight.shadow.camera.right = 500;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

const gltfLoader = new GLTFLoader();
scene.background = new THREE.Color(0x87CEEB);

// Raycasting for interaction
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let highlightedBuilding = null;
let buildingMaterialCursor = 0;

// --- Initialize Materials ---
const { walkwayMaterial, roadMaterial, buildingMaterials } = createMaterials();

// --- Ground Plane ---
const ground = new THREE.Mesh(new THREE.PlaneGeometry(3000, 3000), new THREE.MeshStandardMaterial({ color: 0x66bb6a }));
ground.position.z = -0.1;
ground.receiveShadow = true;
campusGroup.add(ground);

// --- Data Loading Logic ---
function projectCoord([lon, lat]) {
    const scale = 100000;
    return [(lon - 20.96) * scale, (lat - 41.985) * scale];
}

function loadWalkways() {
    fetch('data/walkways.geojson')
        .then(res => res.json())
        .then(data => {
            const mainPolygons = data.features.filter(f => f.properties.fill !== '#ff0000');
            const holeFeatures = data.features.filter(f => f.properties.fill === '#ff0000');
            const allHolePaths = holeFeatures.map(holeFeature => {
                const holePath = new THREE.Path();
                holeFeature.geometry.coordinates[0].forEach((coord, i) => {
                    const [x, y] = projectCoord(coord);
                    i === 0 ? holePath.moveTo(x, y) : holePath.lineTo(x, y);
                });
                return holePath;
            });

            mainPolygons.forEach(mainFeature => {
                const shape = new THREE.Shape();
                mainFeature.geometry.coordinates[0].forEach((coord, i) => {
                    const [x, y] = projectCoord(coord);
                    i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y);
                });
                shape.holes = allHolePaths;
                const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: false });
                const mesh = new THREE.Mesh(geometry, walkwayMaterial);
                
                // FIX: Disable castShadow to stop jagged outlines
                mesh.castShadow = false; 
                mesh.receiveShadow = true;
                
                campusGroup.add(mesh);
            });
        });
}

const BOUNDS = {
    minLon: 20.95853286124489,
    maxLon: 20.96584573595831,
    minLat: 41.98350594518007,
    maxLat: 41.994342701395055
};

function isInBounds(coords) {
    return coords.every(coord =>
        coord[0] >= BOUNDS.minLon && coord[0] <= BOUNDS.maxLon &&
        coord[1] >= BOUNDS.minLat && coord[1] <= BOUNDS.maxLat
    );
}

// --- UPDATED Road Logic (CLEAN RIBBONS - NO OUTLINES) ---
function loadGeoJson(url, options) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            data.features.forEach(feature => {
                if (feature.geometry.type === 'LineString') {
                    const coords = feature.geometry.coordinates;
                    if (!coords || !isInBounds(coords)) return;

                    const curvePoints = coords.map(coord => {
                        const [x, y] = projectCoord(coord);
                        return new THREE.Vector3(x, y, 0);
                    });
                    const curve = new THREE.CatmullRomCurve3(curvePoints);
                    
                    const roadWidth = 2.5;
                    const shape = new THREE.Shape();
                    shape.moveTo(0, -roadWidth / 2);
                    shape.lineTo(0, roadWidth / 2);

                    const geometry = new THREE.ExtrudeGeometry(shape, {
                        steps: 100,
                        bevelEnabled: false,
                        extrudePath: curve
                    });

                    const mesh = new THREE.Mesh(geometry, options.material || roadMaterial);
                    
                    // FIX: Disable castShadow to stop jagged outlines
                    mesh.castShadow = false; 
                    mesh.receiveShadow = true; 
                    
                    mesh.position.z = 0.02; 
                    campusGroup.add(mesh);
                } else if (feature.geometry.type === 'Polygon') {
                    const polygons = [feature.geometry.coordinates];
                    polygons.forEach(polygon => {
                        if (!polygon || !polygon[0] || !isInBounds(polygon[0])) return;
                        const shape = new THREE.Shape();
                        polygon[0].forEach((coord, i) => {
                            const [x, y] = projectCoord(coord);
                            i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y);
                        });
                        const geometry = new THREE.ExtrudeGeometry(shape, options.extrudeSettings);
                        const mesh = new THREE.Mesh(geometry, options.material);
                        
                        // FIX: Disable castShadow for flat polygon surfaces like parking lots
                        mesh.castShadow = false;
                        mesh.receiveShadow = true;

                        mesh.position.z = options.y_position || 0;
                        campusGroup.add(mesh);
                    });
                }
            });
        });
}

// --- Building Logic (3x Taller) ---
function loadSplitBuildings() {
    const buildingFiles = [];
    for (let i = 1; i <= 114; i++) {
        buildingFiles.push(`building_${i}.geojson`);
    }

    const buildingsPerBatch = 100;
    let loadedCount = 0;
    
    function loadBatch(startIndex) {
        const endIndex = Math.min(startIndex + buildingsPerBatch, buildingFiles.length);
        const promises = [];
        
        for (let i = startIndex; i < endIndex; i++) {
            const fileName = buildingFiles[i];
            const url = `data/campus/unknown/${fileName}`;
            promises.push(
                fetch(url)
                    .then(res => res.json())
                    .then(data => {
                        data.features.forEach(feature => {
                            const polygons = feature.geometry.type === 'Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
                            polygons.forEach(polygon => {
                                const shape = new THREE.Shape();
                                polygon[0].forEach((coord, index) => {
                                    const [x, y] = projectCoord(coord);
                                    index === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y);
                                });

                                const height = (Number(feature.properties?.estimated_height) || 10) * 3;
                                const extrudeSettings = { depth: height, bevelEnabled: false };

                                const matDesc = buildingMaterials[buildingMaterialCursor % buildingMaterials.length];
                                buildingMaterialCursor++;
                                const material = matDesc.material.clone();

                                const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, extrudeSettings), material);
                                mesh.userData.fileName = fileName.replace(/^building_/, '').replace(/\.geojson$/, '');
                                
                                // BUILDINGS keep castShadow = true
                                mesh.castShadow = true;
                                mesh.receiveShadow = true;
                                campusGroup.add(mesh);
                            });
                        });
                        loadedCount++;
                    }).catch(err => {})
            );
        }
        Promise.all(promises).then(() => {
            if (loadedCount < buildingFiles.length) setTimeout(() => loadBatch(endIndex), 50);
        });
    }
    loadBatch(0);
}

// --- Interaction (Clicking) ---
function handlePointerClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(campusGroup.children, true);
    if (intersects.length > 0) {
        const mesh = intersects[0].object;
        if (mesh.userData.fileName) highlightBuilding(mesh);
    } else {
        highlightBuilding(null);
    }
}

function highlightBuilding(mesh) {
    if (highlightedBuilding && highlightedBuilding.material?.emissive) highlightedBuilding.material.emissive.setHex(0x000000);
    if (mesh?.material?.emissive) {
        mesh.material.emissive.setHex(0x1a304c);
        highlightedBuilding = mesh;
    } else {
        highlightedBuilding = null;
    }
}

renderer.domElement.addEventListener('pointerdown', handlePointerClick);

function animate(currentTime) {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Execution ---
loadWalkways();
loadGeoJson('data/osm_roads.geojson', { material: roadMaterial });
loadSplitBuildings();

const LOCAL_TREE_URL = 'models/jacaranda_tree_1k.gltf/jacaranda_tree_1k.gltf';
gltfLoader.load(LOCAL_TREE_URL, (gltf) => {
    const tree = gltf.scene;
    tree.scale.setScalar(3);
    tree.position.set(180, 80, 0);
    campusGroup.add(tree);
}, undefined, () => console.warn('Tree model not found.'));

animate(0);