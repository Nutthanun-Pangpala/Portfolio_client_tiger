"use client";

import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import {
    BallCollider,
    CuboidCollider,
    Physics,
    RigidBody,
    useRopeJoint,
    useSphericalJoint,
    type RapierRigidBody,
    type RigidBodyProps,
} from "@react-three/rapier";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import GoldenPortrait from "./GoldenPortrait";


const PHOTO_SRC = "/images/profile.png";
const NAME = "Nutthanun Pengpala";
const ROLE = "Full-stack software developer";

const ACCENT = "#e11d2e"; // แดงหลัก (สาย + เส้นขอบรูป)
const ACCENT_SOFT = "#ff5560"; // แดงสว่าง
const ACCENT_DEEP = "#7a0a12"; // แดงเข้ม
const METAL = "#c9c9cf"; // คลิปโลหะสีเงิน

const CARD_W = 2.2;
const CARD_H = 3.1;
const CLIP_Y = CARD_H / 2 + 0.22; // จุดที่สายเกี่ยวกับการ์ด (เทียบกับกลางการ์ด)
const BAND_WIDTH = 0.18; // ความกว้างของสายคล้อง (หน่วย world)
const BAND_SEGMENTS = 32;
const CAMERA_Z = 15; // ยิ่งมาก การ์ดยิ่งเล็กบนจอ

/* ------------------------------------------------------------------ */
/* Card textures (วาดด้วย canvas จึงไม่ต้องมีไฟล์ .glb)                  */
/* ------------------------------------------------------------------ */
const TEX_W = 1024;
const TEX_H = Math.round(TEX_W * (CARD_H / CARD_W));
// พิกัดตอนวาดใช้พื้นที่กว้าง 640 แล้วสเกลขึ้นให้คมตาม TEX_W
const LW = 640;
const LH = TEX_H / (TEX_W / LW);

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function prepare(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const s = canvas.width / LW;
  ctx.setTransform(s, 0, 0, s, 0, 0);
  return ctx;
}

function drawFront(canvas: HTMLCanvasElement, photo?: HTMLImageElement) {
  const ctx = prepare(canvas);
  if (!ctx) return;
  const W = LW;
  const H = LH;

  ctx.save();
  roundRectPath(ctx, 0, 0, W, H, 44);
  ctx.clip();

  // พื้นการ์ดดำ มีแดงเรืองจางๆ ที่มุมล่าง
  ctx.fillStyle = "#0b0708";
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W, H, 20, W, H, W * 1.1);
  glow.addColorStop(0, "rgba(225,29,46,0.35)");
  glow.addColorStop(1, "rgba(225,29,46,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // ช่องเจาะที่คลิปเกี่ยว
  ctx.fillStyle = "#000";
  roundRectPath(ctx, W / 2 - 56, 28, 112, 20, 10);
  ctx.fill();

  // รูปโปรไฟล์: ใหญ่เกือบเต็มการ์ด (crop แบบ cover)
  const px = 32;
  const py = 72;
  const pw = W - 64;
  const ph = 600;
  ctx.save();
  roundRectPath(ctx, px, py, pw, ph, 30);
  ctx.clip();
  ctx.fillStyle = "#1d1012";
  ctx.fillRect(px, py, pw, ph);
  if (photo && photo.naturalWidth) {
    const s = Math.max(pw / photo.naturalWidth, ph / photo.naturalHeight);
    const dw = photo.naturalWidth * s;
    const dh = photo.naturalHeight * s;
    // จัดรูปให้เน้นส่วนบน (ใบหน้า) ถ้ารูปสูงกว่าช่อง
    const dy = py + Math.min(0, (ph - dh) * 0.25);
    ctx.drawImage(photo, px + (pw - dw) / 2, dy, dw, dh);
  }
  ctx.restore();

  // กรอบแดงรอบรูป
  ctx.strokeStyle = ACCENT;
  ctx.lineWidth = 4;
  roundRectPath(ctx, px, py, pw, ph, 30);
  ctx.stroke();

  // ชื่อ + ตำแหน่ง
  ctx.textAlign = "left";
  ctx.fillStyle = "#f7f1f1";
  ctx.font = "700 44px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.fillText(NAME, px, py + ph + 72);
  ctx.fillStyle = "#c98a8f";
  ctx.font = "500 27px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.fillText(ROLE, px, py + ph + 118);

  // เส้นแดงด้านล่าง
  ctx.fillStyle = ACCENT;
  ctx.fillRect(px, H - 54, 72, 6);
  ctx.restore();

  // ขอบนอก
  ctx.strokeStyle = "rgba(225,29,46,0.6)";
  ctx.lineWidth = 6;
  roundRectPath(ctx, 3, 3, W - 6, H - 6, 42);
  ctx.stroke();
}

