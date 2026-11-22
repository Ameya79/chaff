import * as THREE from 'three';

export default function App() {
  function init() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
  }
  return <div>Vite 3D Canvas Application</div>;
}
