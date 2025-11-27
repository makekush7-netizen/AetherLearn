import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

interface ClassroomProps {
  isPlaying?: boolean;
  onLoaded?: () => void;
  currentSlide?: number;
  slides?: string[];
}

// Helper function to load SVG as texture
const loadSVGTexture = (url: string): Promise<THREE.Texture> => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(response => response.text())
      .then(svgText => {
        // Create a blob URL from SVG text
        const blob = new Blob([svgText], { type: 'image/svg+xml' });
        const blobUrl = URL.createObjectURL(blob);
        
        // Create an image from the blob
        const img = new Image();
        img.onload = () => {
          // Create canvas and draw the SVG
          const canvas = document.createElement('canvas');
          canvas.width = 1920;  // Match SVG viewBox
          canvas.height = 1080;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Create texture from canvas
            const texture = new THREE.CanvasTexture(canvas);
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.needsUpdate = true;
            
            URL.revokeObjectURL(blobUrl);
            resolve(texture);
          } else {
            reject(new Error('Could not get canvas context'));
          }
        };
        img.onerror = () => {
          URL.revokeObjectURL(blobUrl);
          reject(new Error('Failed to load image'));
        };
        img.src = blobUrl;
      })
      .catch(reject);
  });
};

export function Classroom({ isPlaying = false, onLoaded, currentSlide = 0, slides = [] }: ClassroomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const whiteboardRef = useRef<THREE.Mesh | null>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    mixer: THREE.AnimationMixer | null;
    animations: { [key: string]: THREE.AnimationAction };
    clock: THREE.Clock;
    animationId: number | null;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check if already initialized
    if (sceneRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene - Dark navy background (same as original)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    // Camera - LOCKED position matching original script.js
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
    camera.position.set(-0.8, 1.7, 0);
    camera.lookAt(-20, -0.6, -0.6);

    // Renderer - Simpler settings for performance
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: false,
      powerPreference: 'default'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Cap pixel ratio for performance
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // NO OrbitControls - camera is locked like original

    // Lighting - Simple setup matching original
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(15, 20, 15);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Store refs
    const clock = new THREE.Clock();
    const animations: { [key: string]: THREE.AnimationAction } = {};
    let mixer: THREE.AnimationMixer | null = null;
    let animationId: number | null = null;

    sceneRef.current = {
      scene,
      camera,
      renderer,
      mixer: null,
      animations,
      clock,
      animationId: null
    };

    // Load models
    const loader = new GLTFLoader();

    // Load classroom
    loader.load(
      '/models/basic_classroom.glb',
      (gltf) => {
        const classroom = gltf.scene;
        classroom.scale.set(1, 1, 1);
        scene.add(classroom);
        
        // Create whiteboard/presentation screen
        const screenGeometry = new THREE.PlaneGeometry(1.8, 1.1);
        const screenMaterial = new THREE.MeshBasicMaterial({ 
          color: 0xffffff,
          side: THREE.DoubleSide
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        
        // Position the screen on the wall behind/beside the lecturer
        screen.position.set(-3.8, 1.6, -1.4);
        screen.rotation.y = Math.PI / 2;
        scene.add(screen);
        whiteboardRef.current = screen;
        
        console.log('Whiteboard added to scene');
        
        // Load initial slide if available
        if (slides.length > 0) {
          const slideUrl = slides[0];
          if (slideUrl.endsWith('.svg')) {
            // Load SVG using our helper
            loadSVGTexture(slideUrl).then(texture => {
              (screen.material as THREE.MeshBasicMaterial).map = texture;
              (screen.material as THREE.MeshBasicMaterial).needsUpdate = true;
            }).catch(err => console.error('Error loading slide:', err));
          } else {
            // Load regular image
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load(slideUrl, (texture) => {
              texture.colorSpace = THREE.SRGBColorSpace;
              (screen.material as THREE.MeshBasicMaterial).map = texture;
              (screen.material as THREE.MeshBasicMaterial).needsUpdate = true;
            });
          }
        }
      },
      undefined,
      (error) => console.error('Error loading classroom:', error)
    );

    // Load lecturer - positioned in front of whiteboard
    loader.load(
      '/models/lecturer.glb',
      (gltf) => {
        const lecturer = gltf.scene;
        lecturer.scale.set(1.1, 1.1, 1.1);
        // Original working position
        lecturer.position.set(-2.2, 0, -1.4);
        lecturer.rotation.y = Math.PI / 3; // Facing toward students
        scene.add(lecturer);

        console.log('Lecturer loaded and added to scene');

        // Setup animations
        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(lecturer);
          sceneRef.current!.mixer = mixer;

          gltf.animations.forEach((clip) => {
            const action = mixer!.clipAction(clip);
            animations[clip.name] = action;
          });

          // Start with idle animation
          if (animations['Idle']) {
            animations['Idle'].play();
          } else if (Object.keys(animations).length > 0) {
            Object.values(animations)[0].play();
          }
        }

        onLoaded?.();
      },
      undefined,
      (error) => console.error('Error loading lecturer:', error)
    );

    // Animation loop
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);
      renderer.render(scene, camera);
    };
    animate();
    sceneRef.current.animationId = animationId;

    // Handle resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current?.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sceneRef.current = null;
    };
  }, [onLoaded]);

  // Handle slide changes
  useEffect(() => {
    if (!whiteboardRef.current || slides.length === 0) return;
    if (currentSlide < 0 || currentSlide >= slides.length) return;

    const slideUrl = slides[currentSlide];
    const material = whiteboardRef.current.material as THREE.MeshBasicMaterial;

    const updateTexture = (texture: THREE.Texture) => {
      // Dispose old texture
      if (material.map) {
        material.map.dispose();
      }
      material.map = texture;
      material.needsUpdate = true;
    };

    if (slideUrl.endsWith('.svg')) {
      // Load SVG using our helper
      loadSVGTexture(slideUrl).then(updateTexture).catch(err => 
        console.error('Error loading slide:', err)
      );
    } else {
      // Load regular image
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(slideUrl, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        updateTexture(texture);
      });
    }
  }, [currentSlide, slides]);

  // Handle play state changes
  useEffect(() => {
    if (!sceneRef.current?.mixer) return;
    
    const { animations } = sceneRef.current;
    
    if (isPlaying) {
      // Switch to speaking animation
      if (animations['SpeakingIdle']) {
        Object.values(animations).forEach(a => a.fadeOut(0.3));
        animations['SpeakingIdle'].reset().fadeIn(0.3).play();
      }
    } else {
      // Switch back to idle
      if (animations['Idle']) {
        Object.values(animations).forEach(a => a.fadeOut(0.3));
        animations['Idle'].reset().fadeIn(0.3).play();
      }
    }
  }, [isPlaying]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{ minHeight: '300px' }}
    />
  );
}

export default Classroom;
