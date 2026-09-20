'use client';

/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

extend({ MeshLineGeometry, MeshLineMaterial });

// Preload assets via public URL strings as specified in instructions
useGLTF.preload('/lanyard/card.glb');

const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// Woven fabric strap texture generator with signature brand blue ribbon and monospace "// PROFESSIONAL • ARVIN.DEV" printed text
const DEFAULT_WOVEN_STRAP_PATTERN = (() => {
  if (typeof document === 'undefined') return BLANK_PIXEL;
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return BLANK_PIXEL;

  // Rich Brand Blue / Navy Woven Fabric Base (#1F4075 / #16335F) matching primary buttons
  const grad = ctx.createLinearGradient(0, 0, 0, 64);
  grad.addColorStop(0, '#255496');
  grad.addColorStop(0.5, '#1F4075');
  grad.addColorStop(1, '#132C54');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 64);

  // Subtle Woven Fabric Ribbing (Horizontal Fine Lines)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 1;
  for (let y = 0; y < 64; y += 3) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Subtle Cross Weave Texture
  ctx.strokeStyle = 'rgba(11, 16, 60, 0.45)';
  ctx.lineWidth = 1;
  for (let x = 0; x < 1024; x += 5) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 64);
    ctx.stroke();
  }

  // Soft Golden Yellow Edge Pinstripes matching button & header accents
  ctx.fillStyle = 'rgba(245, 185, 66, 0.7)';
  ctx.fillRect(0, 1, 1024, 2);
  ctx.fillRect(0, 61, 1024, 2);

  // Monospace Printed Text Repeating along Strap: "// PROFESSIONAL   •   ARVIN.DEV"
  ctx.font = 'bold 22px monospace';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const textString = '// PROFESSIONAL   •   ARVIN.DEV   •   ';
  const patternWidth = 450; // Distance between repeats

  for (let x = 225; x < 1024 + patternWidth; x += patternWidth) {
    ctx.fillText(textString, x, 33);
  }

  return canvas.toDataURL();
})();

const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardColor?: string;
  lanyardWidth?: number;
  lanyardImage?: string | null;
  quality?: 'full' | 'balanced';
  onReady?: () => void;
}

function BalancedFrameDriver({ active }: { active: boolean }) {
  const advance = useThree((state) => state.advance);
  const syntheticTimeRef = useRef(0);

  useEffect(() => {
    if (!active) return;

    let frameId = 0;
    let lastFrameTime = 0;
    const frameInterval = 1000 / 30;
    const renderFrame = (time: number) => {
      const elapsed = time - lastFrameTime;
      if (elapsed >= frameInterval) {
        lastFrameTime = time - (elapsed % frameInterval);
        syntheticTimeRef.current += frameInterval / 1000;
        advance(syntheticTimeRef.current, true);
      }
      frameId = requestAnimationFrame(renderFrame);
    };

    frameId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(frameId);
  }, [active, advance]);

  return null;
}