function drawBack(canvas: HTMLCanvasElement) {
  const ctx = prepare(canvas);
  if (!ctx) return;
  const W = LW;
  const H = LH;
  ctx.save();
  roundRectPath(ctx, 0, 0, W, H, 44);
  ctx.clip();
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, ACCENT_SOFT);
  bg.addColorStop(0.45, ACCENT);
  bg.addColorStop(1, ACCENT_DEEP);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#0b0708";
  ctx.textAlign = "center";
  ctx.font = "800 210px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.fillText("NP", W / 2, H / 2 + 40);
  ctx.font = "500 30px system-ui, -apple-system, 'Segoe UI', sans-serif";
  ctx.fillText("Software developer", W / 2, H / 2 + 112);
  ctx.restore();
}

function useCardTextures() {
  const textures = useMemo(() => {
    const make = () => {
      const canvas = document.createElement("canvas");
      canvas.width = TEX_W;
      canvas.height = TEX_H;
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      return { canvas, texture };
    };
    const front = make();
    const back = make();
    drawFront(front.canvas);
    drawBack(back.canvas);
    return { front, back };
  }, []);

  useEffect(() => {
    const img = new window.Image();
    img.src = PHOTO_SRC;
    img.onload = () => {
      drawFront(textures.front.canvas, img);
      textures.front.texture.needsUpdate = true;
    };
    textures.back.texture.needsUpdate = true;
    return () => {
      img.onload = null;
    };
  }, [textures]);

  return { front: textures.front.texture, back: textures.back.texture };
}

/* ------------------------------------------------------------------ */
/* Band + Card + Physics                                               */
/* ------------------------------------------------------------------ */
const segmentProps: RigidBodyProps = {
  type: "dynamic",
  canSleep: true,
  colliders: false,
  angularDamping: 2,
  linearDamping: 2,
};

