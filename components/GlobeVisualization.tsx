import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import {
  Globe as GlobeIcon,
  Compass,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Crosshair,
  X,
  ChevronRight,
  MapPin,
} from "lucide-react";

export interface Waypoint {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  category: string;
  securityLevel: "HIGH PRIORITY" | "MONITORED" | "CRITICAL CHOKEPOINT";
  headline: string;
  dossier: string;
  tags: string[];
}

export const GLOBAL_WAYPOINTS: Waypoint[] = [
  {
    id: "taipei",
    name: "Taiwan Strait / Taipei",
    region: "East Asia Corridor",
    lat: 25.033,
    lng: 121.5654,
    category: "Semiconductor Sovereignty",
    securityLevel: "CRITICAL CHOKEPOINT",
    headline: "The Silicon Shield: Sub-3nm Fabrication & Strait Control",
    dossier:
      "Control over extreme ultraviolet (EUV) photolithography fabrication clusters in Hsinchu and Tainan underwrites global digital sovereignty, computational supremacy, and defense sensor integration.",
    tags: ["#Semiconductors", "#EUVLithography", "#StraitTelemetry"],
  },
  {
    id: "malacca",
    name: "Strait of Malacca / Singapore",
    region: "Southeast Asia",
    lat: 1.3521,
    lng: 103.8198,
    category: "Maritime Chokepoint",
    securityLevel: "CRITICAL CHOKEPOINT",
    headline: "Indo-Pacific Logistics: The 1.5-Nautical-Mile Conduit",
    dossier:
      "Over 60% of seaborne hydrocarbon flows and one-third of all global maritime cargo funnel through this navigational funnel, making it the most critical maritime trade artery on Earth.",
    tags: ["#MaritimeTransit", "#EnergyCorridor", "#NavalTracking"],
  },
  {
    id: "hormuz",
    name: "Strait of Hormuz",
    region: "Persian Gulf",
    lat: 26.5667,
    lng: 56.25,
    category: "Hydrocarbon Transit",
    securityLevel: "CRITICAL CHOKEPOINT",
    headline: "21 Million Barrels / Day: Asymmetric Maritime Surveillance",
    dossier:
      "The planetary energy market's primary jugular, continually monitored by autonomous surface vessels, unmanned loitering munitions, and electronic warfare jamming corridors.",
    tags: ["#CrudeTransit", "#ElectronicWarfare", "#OPEC"],
  },
  {
    id: "suez",
    name: "Bab el-Mandeb & Red Sea",
    region: "Red Sea Corridor",
    lat: 12.5833,
    lng: 43.3333,
    category: "Chokepoint Security",
    securityLevel: "CRITICAL CHOKEPOINT",
    headline: "Southern Red Sea: Asymmetric Maritime Disruption",
    dossier:
      "Anti-ship ballistic and hypersonic trajectory vectors re-routing 14% of global container trade around the Cape of Good Hope, adding $1.2M fuel overhead per trans-oceanic voyage.",
    tags: ["#RedSeaTransit", "#ContainerFreight", "#NavalPatrol"],
  },
  {
    id: "zurich",
    name: "Zurich & Geneva",
    region: "Central Europe",
    lat: 47.3769,
    lng: 8.5417,
    category: "Bilateral Clearance",
    securityLevel: "HIGH PRIORITY",
    headline: "Autonomous Clearing Rails & Sovereign Bullion Settlement",
    dossier:
      "Investigating multi-currency cross-border clearing channels (mBridge) and bilateral non-SWIFT payment architectures bypassing Western financial clearance monopolies.",
    tags: ["#mBridge", "#DeDollarization", "#SovereignReserves"],
  },
  {
    id: "dc",
    name: "Washington, D.C.",
    region: "North America",
    lat: 38.9072,
    lng: -77.0369,
    category: "Export Restrictions",
    securityLevel: "MONITORED",
    headline: "Extraterritorial Jurisdiction & Semiconductor Export Mandates",
    dossier:
      "Analysis of Bureau of Industry and Security (BIS) entity list expansions, secondary sanction triggers, and cloud computing export controls enforced globally.",
    tags: ["#ExportControls", "#BIS", "#SanctionsWire"],
  },
  {
    id: "atacama",
    name: "Atacama Salt Flat",
    region: "South America",
    lat: -23.8634,
    lng: -69.1328,
    category: "Critical Minerals",
    securityLevel: "MONITORED",
    headline: "The Lithium Triangle: High-Altitude Brine Sovereignty",
    dossier:
      "With over 54% of global proven lithium reserves, nationalization decrees and state-backed extraction joint ventures are redrawing energy transition dependencies.",
    tags: ["#LithiumTriangle", "#CriticalMinerals", "#BatterySupply"],
  },
  {
    id: "svalbard",
    name: "Svalbard Archipelago",
    region: "Arctic Ocean",
    lat: 78.2232,
    lng: 15.6469,
    category: "Polar Infrastructure",
    securityLevel: "HIGH PRIORITY",
    headline: "Subsea Arctic Fiber & Global Seed Vault Resilience",
    dossier:
      "Deep Arctic seabed acoustic arrays and trans-polar fiber optic trunk routes intersecting with autonomous ecological genetic preservation infrastructure.",
    tags: ["#ArcticTelemetry", "#SubseaCables", "#ColdStorage"],
  },
  {
    id: "panama",
    name: "Panama Canal",
    region: "Central America",
    lat: 9.08,
    lng: -79.68,
    category: "Freshwater Chokepoint",
    securityLevel: "CRITICAL CHOKEPOINT",
    headline: "Gatun Lake Drought: Fresh-Water Lock Transit Restrictions",
    dossier:
      "Draft limits and daily auction slot rationing restricting trans-isthmus container capacity, forcing bulk carriers into extended Pacific-Atlantic diversions.",
    tags: ["#PanamaCanal", "#DroughtTelemetry", "#MaritimeLogistics"],
  },
  {
    id: "cape",
    name: "Cape of Good Hope",
    region: "Southern Africa",
    lat: -34.35,
    lng: 18.49,
    category: "Strategic Transit Route",
    securityLevel: "MONITORED",
    headline: "Cape Diversion Vector: 4,000 Extra Nautical Miles",
    dossier:
      "Naval logistics monitoring of container traffic diverted around the African continent during Red Sea crisis escalations, re-anchoring South Atlantic bunkering ports.",
    tags: ["#CapeRoute", "#BunkeringTelemetry", "#SuezAlternative"],
  },
];

