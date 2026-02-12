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

// =============================================
// === TEXTURE CONFIGURATION - EDIT THIS ===
// =============================================
const BUILDING_TEXTURES = {
    '1': 'textures/Glass_Facade001_2K-JPG/Glass_Facade001_2K_BaseColor.jpg',
    '5': 'textures/plastered_wall_05_2k_blend/plastered_wall_05_diff_2k.jpg',
    '10': 'textures/concrete_pavers_2k_blend/concrete_pavers_diff_2k.jpg',
    '96': 'textures/others_0027_1k_48eRVz/rectorate_txt_1k.jpg',
    '97': 'textures/others_0027_1k_48eRVz/rectorate_txt_1k.jpg',
    // Add more textures here as needed
};

const ROAD_TEXTURE = 'textures/asphalt_track_2k_blend/asphalt_track_diff_2k.jpg'; // Change this to any texture you want
const ROAD_TEXTURE_REPEAT = 20; // How many times the texture repeats along the road

// =============================================
// === BUILDING NAMES - EDIT THIS ===
// =============================================
const BUILDING_NAMES = {
    '1': 'Less Commerce - Security',
    '2': 'Warehouse',
    '3': 'Less Commerce',
    '4': 'Dauti Commerce',
    '5': 'Engineering Building',
    '6': 'Warehouse',
    '7': 'Warehouse',
    '8': '818',
    '9': 'Dormitory',
    '10': 'Locker Room',
    '11': 'Equipments Building',
    '12': 'Public Health',
    '13': 'Research Center',
    '14': 'Biotech Lab',
    '15': '817',
    '16': '816',
    '17': 'Biology Building',
    '18': 'Mathematics Building',
    '19': 'Computer Science',
    '20': 'Data Science Center',
    '21': 'Art & Design',
    '22': '813',
    '23': 'Library',
    '24': 'Dormitory',
    '25': 'Getaway Spot',
    '26': '812',
    '27': '811',
    '28': 'Dormitory',
    '29': '1001',
    '30': 'Anthropology Building',
    '31': '809',
    '32': '810',
    '33': 'Dormitory',
    '34': 'Lecture Hall 2',
    '35': '1002',
    '36': 'Dormitory',
    '37': 'Education Building',
    '38': 'Sports Science',
    '39': 'FCST 305',
    '40': 'Nish Man',
    '41': '814',
    '42': '400',
    '43': '804',
    '44': '803',
    '45': '304',
    '46': 'Student Apartments',
    '47': '815',
    '48': 'Liberta Company',
    '49': 'Lecture Hall 1',
    '50': '805',
    '51': '806',
    '52': '701',
    '53': 'Cafeteria',
    '54': 'Food Court',
    '55': '303',
    '56': 'Tech Park',
    '57': 'Warehouse',
    '58': 'Coffe Shop',
    '59': 'SEEU Biffe',
    '60': 'Student Services',
    '61': '302',
    '62': 'Student Services',
    '63': '301',
    '64': 'Moonlight',
    '65': 'Maro Caffe',
    '66': 'Seeu Security Cabin',
    '67': 'Burek n,sac',
    '68': 'Carwash',
    '69': 'Copyshop',
    '70': 'Tech Companies',
    '71': 'Solar Pannels Parking',
    '72': 'Apartment Complex B',
    '73': 'Graduate Housing',
    '74': 'Ultra Coffe Bar',
    '75': 'Mosha Pijade',
    '76': 'Mosha Pijade',
    '77': 'Mosha Pijade',
    '78': 'Parking Garage 3',
    '79': 'Barn',
    '80': 'Mosha Pijade',
    '81': 'Mosha Pijade',
    '82': 'Mosha Pijade',
    '83': 'Tok 2000',
    '84': 'Sports Center',
    '85': 'Nikola Shtejn',
    '86': 'Facilities Management',
    '87': 'Fast Food',
    '88': 'Barbers Shop',
    '89': 'Dormitory',
    '90': 'Dormitory',
    '91': 'Performing Arts Center',
    '92': 'Museum',
    '93': 'Gallery',
    '94': 'Auditorium',
    '95': 'Concert Hall',
    '96': 'Rectorate',
    '97': 'Rectorate',
    '98': 'Solar Pannels Parking',
    '99': 'Conference Center',
    '100': 'UT - Dorm',
    '101': 'Foundation Building',
    '102': 'Development Office',
    '103': 'Admissions Office',
    '104': 'Registrar Office',
    '105': 'Financial Aid',
    '106': 'UT - Restaurant',
    '107': 'IT Services',
    '108': 'UT - Architecture',
    '109': 'UT - Biffe',
    '110': 'Research Park',
    '111': 'University of Tetova',
    '112': 'UT - Sports Hall',
    '113': 'Technology Transfer',
    '114': 'Kipper Market'
};

