import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene setup
let scene, camera, renderer, mixer;

function initScene() {
  console.log('Initializing scene...');
  
  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a2e);

  // Camera setup
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );
  camera.position.set(-0.8, 1.7, 0);
  camera.lookAt(-20, -0.6, -0.6);

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(15, 20, 15);
  scene.add(directionalLight);

  // Load GLB models
  const loader = new GLTFLoader();

  // Load basic classroom
  loader.load(
    './basic_classroom.glb',
    (gltf) => {
      const classroom = gltf.scene;
      classroom.scale.set(1, 1, 1);
      scene.add(classroom);
      console.log('✓ Classroom loaded');
    },
    (progress) => {
      console.log('Classroom loading:', (progress.loaded / progress.total * 100).toFixed(2) + '%');
    },
    (error) => {
      console.error('Error loading classroom:', error);
    }
  );

  // Load lecturer
  loader.load(
    './lecturer.glb',
    (gltf) => {
      const lecturer = gltf.scene;
      
      // Position and rotate lecturer
      lecturer.scale.set(1.1, 1.1, 1.1);
      lecturer.position.set(-2.2, 0, -1.4);
      lecturer.rotation.y = Math.PI / 3;

      scene.add(lecturer);

      // Setup animation mixer
      mixer = new THREE.AnimationMixer(lecturer);
      const animations = gltf.animations;
      
      if (animations.length > 0) {
        // Create clip actions for each animation
        const actions = animations.map(clip => mixer.clipAction(clip));
        
        // Play first animation (idle) by default
        if (actions.length > 0) {
          actions[0].play();
        }

        // Store mixer and actions globally so you can switch animations
        window.lecturerMixer = mixer;
        window.lecturerActions = actions;
        window.lecturerAnimations = animations;

        // Create UI buttons for each animation
        const buttonContainer = document.getElementById('animation-buttons');
        animations.forEach((anim, index) => {
          const btn = document.createElement('button');
          btn.className = 'anim-btn' + (index === 0 ? ' active' : '');
          btn.textContent = anim.name || `Animation ${index + 1}`;
          btn.onclick = () => {
            // Update active button
            document.querySelectorAll('.anim-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Play animation
            actions.forEach(action => action.stop());
            actions[index].play();
            console.log(`Playing: ${anim.name}`);
          };
          buttonContainer.appendChild(btn);
        });

        // Helper function to switch animations
        window.playAnimation = (index) => {
          if (index >= 0 && index < actions.length) {
            actions.forEach(action => action.stop());
            actions[index].play();
            // Update button states
            document.querySelectorAll('.anim-btn').forEach((b, i) => {
              b.classList.toggle('active', i === index);
            });
            console.log(`Playing animation: ${animations[index].name}`);
          }
        };
        
        console.log(`✓ Lecturer loaded with ${animations.length} animations`);
      } else {
        console.log('✓ Lecturer loaded (no animations)');
      }
    },
    (progress) => {
      console.log('Lecturer loading:', (progress.loaded / progress.total * 100).toFixed(2) + '%');
    },
    (error) => {
      console.error('Error loading lecturer:', error);
    }
  );

  // Handle window resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    // Update animation mixer
    if (mixer) {
      mixer.update(clock.getDelta());
    }

    // Render
    renderer.render(scene, camera);
  }

  animate();
}

// Initialize scene immediately
initScene();