// Helper: Convert Lat/Lng to Vector3 on sphere of given radius
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// Helper: Calculate the nearest coterminal angle so the globe takes the shortest path
// instead of spinning around the world multiple times when reset or navigating.
function getShortestAngleTargetY(currentY: number, targetY: number): number {
  const TWO_PI = Math.PI * 2;
  let diff = (targetY - currentY) % TWO_PI;
  if (diff > Math.PI) diff -= TWO_PI;
  if (diff < -Math.PI) diff += TWO_PI;
  return currentY + diff;
}

interface GlobeVisualizationProps {
  onSelectWaypoint?: (wp: Waypoint) => void;
  activeWaypointId?: string;
  compact?: boolean;
}

export default function GlobeVisualization({
  onSelectWaypoint,
  activeWaypointId,
  compact = false,
}: GlobeVisualizationProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [internalSelectedWaypoint, setInternalSelectedWaypoint] = useState<Waypoint>(
    GLOBAL_WAYPOINTS[0]
  );
  const [activeCardWaypoint, setActiveCardWaypoint] = useState<Waypoint | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Sync with prop if provided
  const currentWaypoint =
    GLOBAL_WAYPOINTS.find((w) => w.id === activeWaypointId) || internalSelectedWaypoint;

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const waypointMeshesRef = useRef<
    {
      mesh: THREE.Mesh;
      waypoint: Waypoint;
      haloRing: THREE.Mesh;
      innerRing: THREE.Mesh;
      beam: THREE.Line;
    }[]
  >([]);

  // Smooth Orbit & Inertia Controls
  const targetRotationRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const mouseVelocityRef = useRef({ x: 0, y: 0 });
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const targetCameraZRef = useRef(compact ? 12.8 : 13.5);

  // Rotate globe smoothly to focus on a specific waypoint and zoom in
  const focusOnWaypoint = useCallback(
    (wp: Waypoint, showCard = true) => {
      setInternalSelectedWaypoint(wp);
      if (showCard) {
        setActiveCardWaypoint(wp);
      }
      if (onSelectWaypoint) {
        onSelectWaypoint(wp);
      }
      setIsAutoRotating(false);

      if (!globeGroupRef.current) return;

      // Target spherical rotation to bring waypoint directly to front-center
      const rawTargetY = -(wp.lng + 180) * (Math.PI / 180) + Math.PI / 2;
      const targetX = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, ((wp.lat * Math.PI) / 180) * 0.35));

      const currentY = globeGroupRef.current.rotation.y;
      const nearestTargetY = getShortestAngleTargetY(currentY, rawTargetY);

      // Kill any residual drag momentum
      isDraggingRef.current = false;
      mouseVelocityRef.current = { x: 0, y: 0 };

      targetRotationRef.current = {
        x: targetX,
        y: nearestTargetY,
      };

      // Smooth cinematic zoom into real terrain
      targetCameraZRef.current = 9.0;
    },
    [onSelectWaypoint]
  );

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || (compact ? 480 : 560);

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera with cinematic focal length
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.z = targetCameraZRef.current;
    cameraRef.current = camera;

    // 3. Renderer with ACESFilmic Tone Mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 4. Subtle Distant Starfield in Background (matching video)
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1400;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 35 + Math.random() * 45;
      starPositions[i] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = r * Math.cos(phi);
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
      color: 0xfff0d0,
      size: 0.18,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 5. Cinematic Lighting: High-Contrast Sun & Golden Atmospheric Rim
    // Ambient fill
    const ambientLight = new THREE.AmbientLight(0x0a1018, 1.8);
    scene.add(ambientLight);

    // Main Sun Directional Light (Warm, high contrast, casting terrain normal shadows)
    const sunLight = new THREE.DirectionalLight(0xfffaec, 3.4);
    sunLight.position.set(-16, 8, 14);
    scene.add(sunLight);

    // Secondary Warm Gold Specular Glint Light (gives gold/amber crescent on terminator)
    const goldFillLight = new THREE.DirectionalLight(0xd49b5a, 2.0);
    goldFillLight.position.set(14, 4, 10);
    scene.add(goldFillLight);

    // Back-grazing Rim Light (Atmospheric blue/gold crescent on the limb)
    const backRimLight = new THREE.DirectionalLight(0x4080ff, 2.2);
    backRimLight.position.set(4, -14, -12);
    scene.add(backRimLight);

    // 6. Globe Group
    const globeGroup = new THREE.Group();
    globeGroup.position.y = -0.42; // Centered vertically below the top HUD & routes bar
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    // 7. High-Resolution Satellite Earth Terrain & Ocean Specular Materials
    const radius = 4.2;
    const textureLoader = new THREE.TextureLoader();

    const earthTexture = textureLoader.load("/textures/earth_atmos.jpg");
    earthTexture.colorSpace = THREE.SRGBColorSpace;
    const normalTexture = textureLoader.load("/textures/earth_normal.jpg");
    const specularTexture = textureLoader.load("/textures/earth_specular.jpg");
    const cloudsTexture = textureLoader.load("/textures/earth_clouds.png");

    // Earth Sphere with Physical Terrain Relief
    const earthGeometry = new THREE.SphereGeometry(radius, 96, 96);
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      normalMap: normalTexture,
      normalScale: new THREE.Vector2(0.9, 0.9), // Rich, tactile mountain elevations
      specularMap: specularTexture, // Glossy water reflection, matte terrain
      specular: new THREE.Color(0x38485c),
      shininess: 32,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earthMesh);

    // 8. Translucent Realistic Cloud Layer
    const cloudsGeometry = new THREE.SphereGeometry(radius * 1.012, 64, 64);
    const cloudsMaterial = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    cloudsMeshRef.current = cloudsMesh;
    globeGroup.add(cloudsMesh);

    // 9. Luminous Atmospheric Scattering Fresnel Rim Glow
    // Outer atmospheric glow shell
    const atmoGeometry = new THREE.SphereGeometry(radius * 1.035, 64, 64);
    const atmoMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
          vec3 atmoColor = mix(vec3(0.15, 0.45, 0.95), vec3(0.95, 0.75, 0.45), 0.4);
          gl_FragColor = vec4(atmoColor, 1.0) * intensity * 1.6;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const atmoMesh = new THREE.Mesh(atmoGeometry, atmoMaterial);
    globeGroup.add(atmoMesh);

    // 10. Shimmering Gold Waypoint Beacons (Exact Match to Video)
    const waypointMeshes: {
      mesh: THREE.Mesh;
      waypoint: Waypoint;
      haloRing: THREE.Mesh;
      innerRing: THREE.Mesh;
      beam: THREE.Line;
    }[] = [];
    const waypointGroup = new THREE.Group();
    globeGroup.add(waypointGroup);

    GLOBAL_WAYPOINTS.forEach((wp) => {
      const pos = latLngToVector3(wp.lat, wp.lng, radius * 1.018);
      const isCritical = wp.securityLevel === "CRITICAL CHOKEPOINT";

      // A. Center Radiant Glowing Node
      const nodeGeometry = new THREE.SphereGeometry(0.09, 20, 20);
      const nodeMaterial = new THREE.MeshStandardMaterial({
        color: isCritical ? 0xff4d58 : 0xfffae0,
        emissive: isCritical ? 0xcc1a26 : 0xdba844,
        emissiveIntensity: 2.2,
        roughness: 0.1,
        metalness: 0.9,
      });
      const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
      nodeMesh.position.copy(pos);
      nodeMesh.userData = { waypoint: wp };

      // Normal vector pointing outwards from Earth center
      const normal = pos.clone().normalize();

      // B. Sharp Inner Gold Ring
      const innerRingGeom = new THREE.RingGeometry(0.14, 0.18, 36);
      const innerRingMat = new THREE.MeshBasicMaterial({
        color: isCritical ? 0xff3b47 : 0xffe6a3,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide,
      });
      const innerRing = new THREE.Mesh(innerRingGeom, innerRingMat);
      innerRing.position.copy(pos);
      innerRing.lookAt(pos.clone().add(normal));
      nodeMesh.add(innerRing);

      // C. Soft Pulsing Outer Halo Aura Ring (hovering and facing normal)
      const haloRingGeom = new THREE.RingGeometry(0.24, 0.42, 36);
      const haloRingMat = new THREE.MeshBasicMaterial({
        color: isCritical ? 0xff4d58 : 0xdeae78,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
      });
      const haloRing = new THREE.Mesh(haloRingGeom, haloRingMat);
      haloRing.position.copy(pos);
      haloRing.lookAt(pos.clone().add(normal));
      nodeMesh.add(haloRing);

      // D. Vertical Telemetry Light Beam Ray
      const beamEnd = pos.clone().add(normal.clone().multiplyScalar(0.75));
      const beamGeometry = new THREE.BufferGeometry().setFromPoints([pos, beamEnd]);
      const beamMaterial = new THREE.LineBasicMaterial({
        color: isCritical ? 0xff4d58 : 0xffe6a3,
        transparent: true,
        opacity: 0.75,
      });
      const beam = new THREE.Line(beamGeometry, beamMaterial);
      nodeMesh.add(beam);

      waypointGroup.add(nodeMesh);
      waypointMeshes.push({ mesh: nodeMesh, waypoint: wp, haloRing, innerRing, beam });
    });

    waypointMeshesRef.current = waypointMeshes;

    // 11. Refined Orbit & Zoom Controls with Fluid Momentum Inertiia
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      setIsAutoRotating(false);
      targetRotationRef.current = null;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      mouseVelocityRef.current = { x: 0, y: 0 };
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Raycast hover detection over waypoint beacons
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        waypointMeshes.map((w) => w.mesh),
        false
      );

      if (intersects.length > 0) {
        renderer.domElement.style.cursor = "pointer";
      } else {
        renderer.domElement.style.cursor = isDraggingRef.current ? "grabbing" : "grab";
      }

      if (!isDraggingRef.current) return;

      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      mouseVelocityRef.current = {
        x: deltaX * 0.0055,
        y: deltaY * 0.0055,
      };

      globeGroup.rotation.y += mouseVelocityRef.current.x;
      globeGroup.rotation.x += mouseVelocityRef.current.y;
      globeGroup.rotation.x = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, globeGroup.rotation.x));

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        waypointMeshes.map((w) => w.mesh),
        false
      );

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        const wp = clickedMesh.userData.waypoint as Waypoint;
        if (wp) {
          focusOnWaypoint(wp, true);
        }
      }
    };

    // Smooth wheel zoom
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.004;
      targetCameraZRef.current = Math.max(6.8, Math.min(17.5, targetCameraZRef.current + zoomFactor));
    };

    // Touch controls for mobile
    let touchStartX = 0;
    let touchStartY = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        setIsAutoRotating(false);
        targetRotationRef.current = null;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        mouseVelocityRef.current = { x: 0, y: 0 };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - touchStartX;
      const deltaY = e.touches[0].clientY - touchStartY;

      mouseVelocityRef.current = {
        x: deltaX * 0.006,
        y: deltaY * 0.006,
      };

      globeGroup.rotation.y += mouseVelocityRef.current.x;
      globeGroup.rotation.x += mouseVelocityRef.current.y;
      globeGroup.rotation.x = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, globeGroup.rotation.x));

      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    domElement.addEventListener("click", onClick);
    domElement.addEventListener("wheel", onWheel, { passive: false });
    domElement.addEventListener("touchstart", onTouchStart, { passive: true });
    domElement.addEventListener("touchmove", onTouchMove, { passive: true });
    domElement.addEventListener("touchend", onTouchEnd);

    // Initial orientation: Center on the first waypoint (Taipei / East Asia)
    const initWp = currentWaypoint || GLOBAL_WAYPOINTS[0];
    const initialTargetY = -(initWp.lng + 180) * (Math.PI / 180) + Math.PI / 2;
    const initialTargetX = (initWp.lat * Math.PI) / 180;
    globeGroup.rotation.y = initialTargetY;
    globeGroup.rotation.x = initialTargetX * 0.35;

    // 12. Physics Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth Camera Zoom Easing (interpolates smoothly to targetCameraZ)
      camera.position.z += (targetCameraZRef.current - camera.position.z) * 0.08;

      // Smooth Waypoint Navigation Rotation
      if (targetRotationRef.current) {
        globeGroup.rotation.y += (targetRotationRef.current.y - globeGroup.rotation.y) * 0.08;
        globeGroup.rotation.x += (targetRotationRef.current.x - globeGroup.rotation.x) * 0.08;
        globeGroup.rotation.x = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, globeGroup.rotation.x));

        if (
          Math.abs(targetRotationRef.current.y - globeGroup.rotation.y) < 0.0015 &&
          Math.abs(targetRotationRef.current.x - globeGroup.rotation.x) < 0.0015
        ) {
          globeGroup.rotation.y = targetRotationRef.current.y;
          globeGroup.rotation.x = targetRotationRef.current.x;
          targetRotationRef.current = null;
        }
      } else if (!isDraggingRef.current) {
        // Inertia Momentum Decay
        if (Math.abs(mouseVelocityRef.current.x) > 0.0001 || Math.abs(mouseVelocityRef.current.y) > 0.0001) {
          globeGroup.rotation.y += mouseVelocityRef.current.x;
          globeGroup.rotation.x += mouseVelocityRef.current.y;
          globeGroup.rotation.x = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, globeGroup.rotation.x));
          mouseVelocityRef.current.x *= 0.94; // friction
          mouseVelocityRef.current.y *= 0.94;
        } else if (isAutoRotating) {
          // Autonomous slow cinematic planetary orbit
          globeGroup.rotation.y += 0.002;
        }
      }

      // Independent Subtle Cloud Layer Rotation
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += 0.00025;
      }

      // Dynamic Shimmering Gold Markers & Halo Aura Breathing (Exact match to video)
      waypointMeshes.forEach(({ mesh, waypoint, haloRing, innerRing }, i) => {
        const isCurrent = waypoint.id === currentWaypoint?.id;
        const pulse = 1 + Math.sin(elapsed * 3.0 + i * 1.1) * 0.15;
        const scale = isCurrent ? 1.4 : pulse;
        mesh.scale.set(scale, scale, scale);

        // Breathing halo aura ring
        const haloScale = 1 + Math.sin(elapsed * 2.2 + i * 1.5) * 0.22;
        haloRing.scale.set(haloScale, haloScale, haloScale);
        const haloMat = haloRing.material as THREE.MeshBasicMaterial;
        haloMat.opacity = 0.35 + Math.sin(elapsed * 2.2 + i * 1.5) * 0.25;

        // Inner ring rotation
        innerRing.rotation.z += 0.01;
      });

      // Subtle twinkling starfield rotation
      starField.rotation.y += 0.0001;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || (compact ? 480 : 560);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      domElement.removeEventListener("click", onClick);
      domElement.removeEventListener("wheel", onWheel);
      domElement.removeEventListener("touchstart", onTouchStart);
      domElement.removeEventListener("touchmove", onTouchMove);
      domElement.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", handleResize);

      if (renderer) {
        renderer.dispose();
      }
      scene.clear();
    };
  }, [focusOnWaypoint, isAutoRotating, currentWaypoint?.id, compact]);

  // Zoom handlers
  const handleZoom = (direction: "in" | "out") => {
    const delta = direction === "in" ? -1.8 : 1.8;
    targetCameraZRef.current = Math.max(6.8, Math.min(17.5, targetCameraZRef.current + delta));
  };

  const handleResetOrbit = () => {
    setIsResetting(true);
    setTimeout(() => setIsResetting(false), 850);

    // 1. Clear any active popup card & sync internal waypoint
    setActiveCardWaypoint(null);
    setInternalSelectedWaypoint(GLOBAL_WAYPOINTS[0]);
    if (onSelectWaypoint) {
      onSelectWaypoint(GLOBAL_WAYPOINTS[0]);
    }

    // 2. Clear dragging and inertia velocity immediately
    isDraggingRef.current = false;
    mouseVelocityRef.current = { x: 0, y: 0 };

    // 3. Reset camera zoom smoothly to default orbit distance
    targetCameraZRef.current = compact ? 12.8 : 13.5;

    // 4. Smooth shortest-path rotation back to default orientation
    if (globeGroupRef.current) {
      const initWp = GLOBAL_WAYPOINTS[0];
      const rawTargetY = -(initWp.lng + 180) * (Math.PI / 180) + Math.PI / 2;
      const targetX = ((initWp.lat * Math.PI) / 180) * 0.35;

      const currentY = globeGroupRef.current.rotation.y;
      const nearestTargetY = getShortestAngleTargetY(currentY, rawTargetY);

      targetRotationRef.current = {
        x: targetX,
        y: nearestTargetY,
      };
    }

    // 5. Seamlessly resume autonomous rotation
    setIsAutoRotating(true);
  };

  return (
    <div
      className="relative w-full rounded-2xl border border-white/10 bg-[#07090D] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.95)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Telemetry HUD Header */}
      <div className="absolute top-0 left-0 right-0 z-20 px-4 sm:px-5 py-3 bg-[#07090D]/85 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#C92A35] animate-ping" />
          <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-widest text-[#A36E3C] uppercase flex items-center gap-1.5">
            <GlobeIcon className="w-3.5 h-3.5 text-[#C92A35]" />
            HIGH-SPEC 3D TERRAIN ORBIT // WEBGL
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-[9px] sm:text-[10px] font-mono text-[#A1A5AB] uppercase hidden sm:inline">
            {isAutoRotating ? "AUTONOMOUS ROTATION" : "MANUAL ORBIT"}
          </span>
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`px-2 sm:px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider font-bold rounded border transition-colors flex items-center gap-1 cursor-pointer ${
              isAutoRotating
                ? "border-[#A36E3C] bg-[#A36E3C]/20 text-white"
                : "border-white/15 bg-[#040507] text-[#A1A5AB] hover:text-white"
            }`}
            title="Toggle continuous planetary rotation"
          >
            <RotateCw className="w-3 h-3" />
            <span>{isAutoRotating ? "Pause" : "Spin"}</span>
          </button>
        </div>
      </div>

      {/* Three.js Canvas Mount Container */}
      <div
        ref={mountRef}
        className={`w-full relative cursor-grab active:cursor-grabbing select-none ${
          compact ? "h-[450px] sm:h-[500px] lg:h-[540px]" : "h-[480px] sm:h-[540px] lg:h-[600px]"
        }`}
        title="Drag to orbit · Scroll to zoom into terrain · Click beacons to fly in"
      />

      {/* Floating Camera & Reset Control Bar */}
      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-20 flex items-center gap-1.5 bg-[#040507]/90 border border-white/15 p-1 rounded-lg backdrop-blur-md">
        <button
          onClick={() => handleZoom("in")}
          className="p-1.5 hover:bg-white/10 text-white rounded text-[10px] font-mono transition-colors cursor-pointer"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-3.5 h-3.5 text-[#A36E3C]" />
        </button>
        <button
          onClick={() => handleZoom("out")}
          className="p-1.5 hover:bg-white/10 text-white rounded text-[10px] font-mono transition-colors cursor-pointer"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-3.5 h-3.5 text-[#A36E3C]" />
        </button>
        <div className="w-[1px] h-4 bg-white/15 mx-0.5" />
        <button
          onClick={handleResetOrbit}
          disabled={isResetting}
          className={`px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer select-none ${
            isResetting
              ? "bg-[#C92A35]/25 text-white border border-[#C92A35]/50 scale-95"
              : "hover:bg-white/10 text-[#A1A5AB] hover:text-white"
          }`}
          title="Reset planetary camera orientation"
          aria-label="Reset planetary camera orientation"
        >
          <Compass
            className={`w-3.5 h-3.5 text-[#C92A35] transition-transform duration-700 ease-out ${
              isResetting ? "rotate-[360deg] scale-110" : ""
            }`}
          />
          <span className="hidden sm:inline">{isResetting ? "Resetting..." : "Reset"}</span>
          <span className="sm:hidden">{isResetting ? "..." : "Reset"}</span>
        </button>
      </div>

      {/* Telemetry Indicator Overlay */}
      {!isHovered && !activeCardWaypoint && (
        <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-10 pointer-events-none hidden sm:flex items-center gap-2 bg-[#040507]/80 border border-white/10 px-3 py-1 rounded text-[9px] font-mono text-[#A1A5AB]">
          <Crosshair className="w-3 h-3 text-[#A36E3C]" />
          <span>DRAG: ORBIT · SCROLL: ZOOM TO TERRAIN · CLICK: GOLD BEACONS</span>
        </div>
      )}

      {/* Floating Waypoint Dossier Overlay inside 3D Globe Viewport (Dismissible) */}
      {activeCardWaypoint && (
        <div className="absolute bottom-16 sm:bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-30 bg-[#040507]/94 border border-[#A36E3C]/40 p-4 rounded-xl backdrop-blur-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C92A35]" />
              <span className="text-[10px] font-mono font-bold text-[#A36E3C] uppercase tracking-wider">
                {activeCardWaypoint.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider border ${
                  activeCardWaypoint.securityLevel === "CRITICAL CHOKEPOINT"
                    ? "border-[#C92A35]/50 text-[#C92A35] bg-[#C92A35]/10"
                    : "border-[#A36E3C]/50 text-[#A36E3C] bg-[#A36E3C]/10"
                }`}
              >
                {activeCardWaypoint.securityLevel}
              </span>
              <button
                onClick={() => setActiveCardWaypoint(null)}
                className="text-[#A1A5AB] hover:text-white p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
                title="Dismiss overlay"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <h4 className="font-editorial text-base sm:text-lg font-bold text-white mb-1.5 leading-snug">
            {activeCardWaypoint.headline}
          </h4>

          <p className="text-[#A1A5AB] text-xs font-sans leading-relaxed line-clamp-3 mb-3">
            {activeCardWaypoint.dossier}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-[9px] font-mono text-[#A36E3C]">
              {activeCardWaypoint.lat.toFixed(2)}° N, {activeCardWaypoint.lng.toFixed(2)}° E
            </span>
            <a
              href="#articles"
              className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-white hover:text-[#A36E3C] uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>Explore Dossier</span>
              <ChevronRight className="w-3 h-3 text-[#C92A35]" />
            </a>
          </div>
        </div>
      )}

      {/* Waypoint Quick Node Bar (The 10 Strategic Routes) */}
      <div className="absolute top-14 left-4 right-4 z-20 flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none pointer-events-auto">
        <span className="text-[8px] font-mono text-[#A36E3C] uppercase tracking-widest font-bold hidden sm:inline mr-1">
          ROUTES:
        </span>
        {GLOBAL_WAYPOINTS.slice(0, 6).map((wp) => (
          <button
            key={wp.id}
            onClick={() => focusOnWaypoint(wp, true)}
            className={`px-2 py-0.5 text-[8px] sm:text-[9px] font-mono uppercase tracking-wider rounded border transition-all shrink-0 cursor-pointer ${
              currentWaypoint.id === wp.id
                ? "bg-[#C92A35] text-white border-[#C92A35] shadow-[0_0_10px_rgba(201,42,53,0.5)]"
                : "bg-[#040507]/85 text-[#A1A5AB] hover:text-white border-white/15"
            }`}
          >
            {wp.name.split("/")[0].trim()}
          </button>
        ))}
      </div>
    </div>
  );
}
