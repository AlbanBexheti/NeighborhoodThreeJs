// =============================================
// === TREES MODULE - WORKING WITH ROTATED CAMPUS ===
// =============================================
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();
const TREE_MODEL_URL = 'textures/jacaranda_tree_1k/jacaranda_tree_1k.gltf';

// Cache for loaded tree model
let loadedTreeModel = null;

// Load the tree model once and reuse it
function loadTreeModel(callback) {
    if (loadedTreeModel) {
        callback(loadedTreeModel);
        return;
    }
    
    gltfLoader.load(TREE_MODEL_URL, (gltf) => {
        loadedTreeModel = gltf.scene;
        callback(loadedTreeModel);
    }, undefined, (error) => {
        console.error('Error loading tree model:', error);
        callback(null);
    });
}

// Create a Jacaranda tree at specific coordinates - FIXED FOR ROTATED CAMPUS
export function createTree(x, z) {
    const treeGroup = new THREE.Group();
    
    // IMPORTANT: Your campus is rotated with campusGroup.rotation.x = -Math.PI/2
    // So we place trees at (x, z, 0) - z becomes y, and z position is 0 for ground
    treeGroup.position.set(x, z, 0);
    treeGroup.scale.setScalar(1.8); // Slightly larger
    
    loadTreeModel((model) => {
        if (model) {
            const treeInstance = model.clone();
            treeInstance.castShadow = true;
            treeInstance.receiveShadow = true;
            
            // No rotation needed - let campusGroup handle the rotation
            treeInstance.rotation.x = 0;
            treeInstance.rotation.y = 0;
            treeInstance.rotation.z = 0;
            
            // Position the tree model within the group
            // Ground is at z = -0.1 in world space, but we're in group space
            treeInstance.position.y = 0;
            treeInstance.position.z = -0.1; // Ground level
            
            treeGroup.add(treeInstance);
        }
    });
    
    return treeGroup;
}

// Simple tree for testing - FIXED FOR ROTATED CAMPUS
export function createSimpleTree(x, z) {
    const treeGroup = new THREE.Group();
    
    // Place at (x, z, 0) to work with rotated campus
    treeGroup.position.set(x, z, 0);
    treeGroup.scale.setScalar(2.0);
    
    // Brown trunk
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 2), trunkMaterial);
    trunk.position.y = 0;
    trunk.position.z = 1; // Height above ground (z is up in rotated space)
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    treeGroup.add(trunk);
    
    // Green leaves (3 layers)
    const leafMaterial1 = new THREE.MeshStandardMaterial({ color: 0x2E8B57 });
    const leaf1 = new THREE.Mesh(new THREE.ConeGeometry(2, 1.2, 8), leafMaterial1);
    leaf1.position.y = 0;
    leaf1.position.z = 2;
    leaf1.castShadow = true;
    leaf1.receiveShadow = true;
    treeGroup.add(leaf1);
    
    const leafMaterial2 = new THREE.MeshStandardMaterial({ color: 0x3CB371 });
    const leaf2 = new THREE.Mesh(new THREE.ConeGeometry(1.6, 1.2, 8), leafMaterial2);
    leaf2.position.y = 0;
    leaf2.position.z = 2.8;
    leaf2.castShadow = true;
    leaf2.receiveShadow = true;
    treeGroup.add(leaf2);
    
    const leafMaterial3 = new THREE.MeshStandardMaterial({ color: 0x90EE90 });
    const leaf3 = new THREE.Mesh(new THREE.ConeGeometry(1.2, 1.2, 8), leafMaterial3);
    leaf3.position.y = 0;
    leaf3.position.z = 3.6;
    leaf3.castShadow = true;
    leaf3.receiveShadow = true;
    treeGroup.add(leaf3);
    
    return treeGroup;
}

// Add trees around Rectorate
export function addTrees(campusGroup) {
    const rectorateTrees = [
        [160, -190], [165, -195], [170, -185], [175, -200],
        [190, -188], [195, -192], [200, -186], [205, -198]
    ];
    
    rectorateTrees.forEach(([x, z]) => {
        const tree = createTree(x, z);
        campusGroup.add(tree);
    });
    
    console.log('🌳 Jacaranda trees added around Rectorate!');
}

// Add your custom positioned trees
export function addCustomTrees(campusGroup) {
    // === RED TEST TREE TO FIND BUILDING 33 ===
    const testTree = createSimpleTree(85, 45);
    // Make it bright red
    testTree.traverse((child) => {
        if (child.isMesh && child.material) {
            if (Array.isArray(child.material)) {
                child.material.forEach(mat => mat.color.setHex(0xff0000));
            } else {
                child.material.color.setHex(0xff0000);
            }
        }
    });
    campusGroup.add(testTree);
    console.log('🔴 RED TEST TREE at [85, 45] - Look for a bright red tree!');
    
    // === YOUR CUSTOM TREE POSITIONS ===
    const myTreePositions = [
        // Format: [x, z] 
        // X = left/right, Z = forward/back
        [150, -50],
        [155, -55],
        [160, -60],
        [165, -65],
        [170, -70],
        [180, -190], // Rectorate front
        [60, 30],    // Library area
        [30, 80],    // Student Center
    ];
    
    myTreePositions.forEach(([x, z]) => {
        const tree = createTree(x, z);
        campusGroup.add(tree);
    });
    
    console.log(`✨ Added ${myTreePositions.length} custom Jacaranda trees!`);
}

// Call this AFTER you find Building 33 to remove the red test tree
export function removeRedTestTree(campusGroup) {
    // Just find and remove the last added tree (the red one)
    // Or better: just comment out the test tree code above
    console.log('Remove the red test tree by deleting the test tree code in addCustomTrees()');
}