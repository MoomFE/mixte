// @ts-nocheck

import * as THREE from 'three';

/**
 * Based on http://www.emagix.net/academic/mscs-project/item/camera-sync-with-css3-and-webgl-threejs
 * @author mrdoob / http://mrdoob.com/
 * @author yomotsu / https://yomotsu.net/
 */

interface CacheCamera {
  fov: number;
  style: string;
}

interface CacheObject {
  style: string;
  distanceToCameraSquared?: number;
}

interface Cache {
  camera: CacheCamera;
  objects: WeakMap<CSS3DObject, CacheObject>;
}

export class CSS3DObject extends THREE.Object3D {
  element: HTMLElement;

  constructor(element: HTMLElement) {
    super();
    this.element = element;
    this.element.style.position = 'absolute';

    this.addEventListener('removed', () => {
      if (this.element.parentNode !== null) {
        this.element.parentNode.removeChild(this.element);
      }
    });
  }
}

export class CSS3DSprite extends CSS3DObject {
  constructor(element: HTMLElement) {
    super(element);
  }
}

export class CSS3DRenderer {
  private _width: number;
  private _height: number;
  private _widthHalf: number;
  private _heightHalf: number;
  private matrix: THREE.Matrix4;
  private cache: Cache;
  private isIE: boolean;

  domElement: HTMLDivElement;
  cameraElement: HTMLDivElement;

  constructor() {
    this._width = 0;
    this._height = 0;
    this._widthHalf = 0;
    this._heightHalf = 0;

    this.matrix = new THREE.Matrix4();

    this.cache = {
      camera: { fov: 0, style: '' },
      objects: new WeakMap(),
    };

    this.domElement = document.createElement('div');
    this.domElement.style.overflow = 'hidden';

    this.cameraElement = document.createElement('div');
    this.cameraElement.style.WebkitTransformStyle = 'preserve-3d';
    this.cameraElement.style.transformStyle = 'preserve-3d';

    this.domElement.appendChild(this.cameraElement);

    this.isIE = /Trident/i.test(navigator.userAgent);
  }

  getSize(): { width: number; height: number } {
    return {
      width: this._width,
      height: this._height,
    };
  }

  setSize(width: number, height: number): void {
    this._width = width;
    this._height = height;
    this._widthHalf = width / 2;
    this._heightHalf = height / 2;

    this.domElement.style.width = `${width}px`;
    this.domElement.style.height = `${height}px`;

    this.cameraElement.style.width = `${width}px`;
    this.cameraElement.style.height = `${height}px`;
  }

  private epsilon(value: number): number {
    return Math.abs(value) < 1e-10 ? 0 : value;
  }

  private getCameraCSSMatrix(matrix: THREE.Matrix4): string {
    const elements = matrix.elements;
    return `matrix3d(${
      this.epsilon(elements[0])},${
      this.epsilon(-elements[1])},${
      this.epsilon(elements[2])},${
      this.epsilon(elements[3])},${
      this.epsilon(elements[4])},${
      this.epsilon(-elements[5])},${
      this.epsilon(elements[6])},${
      this.epsilon(elements[7])},${
      this.epsilon(elements[8])},${
      this.epsilon(-elements[9])},${
      this.epsilon(elements[10])},${
      this.epsilon(elements[11])},${
      this.epsilon(elements[12])},${
      this.epsilon(-elements[13])},${
      this.epsilon(elements[14])},${
      this.epsilon(elements[15])
    })`;
  }

  private getObjectCSSMatrix(matrix: THREE.Matrix4, cameraCSSMatrix: string): string {
    const elements = matrix.elements;
    const matrix3d = `matrix3d(${
      this.epsilon(elements[0])},${
      this.epsilon(elements[1])},${
      this.epsilon(elements[2])},${
      this.epsilon(elements[3])},${
      this.epsilon(-elements[4])},${
      this.epsilon(-elements[5])},${
      this.epsilon(-elements[6])},${
      this.epsilon(-elements[7])},${
      this.epsilon(elements[8])},${
      this.epsilon(elements[9])},${
      this.epsilon(elements[10])},${
      this.epsilon(elements[11])},${
      this.epsilon(elements[12])},${
      this.epsilon(elements[13])},${
      this.epsilon(elements[14])},${
      this.epsilon(elements[15])
    })`;

    if (this.isIE) {
      return `translate(-50%,-50%)`
        + `translate(${this._widthHalf}px,${this._heightHalf}px)${
          cameraCSSMatrix
        }${matrix3d}`;
    }

    return `translate(-50%,-50%)${matrix3d}`;
  }