const TEXTURE_REPEAT = 2;
const TEXTURE_ROUGHNESS = 0.7;
const TEXTURE_METALNESS = 0.2;
// =============================================

// Texture loader and cache
const textureLoader = new THREE.TextureLoader();
const textureCache = {};

function getTextureForBuilding(buildingId) {
    const texturePath = BUILDING_TEXTURES[buildingId];
    if (!texturePath) return null;
    
    if (!textureCache[texturePath]) {
        textureCache[texturePath] = textureLoader.load(texturePath);
        const tex = textureCache[texturePath];
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(TEXTURE_REPEAT, TEXTURE_REPEAT);
    }
    
    return textureCache[texturePath];
}

// =============================================
// === BUILDING INFO UI - SHOWS CLICKED BUILDING ===
// =============================================
// Create info panel in top-left corner
const infoPanel = document.createElement('div');
infoPanel.style.position = 'absolute';
infoPanel.style.top = '20px';
infoPanel.style.left = '20px';
infoPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
infoPanel.style.color = 'white';
infoPanel.style.padding = '20px 25px';
infoPanel.style.borderRadius = '10px';
infoPanel.style.fontFamily = 'Arial, sans-serif';
infoPanel.style.fontSize = '16px';
infoPanel.style.fontWeight = 'bold';
infoPanel.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.4)';
infoPanel.style.borderLeft = '6px solid #4a90e2';
infoPanel.style.zIndex = '1000';
infoPanel.style.backdropFilter = 'blur(5px)';
infoPanel.style.border = '1px solid rgba(255, 255, 255, 0.2)';
infoPanel.style.minWidth = '280px';
infoPanel.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
        <span style="font-size: 28px;">🏢</span>
        <span style="font-size: 20px; color: #4a90e2; text-shadow: 0 0 10px rgba(74,144,226,0.3);">No Building Selected</span>
    </div>
    <div style="font-size: 14px; color: #ccc; font-weight: normal; margin-top: 5px;">
        Click on any building to see details
    </div>
