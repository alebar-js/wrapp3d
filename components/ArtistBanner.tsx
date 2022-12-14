import * as THREE from 'three';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/three';
import { Image } from '../types';
import {
  useFrame,
  useLoader,
  extend,
  ReactThreeFiber,
} from '@react-three/fiber';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import gotham from '../public/fonts/helvetiker_regular.typeface.json';
import { OrbitContext } from './Orbit';

interface ArtistBannerProps {
  name: string;
  image: Image;
  position: THREE.Vector3;
  noTitle?: Boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      textGeometry: ReactThreeFiber.Object3DNode<
        TextGeometry,
        typeof TextGeometry
      >;
    }
  }
}

extend({ TextGeometry });

const ArtistBanner = ({
  name,
  image,
  position,
  noTitle,
}: ArtistBannerProps) => {
  const ref = useRef<THREE.Mesh>();
  const textRef = useRef<TextGeometry>();
  const texture = useLoader(THREE.TextureLoader, image.url);
  const orbit = useContext(OrbitContext);
  const [hovered, hover] = useState(false);

  const materials = [
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
    new THREE.MeshBasicMaterial({ map: texture }),
    new THREE.MeshBasicMaterial({ map: texture }),
  ];

  const font = new FontLoader().parse(gotham);
  const fontPosition: THREE.Vector3 = new THREE.Vector3(0, 1, 0);

  useFrame((state, delta) => {
    // if (!orbit.hovered) ref.current!.rotation.y -= orbit.orbitalSpeed;
    const x = orbit.cameraPosition?.x;
    const y = orbit.cameraPosition?.y;
    const z = orbit.cameraPosition?.z;
    orbit.cameraPosition && ref.current?.lookAt(x!, y!, z!);
  });
  useEffect(() => {
    textRef.current && textRef.current.center();
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  });
  return (
    <>
      <mesh
        ref={ref as React.Ref<THREE.Mesh>}
        position={position}
        material={materials}
        onPointerEnter={() => hover(true)}
        onPointerLeave={() => hover(false)}
        scale={hovered ? 1.2 : 1}
      >
        <mesh position={fontPosition}>
          {!noTitle && (
            <textGeometry
              ref={textRef as React.Ref<TextGeometry>}
              args={[
                name,
                { font, size: 0.3, height: 0.01, bevelThickness: 0.1 },
              ]}
            />
          )}
          <meshBasicMaterial color={0xffffff} />
        </mesh>
        <boxGeometry args={[1.5, 1.5, 0.2]} />
      </mesh>
    </>
  );
};

export default ArtistBanner;