export default function Lanyard({
  position = [0, 0, 20],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardColor = '#ffffff',
  lanyardWidth = 0.75,
  lanyardImage = null,
  quality = 'full',
  onReady,
}: LanyardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inViewportRef = useRef(true);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const syncActiveState = () => {
      setIsActive(inViewportRef.current && !document.hidden);
    };

    const observer = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(
          ([entry]) => {
            inViewportRef.current = entry.isIntersecting;
            syncActiveState();
          },
          { rootMargin: '160px 0px', threshold: 0.01 }
        )
      : null;

    observer?.observe(container);
    document.addEventListener('visibilitychange', syncActiveState);

    return () => {
      observer?.disconnect();
      document.removeEventListener('visibilitychange', syncActiveState);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative z-0 w-full h-full min-h-[400px] flex justify-center items-center select-none"
      style={{ touchAction: quality === 'balanced' ? 'pan-y' : 'none' }}
    >
      <Canvas
        camera={{ position, fov }}
        fallback={null}
        dpr={quality === 'balanced' ? 1 : [1, 2]}
        frameloop={quality === 'balanced' ? 'never' : (isActive ? 'always' : 'never')}
        gl={{
          alpha: transparent,
          antialias: quality === 'full',
          powerPreference: 'high-performance',
        }}
        performance={{ min: quality === 'balanced' ? 0.65 : 0.5, debounce: 250 }}
        style={{ touchAction: quality === 'balanced' ? 'pan-y' : 'none' }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        {quality === 'balanced' && <BalancedFrameDriver active={isActive} />}
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={quality === 'balanced' ? 1 / 30 : 1 / 60}>
          <Band
            frontImage={frontImage}
            backImage={backImage}
            imageFit={imageFit}
            lanyardColor={lanyardColor}
            lanyardWidth={lanyardWidth}
            lanyardImage={lanyardImage}
            quality={quality}
            onReady={onReady}
          />
        </Physics>
        <Environment blur={0.75} resolution={quality === 'balanced' ? 64 : 256}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

function Band({
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardColor = '#ffffff',
  lanyardWidth = 2,
  lanyardImage = null,
  quality = 'full',
  onReady,
}: {
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardColor?: string;
  lanyardWidth?: number;
  lanyardImage?: string | null;
  quality?: 'full' | 'balanced';
  onReady?: () => void;
}) {
  const bandRef = useRef<THREE.Mesh>(null!);
  const fixedRef = useRef<any>(null!);
  const j1 = useRef<any>(null!);
  const j2 = useRef<any>(null!);
  const j3 = useRef<any>(null!);
  const cardRef = useRef<any>(null!);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 2, linearDamping: 2 } as const;

  const { nodes, materials } = useGLTF('/lanyard/card.glb') as any;
  const strapTexture = useTexture(lanyardImage || DEFAULT_WOVEN_STRAP_PATTERN);

  const frontTex = useTexture(frontImage || BLANK_PIXEL);
  const backTex = useTexture(backImage || BLANK_PIXEL);

  const cardTexture = useMemo(() => {
    const baseMap = materials.base?.map;
    if (!frontImage && !backImage) return baseMap;

    const canvas = document.createElement('canvas');
    const sourceWidth = baseMap?.image?.width || 1024;
    const sourceHeight = baseMap?.image?.height || 1024;
    const frontTextureImage = frontTex?.image as { width?: number; height?: number } | undefined;
    const backTextureImage = backTex?.image as { width?: number; height?: number } | undefined;
    const photoMaxDimension = Math.max(
      frontTextureImage?.width || 0,
      frontTextureImage?.height || 0,
      backTextureImage?.width || 0,
      backTextureImage?.height || 0
    );
    const maxTextureSize = quality === 'balanced'
      ? 1024
      : Math.max(sourceWidth, sourceHeight, photoMaxDimension);
    const textureScale = Math.min(1, maxTextureSize / Math.max(sourceWidth, sourceHeight));
    const width = Math.max(1, Math.round(sourceWidth * textureScale));
    const height = Math.max(1, Math.round(sourceHeight * textureScale));
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return baseMap;

    if (baseMap?.image) {
      ctx.drawImage(baseMap.image, 0, 0, width, height);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    }

    if (frontImage && frontTex?.image) {
      const rect = {
        x: FRONT_UV_RECT.x * width,
        y: FRONT_UV_RECT.y * height,
        w: FRONT_UV_RECT.w * width,
        h: FRONT_UV_RECT.h * height,
      };
      drawSkeuomorphicCard(ctx, frontTex.image, rect, imageFit, false);
    }

    if (backImage && backTex?.image) {
      const rect = {
        x: BACK_UV_RECT.x * width,
        y: BACK_UV_RECT.y * height,
        w: BACK_UV_RECT.w * width,
        h: BACK_UV_RECT.h * height,
      };
      drawSkeuomorphicCard(ctx, backTex.image, rect, imageFit, true);
    }

    const tex = new THREE.CanvasTexture(canvas);
    // The portrait is drawn into a 2D canvas in sRGB. Marking the texture
    // accordingly prevents WebGL from washing out skin tones and highlights.
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = quality === 'balanced' ? 4 : 16;
    if (quality === 'balanced') {
      tex.generateMipmaps = false;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
    }
    tex.flipY = false;
    return tex;
  }, [materials.base?.map, frontImage, frontTex?.image, backImage, backTex?.image, imageFit, quality]);

  useEffect(() => {
    const baseMap = materials.base?.map;
    return () => {
      if (cardTexture && cardTexture !== baseMap) cardTexture.dispose();
    };
  }, [cardTexture, materials.base?.map]);

  useEffect(() => {
    onReady?.();
  }, [cardTexture, onReady]);

  const [curve] = useState(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3()
  ]));

  const [dragged, setDragged] = useState<THREE.Vector3 | false>(false);
  const [hovered, setHovered] = useState(false);

  useRopeJoint(fixedRef, j1, [[0, 0, 0], [0, 0, 0], 5.85]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1.35]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1.35]);
  useSphericalJoint(j3, cardRef, [[0, 0, 0], [0, 2.25, 0]]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = 'grab';
      return () => { document.body.style.cursor = 'auto'; };
    }
  }, [hovered]);

  useFrame((state) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      cardRef.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      });
    }

    if (fixedRef.current && j1.current && j2.current && j3.current && cardRef.current) {
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.translation());
      curve.points[2].copy(j1.current.translation());
      curve.points[3].copy(fixedRef.current.translation());

      if (bandRef.current && bandRef.current.geometry) {
        (bandRef.current.geometry as any).setPoints(curve.getPoints(quality === 'balanced' ? 16 : 32));
      }

      ang.copy(cardRef.current.angvel());
      rot.copy(cardRef.current.rotation());
      cardRef.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  strapTexture.wrapS = strapTexture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 9.5, 0]}>
        <RigidBody ref={fixedRef} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          ref={cardRef}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
          enabledRotations={[true, true, true]}
        >
          <CuboidCollider args={[1.15, 1.55, 0.01]} />
          <group
            scale={3.2}
            position={[0, -1.35, -0.05]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerDown={(e) => {
              e.stopPropagation();
              const target = (e.nativeEvent?.target || e.target) as HTMLElement;
              if (target && typeof target.setPointerCapture === 'function') {
                try {
                  target.setPointerCapture(e.pointerId);
                } catch (_) {}
              }
              setDragged(new THREE.Vector3().copy(e.point).sub(cardRef.current.translation()));
            }}
            onPointerUp={(e) => {
              e.stopPropagation();
              const target = (e.nativeEvent?.target || e.target) as HTMLElement;
              if (target && typeof target.releasePointerCapture === 'function') {
                try {
                  target.releasePointerCapture(e.pointerId);
                } catch (_) {}
              }
              setDragged(false);
            }}
            onPointerCancel={() => setDragged(false)}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshBasicMaterial
                map={cardTexture || materials.base.map}
                map-anisotropy={quality === 'balanced' ? 4 : 16}
                toneMapped={false}
              />
            </mesh>
            {/* Single Compact Silver Hardware Clip Connector */}
            <mesh geometry={nodes.clip.geometry} position={[0, -0.08, 0]}>
              <meshStandardMaterial metalness={0.95} roughness={0.12} color="#e2e8f0" />
            </mesh>
            <mesh geometry={nodes.clamp.geometry}>
              <meshStandardMaterial metalness={0.95} roughness={0.12} color="#cbd5e1" />
            </mesh>
          </group>
        </RigidBody>
      </group>

      <mesh ref={bandRef}>
        {/* @ts-ignore */}
        <meshLineGeometry />
        {/* @ts-ignore */}
        <meshLineMaterial
          color={lanyardColor}
          depthTest={true}
          resolution={[1000, 1000]}
          useMap={1}
          map={strapTexture}
          repeat={[-3, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}

function drawSubImage(
  ctx: CanvasRenderingContext2D,
  img: any,
  rect: { x: number; y: number; w: number; h: number },
  fit: 'cover' | 'contain'
) {
  const imgW = img.width || img.naturalWidth;
  const imgH = img.height || img.naturalHeight;
  if (!imgW || !imgH) return;

  const imgAspect = imgW / imgH;
  const rectAspect = rect.w / rect.h;

  let sx = 0;
  let sy = 0;
  let sw = imgW;
  let sh = imgH;

  if (fit === 'cover') {
    if (imgAspect > rectAspect) {
      sw = imgH * rectAspect;
      sx = (imgW - sw) / 2;
    } else {
      sh = imgW / rectAspect;
      sy = Math.max(0, (imgH - sh) * 0.15);
    }
  }

  ctx.drawImage(img, sx, sy, sw, sh, rect.x, rect.y, rect.w, rect.h);
}

function drawSkeuomorphicCard(
  ctx: CanvasRenderingContext2D,
  img: any,
  rect: { x: number; y: number; w: number; h: number },
  fit: 'cover' | 'contain',
  isBack: boolean
) {
  // 1. Physical PVC Card Body Base with Subdued Gloss Gradient
  const cardGrad = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.h);
  cardGrad.addColorStop(0, '#ffffff');
  cardGrad.addColorStop(0.2, '#f8fafc');
  cardGrad.addColorStop(0.85, '#f1f5f9');
  cardGrad.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = cardGrad;
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);

  // 2. Micro-Security Guilloché Fine Grid Texture
  ctx.strokeStyle = 'rgba(0, 59, 92, 0.035)';
  ctx.lineWidth = 1;
  for (let i = rect.x; i < rect.x + rect.w; i += 8) {
    ctx.beginPath();
    ctx.moveTo(i, rect.y);
    ctx.lineTo(i + 12, rect.y + rect.h);
    ctx.stroke();
  }

  // 3. Physical Photo Dimensions
  const borderSide = 32;
  const borderTop = 76;
  const borderBottom = 92;

  const photoRect = {
    x: rect.x + borderSide,
    y: rect.y + borderTop,
    w: rect.w - (borderSide * 2),
    h: rect.h - borderTop - borderBottom,
  };

  // 4. Recessed Photo Inset Shadow (creates physical sunken plastic slot)
  ctx.save();
  ctx.shadowColor = 'rgba(15, 23, 42, 0.35)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 5;
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(photoRect.x, photoRect.y, photoRect.w, photoRect.h);
  ctx.restore();

  // 5. Draw Portrait Image
  drawSubImage(ctx, img, photoRect, fit);

  // 6. Realistic Holographic Diagonal Light Reflection Sheen over Photo
  const sheenGrad = ctx.createLinearGradient(
    photoRect.x,
    photoRect.y,
    photoRect.x + photoRect.w * 0.85,
    photoRect.y + photoRect.h * 0.85
  );
  sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
  sheenGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.05)');
  sheenGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0)');
  sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0.12)');
  ctx.fillStyle = sheenGrad;
  ctx.fillRect(photoRect.x, photoRect.y, photoRect.w, photoRect.h);

  // 7. Sunken Photo Frame Inner Bevel & Specular Edge
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.28)';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(photoRect.x, photoRect.y, photoRect.w, photoRect.h);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(photoRect.x + 1.5, photoRect.y + 1.5, photoRect.w - 3, photoRect.h - 3);

  // 8. Metallic Gold Security Microchip (Top Right Corner of Photo)
  const chipX = photoRect.x + photoRect.w - 48;
  const chipY = photoRect.y + 12;
  const chipW = 36;
  const chipH = 28;

  // Chip Gold Metallic Gradient
  const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + chipW, chipY + chipH);
  chipGrad.addColorStop(0, '#fef08a');
  chipGrad.addColorStop(0.3, '#eab308');
  chipGrad.addColorStop(0.7, '#ca8a04');
  chipGrad.addColorStop(1, '#a16207');
  ctx.fillStyle = chipGrad;
  ctx.fillRect(chipX, chipY, chipW, chipH);

  // Chip Circuit Grid Lines
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(chipX + 3, chipY + 3, chipW - 6, chipH - 6);
  ctx.beginPath();
  ctx.moveTo(chipX + chipW / 2, chipY);
  ctx.lineTo(chipX + chipW / 2, chipY + chipH);
  ctx.moveTo(chipX, chipY + chipH / 2);
  ctx.lineTo(chipX + chipW, chipY + chipH / 2);
  ctx.stroke();

  // 9. Card Footer Badge Printed Security Monospace Typography
  ctx.font = 'bold 11px monospace';
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('ARVIN F. BAÑES', photoRect.x + 4, rect.y + rect.h - 58);

  ctx.font = '9px monospace';
  ctx.fillStyle = '#64748b';
  ctx.fillText('DEV • ACCESS: LVL-4 // 2026', photoRect.x + 4, rect.y + rect.h - 42);
  ctx.fillText('USA CS // PASS #8492-B', photoRect.x + 4, rect.y + rect.h - 26);

  // 10. Security Micro-Barcode on the Footer Right
  const barcodeX = photoRect.x + photoRect.w - 85;
  const barcodeY = rect.y + rect.h - 64;
  ctx.fillStyle = '#0f172a';
  const barWidths = [3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 1, 2, 4, 2];
  let curBX = barcodeX;
  for (const bw of barWidths) {
    ctx.fillRect(curBX, barcodeY, bw, 42);
    curBX += bw + 2;
  }

  // 11. Top Center Lanyard Slot Punch Hole (Dark cutout hole with metallic border)
  const slotW = 54;
  const slotH = 12;
  const slotX = rect.x + (rect.w - slotW) / 2;
  const slotY = rect.y + 18;

  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(slotX, slotY, slotW, slotH, 6);
  } else {
    ctx.rect(slotX, slotY, slotW, slotH);
  }
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // 12. Strong Outer Perimeter Outline & Dual-Tone Bevel
  // Solid outer dark border outline for maximum contrast and pop
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.45)';
  ctx.lineWidth = 8;
  ctx.strokeRect(rect.x + 4, rect.y + 4, rect.w - 8, rect.h - 8);

  // Inner subtle gold security pinstripe outline
  ctx.strokeStyle = 'rgba(226, 172, 59, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(rect.x + 10, rect.y + 10, rect.w - 20, rect.h - 20);

  // 3D Chamfered Plastic Edge (Specular top-left rim, shadow bottom-right)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(rect.x + 8, rect.y + rect.h - 8);
  ctx.lineTo(rect.x + 8, rect.y + 8);
  ctx.lineTo(rect.x + rect.w - 8, rect.y + 8);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(rect.x + rect.w - 8, rect.y + 8);
  ctx.lineTo(rect.x + rect.w - 8, rect.y + rect.h - 8);
  ctx.lineTo(rect.x + 8, rect.y + rect.h - 8);
  ctx.stroke();
}
