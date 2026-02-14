import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { createMaterials } from './src/materials.js';

const keys = { w: false, a: false, s: false, d: false };
window.addEventListener('keydown', (e) => { if(keys.hasOwnProperty(e.key.toLowerCase())) keys[e.key.toLowerCase()] = true; });
window.addEventListener('keyup', (e) => { if(keys.hasOwnProperty(e.key.toLowerCase())) keys[e.key.toLowerCase()] = false; });

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
// === TEXTURE CONFIGURATION - RANDOM DISTRIBUTION ===
// =============================================
const BUILDING_TEXTURES = {
    // Red Brick Texture - 40 random buildings
    '1': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '7': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '15': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '23': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '31': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '42': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '56': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '64': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '71': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '83': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '92': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '5': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '18': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '27': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '35': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '44': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '52': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '63': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '77': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '85': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '94': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '9': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '21': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '33': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '47': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '58': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '69': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '74': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '86': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '95': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '102': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '12': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '25': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '38': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '49': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '61': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '72': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '81': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '93': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '104': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',
    '111': 'textures/red_brick_1k/textures/red_brick_diff_1k.jpg',

    // Stone Brick Texture - 40 random buildings
    '2': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '4': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '16': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '24': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '36': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '48': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '53': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '65': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '76': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '87': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '98': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '8': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '19': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '29': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '41': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '54': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '62': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '73': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '84': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '96': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '105': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '11': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '22': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '34': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '46': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '59': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '68': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '78': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '89': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '99': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '107': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '13': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '26': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '39': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '51': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '66': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '75': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '88': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '97': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '106': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',
    '113': 'textures/stone_brick_wall_001_1k/textures/stone_brick_wall_001_diff_1k.jpg',

    // Patterned Brick Texture - 34 random buildings
    '3': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '6': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '14': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '28': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '37': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '45': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '55': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '67': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '79': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '82': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '91': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '101': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '109': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '10': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '20': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '32': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '43': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '57': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '70': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '80': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '90': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '100': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '108': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '112': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '17': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '30': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '40': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '50': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '60': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '103': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg',
    '114': 'textures/patterned_brick_wall_03_1k/textures/patterned_brick_wall_03_diff_1k.jpg'
};

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

// =============================================
// === GRASS TEXTURE ===
// =============================================
const grassTexture = textureLoader.load('textures/Grass004_2K-JPG/Grass004_2K-JPG_Color.jpg');
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(30, 30);
grassTexture.anisotropy = 16;

const grassMaterial = new THREE.MeshStandardMaterial({
    map: grassTexture,
    roughness: 0.9,
    metalness: 0.1
});
// =============================================

// =============================================
// === ROAD TEXTURE - COMPLETELY FIXED ===
// =============================================
const roadTexture = textureLoader.load('textures/asphalt_track_2k_blend/asphalt_track_diff_2k.jpg');
roadTexture.wrapS = THREE.RepeatWrapping;
roadTexture.wrapT = THREE.RepeatWrapping;
roadTexture.repeat.set(100, 2); // High repeat for visibility
roadTexture.anisotropy = 16; // Makes texture sharp at angles

const texturedRoadMaterial = new THREE.MeshStandardMaterial({
    map: roadTexture,
    roughness: 0.7,
    metalness: 0.3,
    side: THREE.DoubleSide,
    color: 0xcccccc, // Lightens the texture
    emissive: 0x333333,
    emissiveIntensity: 0.2
});
// =============================================

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
// === BUILDING INFO UI ===
// =============================================
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

const originalEmissiveMap = new WeakMap();
// =============================================

// =============================================
// === SIMPLE GAME-STYLE ROAD MATERIALS ===
// =============================================
const simpleRoadMaterial = new THREE.MeshStandardMaterial({
    color: 0x2d2d2d, // Dark gray asphalt
    roughness: 0.85,
    metalness: 0.1,
    side: THREE.DoubleSide
});

const roadLineMaterial = new THREE.MeshBasicMaterial({
    color: 0xffdd00, // Yellow center line
    side: THREE.DoubleSide
});
// =============================================