  private getDistanceToSquared = (() => {
    const a: THREE.Vector3 = new THREE.Vector3();
    const b: THREE.Vector3 = new THREE.Vector3();

    return (object1: THREE.Object3D, object2: THREE.Object3D): number => {
      a.setFromMatrixPosition(object1.matrixWorld);
      b.setFromMatrixPosition(object2.matrixWorld);
      return a.distanceToSquared(b);
    };
  })();

  private renderObject(
    object: THREE.Object3D,
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
    cameraCSSMatrix: string,
  ): void {
    if (object instanceof CSS3DObject) {
      let style;

      if (object instanceof CSS3DSprite) {
        this.matrix.copy(camera.matrixWorldInverse);
        this.matrix.transpose();
        this.matrix.copyPosition(object.matrixWorld);
        this.matrix.scale(object.scale);

        this.matrix.elements[3] = 0;
        this.matrix.elements[7] = 0;
        this.matrix.elements[11] = 0;
        this.matrix.elements[15] = 1;

        style = this.getObjectCSSMatrix(this.matrix, cameraCSSMatrix);
      }
      else {
        style = this.getObjectCSSMatrix(object.matrixWorld, cameraCSSMatrix);
      }

      const element = object.element;
      const cachedObject = this.cache.objects.get(object);

      if (cachedObject === undefined || cachedObject.style !== style) {
        element.style.WebkitTransform = style;
        element.style.transform = style;

        const objectData = { style };

        if (this.isIE) {
          objectData.distanceToCameraSquared = this.getDistanceToSquared(camera, object);
        }

        this.cache.objects.set(object, objectData);
      }

      if (element.parentNode !== this.cameraElement) {
        this.cameraElement.appendChild(element);
      }
    }

    for (let i = 0; i < object.children.length; i++) {
      this.renderObject(object.children[i], camera, cameraCSSMatrix);
    }
  }

  private filterAndFlatten(scene: THREE.Scene): CSS3DObject[] {
    const result: CSS3DObject[] = [];
    scene.traverse((object) => {
      if (object instanceof CSS3DObject) result.push(object);
    });
    return result;
  }

  private zOrder(scene: THREE.Scene): void {
    const sorted = this.filterAndFlatten(scene).sort((a, b) => {
      const distanceA = this.cache.objects.get(a).distanceToCameraSquared;
      const distanceB = this.cache.objects.get(b).distanceToCameraSquared;
      return distanceA - distanceB;
    });

    const zMax = sorted.length;

    for (let i = 0; i < sorted.length; i++) {
      sorted[i].element.style.zIndex = zMax - i;
    }
  }

  render(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera | THREE.OrthographicCamera,
  ): void {
    const fov = camera.projectionMatrix.elements[5] * this._heightHalf;

    if (this.cache.camera.fov !== fov) {
      if (camera.isPerspectiveCamera) {
        this.domElement.style.WebkitPerspective = `${fov}px`;
        this.domElement.style.perspective = `${fov}px`;
      }
      this.cache.camera.fov = fov;
    }

    scene.updateMatrixWorld();
    if (camera.parent === null) camera.updateMatrixWorld();

    let tx, ty;
    if (camera.isOrthographicCamera) {
      tx = -(camera.right + camera.left) / 2;
      ty = (camera.top + camera.bottom) / 2;
    }

    const cameraCSSMatrix = camera.isOrthographicCamera
      ? `scale(${fov})` + `translate(${this.epsilon(tx)}px,${this.epsilon(ty)}px)${this.getCameraCSSMatrix(camera.matrixWorldInverse)}`
      : `translateZ(${fov}px)${this.getCameraCSSMatrix(camera.matrixWorldInverse)}`;

    const style = `${cameraCSSMatrix
    }translate(${this._widthHalf}px,${this._heightHalf}px)`;

    if (this.cache.camera.style !== style && !this.isIE) {
      this.cameraElement.style.WebkitTransform = style;
      this.cameraElement.style.transform = style;
      this.cache.camera.style = style;
    }

    this.renderObject(scene, camera, cameraCSSMatrix);

    if (this.isIE) {
      this.zOrder(scene);
    }
  }
}