function Band() {
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  const [dragged, setDragged] = useState<THREE.Vector3 | false>(false);
  const [hovered, setHovered] = useState(false);

  const { front, back } = useCardTextures();

  const tmp = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const lerp1 = useMemo(() => new THREE.Vector3(), []);
  const lerp2 = useMemo(() => new THREE.Vector3(), []);
  const inited = useRef(false);

  const curve = useMemo(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    c.curveType = "chordal";
    return c;
  }, []);

  // สายคล้องคอ = ribbon แบนที่อัปเดตทุกเฟรม (ไม่ต้องใช้ meshline)
  const bandGeometry = useMemo(() => {
    const n = BAND_SEGMENTS;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array((n + 1) * 2 * 3), 3),
    );
    const index: number[] = [];
    for (let i = 0; i < n; i++) {
      const a = i * 2;
      index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    geometry.setIndex(index);
    return geometry;
  }, []);

  useEffect(() => () => bandGeometry.dispose(), [bandGeometry]);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, CLIP_Y, 0],
  ]);

  useEffect(() => {
    if (hovered || dragged) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => {
        document.body.style.cursor = "auto";
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    const c = card.current;
    const f = fixed.current;
    const a = j1.current;
    const b = j2.current;
    const d = j3.current;
    if (!c || !f || !a || !b || !d) return;

    if (dragged) {
      tmp.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(tmp).sub(state.camera.position).normalize();
      tmp.add(dir.multiplyScalar(state.camera.position.length()));
      [c, a, b, d, f].forEach((r) => r.wakeUp());
      c.setNextKinematicTranslation({
        x: tmp.x - dragged.x,
        y: tmp.y - dragged.y,
        z: tmp.z - dragged.z,
      });
    }

    if (!inited.current) {
      lerp1.copy(a.translation());
      lerp2.copy(b.translation());
      inited.current = true;
    }
    const smooth = (l: THREE.Vector3, target: THREE.Vector3Like) => {
      tmp.set(target.x, target.y, target.z);
      const dist = THREE.MathUtils.clamp(l.distanceTo(tmp), 0.1, 1);
      l.lerp(tmp, delta * (10 + dist * 40));
    };
    smooth(lerp1, a.translation());
    smooth(lerp2, b.translation());

    curve.points[0].copy(d.translation());
    curve.points[1].copy(lerp2);
    curve.points[2].copy(lerp1);
    curve.points[3].copy(f.translation());

    const pts = curve.getPoints(BAND_SEGMENTS);
    const pos = bandGeometry.attributes.position as THREE.BufferAttribute;
    const half = BAND_WIDTH / 2;
    for (let i = 0; i <= BAND_SEGMENTS; i++) {
      const p = pts[i];
      const prev = pts[Math.max(i - 1, 0)];
      const next = pts[Math.min(i + 1, BAND_SEGMENTS)];
      const tx = next.x - prev.x;
      const ty = next.y - prev.y;
      const len = Math.hypot(tx, ty) || 1;
      const nx = (-ty / len) * half;
      const ny = (tx / len) * half;
      pos.setXYZ(i * 2, p.x + nx, p.y + ny, p.z);
      pos.setXYZ(i * 2 + 1, p.x - nx, p.y - ny, p.z);
    }
    pos.needsUpdate = true;

    // ลดการหมุนรอบแกน Y ให้การ์ดหันกลับมาหน้าตรงเอง
    ang.copy(c.angvel());
    rot.copy(c.rotation() as unknown as THREE.Vector3);
    c.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
  });

  function onPointerDown(e: ThreeEvent<PointerEvent>) {
    (e.target as unknown as Element).setPointerCapture(e.pointerId);
    const t = card.current.translation();
    setDragged(new THREE.Vector3().copy(e.point).sub(tmp.set(t.x, t.y, t.z)));
  }

  function onPointerUp(e: ThreeEvent<PointerEvent>) {
    (e.target as unknown as Element).releasePointerCapture(e.pointerId);
    setDragged(false);
  }

  return (
    <>
      {/* จุดแขวนอยู่เหนือขอบบนของ canvas สายจึงโผล่ลงมาจากขอบบน */}
      <group position={[0, 3.8, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody ref={j1} position={[0.3, 0, 0]} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody ref={j2} position={[0.6, 0, 0]} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody ref={j3} position={[0.9, 0, 0]} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          ref={card}
          position={[0.9, -CLIP_Y, 0]}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[CARD_W / 2, CARD_H / 2, 0.03]} />
          <group
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            {/* ตัวการ์ด */}
            <RoundedBox
              args={[CARD_W - 0.01, CARD_H - 0.01, 0.05]}
              radius={0.08}
              smoothness={4}
            >
              <meshStandardMaterial color="#0b0708" roughness={0.45} metalness={0.5} />
            </RoundedBox>

            {/* หน้า */}
            <mesh position={[0, 0, 0.0262]}>
              <planeGeometry args={[CARD_W, CARD_H]} />
              <meshStandardMaterial
                map={front}
                alphaTest={0.5}
                roughness={0.4}
                metalness={0.1}
              />
            </mesh>

            {/* หลัง */}
            <mesh position={[0, 0, -0.0262]} rotation={[0, Math.PI, 0]}>
              <planeGeometry args={[CARD_W, CARD_H]} />
              <meshStandardMaterial
                map={back}
                alphaTest={0.5}
                roughness={0.35}
                metalness={0.25}
              />
            </mesh>

            {/* คลิปโลหะ + ห่วง */}
            <mesh position={[0, CARD_H / 2 + 0.08, 0]}>
              <boxGeometry args={[0.38, 0.22, 0.1]} />
              <meshStandardMaterial color={METAL} metalness={1} roughness={0.25} />
            </mesh>
            <mesh position={[0, CLIP_Y, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.08, 0.028, 12, 24]} />
              <meshStandardMaterial color={METAL} metalness={1} roughness={0.25} />
            </mesh>
          </group>
        </RigidBody>
      </group>

      {/* สายคล้องคอ */}
      <mesh geometry={bandGeometry} frustumCulled={false}>
        <meshBasicMaterial color={ACCENT} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Export                                                              */
/* ------------------------------------------------------------------ */
export default function Lanyard() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // คนที่ปิด animation ในระบบ จะเห็นการ์ดแบบเดิมแทน
  if (reduceMotion) return <GoldenPortrait />;

  return (
    <div className="lanyard">
      <Canvas
        camera={{ position: [0, 0, CAMERA_Z], fov: 25 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        style={{ touchAction: "pan-y" }}
      >
        <ambientLight intensity={Math.PI * 0.6} />
        <directionalLight position={[3, 4, 5]} intensity={2} />
        <Physics gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Band />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}