// --- Ground Plane ---
const ground = new THREE.Mesh(new THREE.PlaneGeometry(3000, 3000), grassMaterial);
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

// =============================================
// === LOAD ROADS - SIMPLE GAME STYLE ===
// =============================================
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
                    
                    // Create road surface
                    const roadWidth = 2.5;
                    const shape = new THREE.Shape();
                    shape.moveTo(0, -roadWidth / 2);
                    shape.lineTo(0, roadWidth / 2);

                    const geometry = new THREE.ExtrudeGeometry(shape, {
                        steps: 200,
                        bevelEnabled: false,
                        extrudePath: curve
                    });

                    const roadMesh = new THREE.Mesh(geometry, simpleRoadMaterial);
                    roadMesh.castShadow = false; 
                    roadMesh.receiveShadow = true; 
                    roadMesh.position.z = 0.02; 
                    campusGroup.add(roadMesh);
                    
                    // Create dashed center line
                    const lineWidth = 0.15;
                    const dashLength = 1.5;  // Length of each dash
                    const gapLength = 1.0;   // Gap between dashes
                    const totalDashUnit = dashLength + gapLength;
                    
                    // Get total curve length
                    const curveLength = curve.getLength();
                    const numDashes = Math.floor(curveLength / totalDashUnit);
                    
                    // Create each dash
                    for (let i = 0; i < numDashes; i++) {
                        const dashStart = (i * totalDashUnit) / curveLength;
                        const dashEnd = (i * totalDashUnit + dashLength) / curveLength;
                        
                        // Make sure we don't go past the end
                        if (dashEnd > 1.0) break;
                        
                        // Get points for this dash segment
                        const dashPoints = [];
                        const dashSteps = 20; // Steps per dash for smoothness
                        for (let j = 0; j <= dashSteps; j++) {
                            const t = dashStart + (dashEnd - dashStart) * (j / dashSteps);
                            dashPoints.push(curve.getPoint(t));
                        }
                        
                        // Create curve for this dash
                        const dashCurve = new THREE.CatmullRomCurve3(dashPoints);
                        
                        const lineShape = new THREE.Shape();
                        lineShape.moveTo(0, -lineWidth / 2);
                        lineShape.lineTo(0, lineWidth / 2);
                        
                        const lineGeometry = new THREE.ExtrudeGeometry(lineShape, {
                            steps: dashSteps,
                            bevelEnabled: false,
                            extrudePath: dashCurve
                        });
                        
                        const lineMesh = new THREE.Mesh(lineGeometry, roadLineMaterial);
                        lineMesh.position.z = 0.03; // Slightly above road
                        campusGroup.add(lineMesh);
                    }
                    
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
// =============================================

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

                                const buildingId = fileName.replace(/^building_/, '').replace(/\.geojson$/, '');
                                
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
// === INTERACTION ===
// =============================================
function handlePointerClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(campusGroup.children, true);
    
    if (intersects.length > 0) {
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

const moveSpeed = 2.0;

function updateMovement() {
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0; // Keep movement on the ground plane
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, camera.up);

    if (keys.w) {
        camera.position.addScaledVector(forward, moveSpeed);
        controls.target.addScaledVector(forward, moveSpeed);
    }
    if (keys.s) {
        camera.position.addScaledVector(forward, -moveSpeed);
        controls.target.addScaledVector(forward, -moveSpeed);
    }
    if (keys.a) {
        camera.position.addScaledVector(right, -moveSpeed);
        controls.target.addScaledVector(right, -moveSpeed);
    }
    if (keys.d) {
        camera.position.addScaledVector(right, moveSpeed);
        controls.target.addScaledVector(right, moveSpeed);
    }
}

// =============================================

function animate(currentTime) {
    requestAnimationFrame(animate);
    updateMovement();
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


//const LOCAL_TREE_URL = 'models/jacaranda_tree_1k.gltf/jacaranda_tree_1k.gltf';
//gltfLoader.load(LOCAL_TREE_URL, (gltf) => {
//    const tree = gltf.scene;
//    tree.scale.setScalar(3);
//    tree.position.set(180, 80, 0);
//    campusGroup.add(tree);
//}, undefined, () => console.warn('Tree model not found.'));

animate(0);