`;
document.body.appendChild(infoPanel);

// Store the original emissive colors to restore them
const originalEmissiveMap = new WeakMap();
// =============================================

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
                        
                        mesh.castShadow = false;
                        mesh.receiveShadow = true;

                        mesh.position.z = options.y_position || 0;
                        campusGroup.add(mesh);
                    });
                }
            });
        });
}

// --- Building Logic with Textures and Names ---
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

                                // Get building ID from filename
                                const buildingId = fileName.replace(/^building_/, '').replace(/\.geojson$/, '');
                                
                                // Check if this building has a texture assigned
                                const texture = getTextureForBuilding(buildingId);
                                
                                let material;
                                if (texture) {
                                    material = new THREE.MeshStandardMaterial({
                                        map: texture.clone(),
                                        roughness: TEXTURE_ROUGHNESS,
                                        metalness: TEXTURE_METALNESS
                                    });
                                } else {
                                    const matDesc = buildingMaterials[buildingMaterialCursor % buildingMaterials.length];
                                    material = matDesc.material.clone();
                                }
                                
                                buildingMaterialCursor++;

                                const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, extrudeSettings), material);
                                mesh.userData.fileName = buildingId;
                                // THIS IS THE IMPORTANT LINE - IT USES YOUR CUSTOM BUILDING NAMES
                                mesh.userData.buildingName = BUILDING_NAMES[buildingId] || feature.properties?.name || `Building ${buildingId}`;
                                mesh.userData.height = height / 3;
                                mesh.userData.hasTexture = !!texture;
                                
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

// =============================================
// === INTERACTION (Clicking) ===
// =============================================
function handlePointerClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(campusGroup.children, true);
    
    if (intersects.length > 0) {
        // Find the first building mesh (not ground, roads, etc.)
        const buildingMesh = intersects.find(intersect => 
            intersect.object.userData && intersect.object.userData.fileName
        )?.object;
        
        if (buildingMesh) {
            highlightBuilding(buildingMesh);
            updateBuildingInfo(buildingMesh);
        } else {
            highlightBuilding(null);
            updateBuildingInfo(null);
        }
    } else {
        highlightBuilding(null);
        updateBuildingInfo(null);
    }
}

function highlightBuilding(mesh) {
    // Reset previous highlight
    if (highlightedBuilding) {
        if (highlightedBuilding.material) {
            if (Array.isArray(highlightedBuilding.material)) {
                highlightedBuilding.material.forEach(mat => {
                    if (mat.emissive) {
                        mat.emissive.setHex(originalEmissiveMap.get(mat) || 0x000000);
                    }
                });
            } else {
                if (highlightedBuilding.material.emissive) {
                    highlightedBuilding.material.emissive.setHex(originalEmissiveMap.get(highlightedBuilding.material) || 0x000000);
                }
            }
        }
        highlightedBuilding = null;
    }
    
    // Apply new highlight
    if (mesh && mesh.material) {
        if (Array.isArray(mesh.material)) {
            mesh.material.forEach(mat => {
                if (mat.emissive && !originalEmissiveMap.has(mat)) {
                    originalEmissiveMap.set(mat, mat.emissive.getHex());
                }
                if (mat.emissive) {
                    mat.emissive.setHex(0x1a304c);
                }
            });
        } else {
            if (mesh.material.emissive && !originalEmissiveMap.has(mesh.material)) {
                originalEmissiveMap.set(mesh.material, mesh.material.emissive.getHex());
            }
            if (mesh.material.emissive) {
                mesh.material.emissive.setHex(0x1a304c);
            }
        }
        highlightedBuilding = mesh;
    }
}

function updateBuildingInfo(mesh) {
    if (!mesh) {
        infoPanel.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                <span style="font-size: 28px;">🏢</span>
                <span style="font-size: 20px; color: #4a90e2; text-shadow: 0 0 10px rgba(74,144,226,0.3);">No Building Selected</span>
            </div>
            <div style="font-size: 14px; color: #ccc; font-weight: normal; margin-top: 5px;">
                Click on any building to see details
            </div>
        `;
        infoPanel.style.borderLeftColor = '#4a90e2';
        return;
    }
    
    const buildingId = mesh.userData.fileName || 'Unknown';
    const buildingName = mesh.userData.buildingName || `Building ${buildingId}`;
    const height = mesh.userData.height || 'Unknown';
    const hasTexture = mesh.userData.hasTexture ? 'Yes' : 'No';
    
    // Get material color if available
    let colorInfo = 'N/A';
    if (mesh.material) {
        if (Array.isArray(mesh.material) && mesh.material[0]?.color) {
            const color = mesh.material[0].color;
            colorInfo = `rgb(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)})`;
        } else if (mesh.material.color) {
            const color = mesh.material.color;
            colorInfo = `rgb(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)})`;
        }
    }
    
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    
    infoPanel.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
            <span style="font-size: 32px;">🏢</span>
            <span style="font-size: 22px; color: #4a90e2; font-weight: bold; text-shadow: 0 0 10px rgba(74,144,226,0.3);">${buildingName}</span>
        </div>
        <div style="margin-top: 10px;">
            <div style="display: grid; grid-template-columns: 110px 1fr; gap: 12px; font-size: 15px;">
                <span style="color: #aaa;">Building ID:</span>
                <span style="color: white; font-weight: 600; background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 4px;">${buildingId}</span>
                
                <span style="color: #aaa;">Height:</span>
                <span style="color: white; font-weight: 600;">${height}m</span>
                
                <span style="color: #aaa;">Texture:</span>
                <span style="color: white; font-weight: 600; ${hasTexture === 'Yes' ? 'color: #4CAF50;' : ''}">${hasTexture}</span>
                
                <span style="color: #aaa;">Color:</span>
                <span style="color: white; font-weight: 600;">${colorInfo}</span>
                
                <span style="color: #aaa;">Selected:</span>
                <span style="color: white; font-weight: 600;">${timeString}</span>
            </div>
        </div>
    `;
    
    infoPanel.style.borderLeftColor = hasTexture === 'Yes' ? '#4CAF50' : '#4a90e2';
}

renderer.domElement.addEventListener('click', handlePointerClick);
// =============================================

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