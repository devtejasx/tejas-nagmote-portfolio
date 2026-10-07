import {
  BoxGeometry,
  CylinderGeometry,
  IcosahedronGeometry,
  OctahedronGeometry,
  type BufferGeometry,
} from 'three'
import type { SceneNodeId } from './layout'

interface ShapeProps {
  kind: SceneNodeId
  color: string
  hovered: boolean
}

/** A solid body plus a crisp outline of its hard edges. */
function Body({
  geometry,
  color,
  hovered,
  position,
  edgeThreshold = 1,
}: {
  geometry: BufferGeometry
  color: string
  hovered: boolean
  position?: [number, number, number]
  edgeThreshold?: number
}) {
  return (
    <group position={position}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#0b1020"
          metalness={0.6}
          roughness={0.32}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.16}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[geometry, edgeThreshold]} />
        <lineBasicMaterial color={color} transparent opacity={hovered ? 1 : 0.75} />
      </lineSegments>
    </group>
  )
}

function Led({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.028, 8, 8]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  )
}

// Built once and shared by every node; the scene lives as long as the page.
const geometries = {
  screen: new BoxGeometry(1.05, 0.68, 0.06),
  octa: new OctahedronGeometry(0.34),
  octaShell: new OctahedronGeometry(0.62),
  slab: new BoxGeometry(1.0, 0.2, 0.62),
  ico: new IcosahedronGeometry(0.34, 0),
  disk: new CylinderGeometry(0.44, 0.44, 0.2, 32),
}

export function NodeShape({ kind, color, hovered }: ShapeProps) {
  switch (kind) {
    case 'client':
      return (
        <group>
          <Body geometry={geometries.screen} color={color} hovered={hovered} />
          {[0.14, 0.0, -0.14].map((y, i) => (
            <mesh key={y} position={[-0.12 + i * 0.06, y, 0.04]}>
              <boxGeometry args={[0.62 - i * 0.18, 0.045, 0.01]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.85 - i * 0.2}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>
      )
    case 'api':
      return (
        <group>
          <Body geometry={geometries.octa} color={color} hovered={hovered} />
          <lineSegments>
            <edgesGeometry args={[geometries.octaShell]} />
            <lineBasicMaterial color={color} transparent opacity={hovered ? 0.9 : 0.4} />
          </lineSegments>
        </group>
      )
    case 'service':
      return (
        <group>
          {[0.27, 0, -0.27].map((y) => (
            <group key={y}>
              <Body
                geometry={geometries.slab}
                color={color}
                hovered={hovered}
                position={[0, y, 0]}
              />
              <Led position={[0.38, y, 0.32]} color={y === 0 ? '#5fe3a1' : '#9cc0ff'} />
            </group>
          ))}
        </group>
      )
    case 'redis':
      return (
        <group>
          <Body geometry={geometries.ico} color={color} hovered={hovered} />
          <mesh rotation={[Math.PI / 2.4, 0, 0]}>
            <torusGeometry args={[0.6, 0.012, 8, 64]} />
            <meshBasicMaterial color={color} transparent opacity={0.7} toneMapped={false} />
          </mesh>
          <mesh rotation={[Math.PI / 2, Math.PI / 5, 0]}>
            <torusGeometry args={[0.74, 0.008, 8, 64]} />
            <meshBasicMaterial color={color} transparent opacity={0.35} toneMapped={false} />
          </mesh>
        </group>
      )
    case 'postgres':
      return (
        <group>
          {[0.27, 0, -0.27].map((y) => (
            <Body
              key={y}
              geometry={geometries.disk}
              color={color}
              hovered={hovered}
              position={[0, y, 0]}
              edgeThreshold={30}
            />
          ))}
        </group>
      )
  }
}
