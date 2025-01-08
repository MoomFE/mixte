<template>
  <div ref="rootRef" v-once class="mixte-lottery" />
</template>

<script lang="ts" setup>
  import type { LotteryProps } from './types';
  import { colCount, rowCount, useProvideStore, useStore } from '@mixte/snippets/lottery/config-provider-Injection-state';
  import { createCard, createHighlight } from '@mixte/snippets/lottery/utils';
  import { random } from 'mixte';
  import * as THREE from 'three';
  import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
  import { onMounted } from 'vue';
  import { CSS3DObject, CSS3DRenderer } from './CSS3DRenderer';

  const props = defineProps<LotteryProps>();

  const {
    rootRef,
    rootWidth,
    rootHeight,

    camera,
    scene,
    renderer,
    controls,

    cards,
    targets,

    transformToTable,
    transformToSphere,
    isTransforming,
    isTable,
    isSphere,

    rotate,
    stopRotate,
    isRotating,

    selectCard,
    resetCard,

    animate,
  } = useStore() ?? useProvideStore();

  const highlightCells = createHighlight();

  function init() {
    const users = Array.from(props.users);
    const usersLength = users.length;

    camera.value = new THREE.PerspectiveCamera(40, rootWidth.value / rootHeight.value, 1, 10000);
    camera.value!.position.z = 3000;

    scene.value = new THREE.Scene();

    let index = 0;

    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < colCount; j++) {
        const isBold = highlightCells.includes(`${j}-${i}`);
        const el = createCard(
          users[index % usersLength],
          isBold,
          index++,
          true,
        );

        const cssObj = new CSS3DObject(el);
        cssObj.position.x = random(-2000, 2000);
        cssObj.position.y = random(-2000, 2000);
        cssObj.position.z = random(-2000, 2000);
        scene.value.add(cssObj);
        cards.value.push(cssObj);

        const obj = new THREE.Object3D();
        obj.position.x = j * 140 - (140 * colCount - 20) / 2;
        obj.position.y = -(i * 180) + (180 * rowCount - 20) / 2;
        targets.table.push(obj);
        index++;
      }
    }

    // sphere

    const vector = new THREE.Vector3();

    for (let i = 0, l = cards.value.length; i < l; i++) {
      const phi = Math.acos(-1 + (2 * i) / l);
      const theta = Math.sqrt(l * Math.PI) * phi;
      const object = new THREE.Object3D();
      object.position.setFromSphericalCoords(800, phi, theta);
      vector.copy(object.position).multiplyScalar(2);
      object.lookAt(vector);
      targets.sphere.push(object);
    }

    renderer.value = new CSS3DRenderer();
    renderer.value.setSize(rootWidth.value, rootHeight.value);
    rootRef.value!.appendChild(renderer.value.domElement);

    //

    controls.value = new TrackballControls(camera.value, renderer.value.domElement);
    controls.value.rotateSpeed = 0.5;
    controls.value.minDistance = 500;
    controls.value.maxDistance = 6000;

    transformToTable();
  }

  onMounted(() => {
    init();
    animate();
  });

  defineExpose({
    transformToTable,
    transformToSphere,
    isTransforming,
    isTable,
    isSphere,

    rotate,
    stopRotate,
    isRotating,

    selectCard,
    resetCard,
  });
</script>
