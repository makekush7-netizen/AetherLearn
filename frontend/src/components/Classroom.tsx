import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

interface ClassroomProps {
  isPlaying?: boolean;
  onLoaded?: () => void;
  currentSlide?: number;
  slides?: string[];
  audioFiles?: string[]; // Audio files corresponding to each slide
  onSlideComplete?: () => void; // Called when current slide's audio finishes
}

export function Classroom({ 
  isPlaying = false, 
  onLoaded, 
  currentSlide = 0, 
  slides = [],
  audioFiles = [],
  onSlideComplete
}: ClassroomProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isAudioPlayingRef = useRef<boolean>(false);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    mixer: THREE.AnimationMixer | null;
    animations: { [key: string]: THREE.AnimationAction };
    clock: THREE.Clock;
    animationId: number | null;
    whiteboard: THREE.Mesh | null;
  } | null>(null);

  // Main initialization effect
  useEffect(() => {
    if (!containerRef.current) return;
    if (sceneRef.current) return; // Already initialized

    const container = containerRef.current;
    const width = container.clientWidth || 640;
    const height = container.clientHeight || 360;

    console.log('Initializing 3D scene...', { width, height });

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    // Camera - EXACT settings from original script.js
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
    camera.position.set(-0.8, 1.7, 0);
    camera.lookAt(-20, -0.6, -0.6);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: false 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting - EXACT from original
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(15, 20, 15);
    scene.add(directionalLight);

    // Store refs
    const clock = new THREE.Clock();
    sceneRef.current = {
      scene,
      camera,
      renderer,
      mixer: null,
      animations: {},
      clock,
      animationId: null,
      whiteboard: null
    };

    const loader = new GLTFLoader();

    // Load classroom
    loader.load(
      '/models/basic_classroom.glb',
      (gltf) => {
        console.log('✓ Classroom loaded');
        const classroom = gltf.scene;
        classroom.scale.set(1, 1, 1);
        scene.add(classroom);

        // Add whiteboard for slides - 16:9 aspect ratio to match slides
        const screenWidth = 2.4;
        const screenHeight = screenWidth * (9/16); // 16:9 aspect ratio
        const screenGeometry = new THREE.PlaneGeometry(screenWidth, screenHeight);
        
        const screenMaterial = new THREE.MeshBasicMaterial({ 
          color: 0xffffff, // White so texture shows at full brightness
          side: THREE.DoubleSide,
          toneMapped: false // Prevent tone mapping from darkening the texture
        });
        const whiteboard = new THREE.Mesh(screenGeometry, screenMaterial);
        // Camera is at (-0.8, 1.7, 0) looking towards negative X
        // Place whiteboard VERY close to camera - just 1.5 units in front
        whiteboard.position.set(-2.3, 1.7, 0);
        whiteboard.rotation.y = Math.PI / 2; // Face the camera
        scene.add(whiteboard);
        
        if (sceneRef.current) {
          sceneRef.current.whiteboard = whiteboard;
        }
        console.log('✓ Whiteboard added at:', whiteboard.position);
      },
      undefined,
      (error) => console.error('Error loading classroom:', error)
    );

    // Load lecturer
    loader.load(
      '/models/lecturer.glb',
      (gltf) => {
        console.log('✓ Lecturer loaded');
        const lecturer = gltf.scene;
        
        // Position adjusted - moved slightly towards camera to avoid clipping with whiteboard
        lecturer.scale.set(1.1, 1.1, 1.1);
        lecturer.position.set(-2.0, 0, -1.2); // Moved from (-2.2, 0, -1.4)
        lecturer.rotation.y = Math.PI / 3;
        
        scene.add(lecturer);

        // Setup animations
        if (gltf.animations.length > 0 && sceneRef.current) {
          const mixer = new THREE.AnimationMixer(lecturer);
          sceneRef.current.mixer = mixer;

          gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            sceneRef.current!.animations[clip.name] = action;
          });

          // Play idle animation by default
          const idleAction = sceneRef.current.animations['Idle'];
          if (idleAction) {
            idleAction.play();
          } else if (gltf.animations.length > 0) {
            // Play first animation if no Idle
            Object.values(sceneRef.current.animations)[0]?.play();
          }
          
          console.log('✓ Animations setup:', Object.keys(sceneRef.current.animations));
        }

        onLoaded?.();
      },
      undefined,
      (error) => console.error('Error loading lecturer:', error)
    );

    // Animation loop
    const animate = () => {
      if (!sceneRef.current) return;
      
      sceneRef.current.animationId = requestAnimationFrame(animate);
      
      const delta = clock.getDelta();
      if (sceneRef.current.mixer) {
        sceneRef.current.mixer.update(delta);
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!container || !sceneRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth > 0 && newHeight > 0) {
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      console.log('Cleaning up 3D scene');
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current?.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sceneRef.current = null;
      // Stop any playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [onLoaded]);

  // Track if we should autoplay on load
  const shouldAutoplayRef = useRef<boolean>(false);

  // Handle audio playback synced with slides
  useEffect(() => {
    // Create audio element if not exists
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;
    
    // Define the ended handler
    const handleEnded = () => {
      console.log('Audio ended, calling onSlideComplete');
      onSlideComplete?.();
    };
    
    // Handle canplaythrough to autoplay when ready
    const handleCanPlay = () => {
      if (shouldAutoplayRef.current && isPlaying) {
        console.log('Audio ready, autoplaying...');
        audio.play().catch(err => console.log('Autoplay failed:', err.message));
      }
    };
    
    // Add event listeners
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplaythrough', handleCanPlay);
    
    // Load audio for current slide
    if (audioFiles.length > 0 && currentSlide >= 0 && currentSlide < audioFiles.length) {
      const audioUrl = audioFiles[currentSlide];
      console.log('Loading audio for slide', currentSlide, ':', audioUrl);
      
      // Check if source changed
      const fullUrl = new URL(audioUrl, window.location.href).href;
      if (audio.src !== fullUrl) {
        // Mark that we should autoplay when loaded (if currently playing)
        shouldAutoplayRef.current = isPlaying;
        audio.src = audioUrl;
        audio.load();
      }
    }

    return () => {
      // Cleanup listeners on unmount or when deps change
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplaythrough', handleCanPlay);
    };
  }, [currentSlide, audioFiles, onSlideComplete, isPlaying]);

  // Control audio playback based on isPlaying
  useEffect(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    
    // Update animation when audio play state changes
    const updateSpeakingAnimation = (speaking: boolean) => {
      if (!sceneRef.current?.mixer) return;
      const { animations } = sceneRef.current;
      
      console.log('Available animations:', Object.keys(animations));
      
      if (speaking) {
        // Try different possible animation names for speaking/talking
        const speakingAnimName = Object.keys(animations).find(name => 
          name.toLowerCase().includes('talk') || 
          name.toLowerCase().includes('speak') ||
          name.toLowerCase().includes('gesture') ||
          name.toLowerCase().includes('explain')
        );
        
        if (speakingAnimName) {
          console.log('Playing speaking animation:', speakingAnimName);
          Object.values(animations).forEach(a => a.fadeOut(0.3));
          animations[speakingAnimName].reset().fadeIn(0.3).play();
        } else {
          console.log('No speaking animation found, available:', Object.keys(animations));
        }
      } else {
        // Switch back to idle
        const idleAnimName = Object.keys(animations).find(name => 
          name.toLowerCase().includes('idle')
        ) || Object.keys(animations)[0];
        
        if (idleAnimName && animations[idleAnimName]) {
          console.log('Playing idle animation:', idleAnimName);
          Object.values(animations).forEach(a => a.fadeOut(0.3));
          animations[idleAnimName].reset().fadeIn(0.3).play();
        }
      }
    };
    
    // Handle play/pause events
    const handlePlay = () => {
      isAudioPlayingRef.current = true;
      updateSpeakingAnimation(true);
    };
    
    const handlePause = () => {
      isAudioPlayingRef.current = false;
      updateSpeakingAnimation(false);
    };
    
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handlePause);
    
    if (isPlaying) {
      audio.play().catch(err => {
        console.log('Audio play failed:', err.message);
      });
    } else {
      audio.pause();
    }
    
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handlePause);
    };
  }, [isPlaying]);

  // Handle slide changes
  useEffect(() => {
    if (slides.length === 0) return;
    if (currentSlide < 0 || currentSlide >= slides.length) return;

    const loadSlide = async () => {
      // Wait for whiteboard to be ready (it's created async after classroom loads)
      let attempts = 0;
      while (!sceneRef.current?.whiteboard && attempts < 50) {
        await new Promise(r => setTimeout(r, 100));
        attempts++;
      }

      if (!sceneRef.current?.whiteboard) {
        console.log('Whiteboard not ready after waiting');
        return;
      }

      const whiteboard = sceneRef.current.whiteboard;
      const slideUrl = slides[currentSlide];
      
      console.log('Loading slide:', slideUrl);

      try {
        const res = await fetch(slideUrl);
        const svgText = await res.text();
        const encoded = btoa(unescape(encodeURIComponent(svgText)));
        const dataUrl = `data:image/svg+xml;base64,${encoded}`;
        
        const img = new Image();
        img.onload = () => {
          // Higher resolution for better quality (matching SVG viewBox 1920x1080)
          const canvas = document.createElement('canvas');
          canvas.width = 1920;
          canvas.height = 1080;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            // Enable image smoothing for better quality
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            const texture = new THREE.CanvasTexture(canvas);
            texture.colorSpace = THREE.SRGBColorSpace;
            // Enable anisotropic filtering for better quality at angles
            texture.anisotropy = 16;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.generateMipmaps = true;
            
            const material = whiteboard.material as THREE.MeshBasicMaterial;
            if (material.map) material.map.dispose();
            material.map = texture;
            material.needsUpdate = true;
            
            console.log('✓ Slide applied to whiteboard');
          }
        };
        img.onerror = () => console.error('Failed to load slide image');
        img.src = dataUrl;
      } catch (err) {
        console.error('Error loading slide:', err);
      }
    };

    loadSlide();
  }, [currentSlide, slides]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{ minHeight: '300px' }}
    />
  );
}

export default Classroom;
