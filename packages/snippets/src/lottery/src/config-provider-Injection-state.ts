/* eslint-disable antfu/consistent-list-newline */

import type { LotteryProps, User } from './types';
import { addHighlight, createCard, createHighlight, removeHighlight, updateCard, updateCardBg } from '@mixte/snippets/lottery/utils';
import { useRequest, watchImmediate, wheneverEffectScope, wheneverEffectScopeImmediate } from '@mixte/use';
import { createInjectionState, useCssVar, useElementSize, useIntervalFn } from '@vueuse/core';
import { gsap } from 'gsap';
import { once } from 'lodash-es';
import { random, randomNatural } from 'mixte';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { computed, markRaw, onMounted, ref, shallowReactive, shallowRef, watch } from 'vue';
import { CSS3DObject, CSS3DRenderer } from './CSS3DRenderer';

export const rowCount = 7;
export const colCount = 17;
export const total = rowCount * colCount;

const [
  useSharedStore,
  useShared,
] = createInjectionState(() => {
  const rootRef = ref<HTMLDivElement>();
  const { width: rootWidth, height: rootHeight } = useElementSize(rootRef);

  const vh = computed(() => rootHeight.value / 100);
  const vhCssVar = useCssVar('--mixte-lottery-vh', rootRef);

  watchImmediate(rootHeight, () => {
    vhCssVar.value = `${vh.value}px`;
  });

  const camera = shallowRef<THREE.PerspectiveCamera>();
  const scene = shallowRef<THREE.Scene>();
  const renderer = shallowRef<CSS3DRenderer>();
  const controls = shallowRef<TrackballControls>();

  const cards = ref<CSS3DObject[]>([]);
  const targets = shallowReactive({
    table: [] as THREE.Object3D[],
    sphere: [] as THREE.Object3D[],
    current: [] as THREE.Object3D[],
  });

  const isTable = computed(() => targets.current === targets.table);
  const isSphere = computed(() => targets.current === targets.sphere);

  const selectedCardsIndex = ref<number[]>([]);

  const transformGsapTimeline = shallowRef<gsap.core.Timeline>();
  const resetGsapTimeline = shallowRef<gsap.core.Timeline>();
  const rotateGsapTween = shallowRef<gsap.core.Tween>();
  const selectGsapTimeline = shallowRef<gsap.core.Timeline>();

  const updateSelectCard = ref<LotteryProps['updateSelectCard']>();

  return {
    rootRef,
    rootWidth, rootHeight, vh,
    camera, scene, renderer, controls,
    cards,
    targets, isTable, isSphere,
    highlightCells: createHighlight(),
    selectedCardsIndex,
    transformGsapTimeline, resetGsapTimeline, rotateGsapTween, selectGsapTimeline,

    updateSelectCard,
  };
});

export {
  useShared,
};

export const [
  useProvideStore,
  useProvide,
] = createInjectionState(() => {
  useSharedStore();

  const { transformToTable, transformToSphere, isTransforming } = useTransform();
  const { reset, isResetting } = useReset();
  const { rotate, isRotating } = useRotate();
  const { select, isSelecting } = useSelect();

  return {
    transformToTable,
    transformToSphere,
    isTransforming,

    reset,
    isResetting,

    rotate,
    isRotating,

    select,
    isSelecting,
  };
});

function useTransform() {
  const {
    cards,
    targets,
    transformGsapTimeline, resetGsapTimeline, selectGsapTimeline,
  } = useShared()!;

  const transform = useRequest((
    targets: THREE.Object3D[],
    duration: number,
  ) => {
    transformGsapTimeline.value?.kill();
    resetGsapTimeline.value?.kill();
    selectGsapTimeline.value?.kill();

    return new Promise<void>((resolve) => {
      transformGsapTimeline.value = gsap.timeline({
        onComplete: resolve,
        onInterrupt: resolve,
      });

      for (let i = 0; i < cards.value.length; i++) {
        const card = cards.value[i];
        const target = targets[i];

        transformGsapTimeline.value.to(card.position, {
          x: target.position.x,
          y: target.position.y,
          z: target.position.z,
          duration: random(duration, duration * 2) / 1000,
          ease: 'expo.inOut',
        }, 0);

        transformGsapTimeline.value.to(card.rotation, {
          x: target.rotation.x,
          y: target.rotation.y,
          z: target.rotation.z,
          duration: random(duration, duration * 2) / 1000,
          ease: 'expo.inOut',
        }, 0);
      }
    });
  });

  function transformToTable(duration = 2000) {
    removeHighlight(cards.value);
    addHighlight(cards.value);
    return transform.execute(targets.current = targets.table, duration);
  }
  function transformToSphere(duration = 2000) {
    removeHighlight(cards.value);
    return transform.execute(targets.current = targets.sphere, duration);
  }

  return {
    transformToTable, transformToSphere,
    isTransforming: transform.isLoading,
  };
}

function useReset() {
  const {
    cards,
    targets,
    selectedCardsIndex,
    transformGsapTimeline, resetGsapTimeline, selectGsapTimeline,
  } = useShared()!;

  const reset = useRequest((duration = 500) => {
    resetGsapTimeline.value?.kill();

    if (!selectedCardsIndex.value.length) return Promise.resolve();

    transformGsapTimeline.value?.kill();
    selectGsapTimeline.value?.kill();

    return new Promise<void>((resolve) => {
      const gsapFinally = once(() => {
        selectedCardsIndex.value.forEach((index) => {
          const card = cards.value[index];
          const element = card.element as HTMLDivElement & { originalElement?: HTMLDivElement };
          const originalElement = element.originalElement;

          if (originalElement) {
            element.innerHTML = originalElement.innerHTML;
            element.className = originalElement.className;
          }
          else {
            element.classList.remove('prize');
          }
        });
        selectedCardsIndex.value = [];
        resolve();
      });

      resetGsapTimeline.value = gsap.timeline({
        onComplete: gsapFinally,
        onInterrupt: gsapFinally,
      });

      selectedCardsIndex.value.forEach((index) => {
        const card = cards.value[index];
        const target = targets.current[index];

        // 位置动画
        resetGsapTimeline.value!.to(card.position, {
          x: target.position.x,
          y: target.position.y,
          z: target.position.z,
          duration: random(duration, duration * 2) / 1000,
          ease: 'expo.inOut',
        }, 0);

        // 旋转动画
        resetGsapTimeline.value!.to(card.rotation, {
          x: target.rotation.x,
          y: target.rotation.y,
          z: target.rotation.z,
          duration: random(duration, duration * 2) / 1000,
          ease: 'expo.inOut',
        }, 0);
      });
    });
  });

  return {
    reset: reset.execute,
    isResetting: reset.isLoading,
  };
}

function useRotate() {
  const {
    scene,
    rotateGsapTween,
  } = useShared()!;

  const rotate = useRequest(() => {
    rotateGsapTween.value?.kill();

    return new Promise<void>((resolve) => {
      scene.value!.rotation.y = 0;
      rotateGsapTween.value = gsap.to(scene.value!.rotation, {
        y: Math.PI * 6 * 1000,
        duration: 3000,
        onComplete: () => {
          scene.value!.rotation.y = 0;
          resolve();
        },
        onInterrupt: () => {
          scene.value!.rotation.y = 0;
          resolve();
        },
      });
    });
  });

  return {
    rotate: rotate.execute,
    isRotating: rotate.isLoading,
  };
}

function useSelect() {
  const {
    rootWidth, rootHeight, vh,
    cards,
    selectedCardsIndex,
    transformGsapTimeline, resetGsapTimeline, rotateGsapTween, selectGsapTimeline,

    updateSelectCard,
  } = useShared()!;

  let currentUsers: User[] = [];
  let currentDuration = 0;
  let currentStartTime = 0;

  let ease = 'expo.inOut';

  const {
    execute: select,
    isLoading: isSelecting,
  } = useRequest((users: User[], duration = 600) => {
    transformGsapTimeline.value?.kill();
    resetGsapTimeline.value?.kill();
    rotateGsapTween.value?.kill();
    selectGsapTimeline.value?.kill();

    currentUsers = Array.from(users);
    currentDuration = duration;
    currentStartTime = Date.now();

    return new Promise<void>((resolve) => {
      const width = (12 * vh.value) + (2 * vh.value);
      const height = (16 * vh.value) + (2 * vh.value);
      const locates: { x: number; y: number }[] = [];
      const userTotal = users.length;

      // 计算每行显示数量
      let colNum = 5; // 默认每行5个
      if (userTotal > 15) {
        colNum = Math.ceil(userTotal / 3); // 大于15个时，将总数/3作为每行数量
      }

      // 计算总行数
      const rowNum = Math.ceil(userTotal / colNum);
      // 计算起始位置
      const startY = ((rowNum - 1) * height) / 2;

      while (selectedCardsIndex.value.length < userTotal) {
        const index = randomNatural(0, total - 1);
        if (!selectedCardsIndex.value.includes(index))
          selectedCardsIndex.value.push(index);
      }

      // 计算每个卡片的位置
      for (let row = 0; row < rowNum; row++) {
        const itemsInThisRow = Math.min(colNum, userTotal - row * colNum);
        const startX = -((itemsInThisRow - 1) * width) / 2;

        for (let col = 0; col < itemsInThisRow; col++) {
          locates.push({
            x: startX + col * width,
            y: startY - row * height,
          });
        }
      }

      selectGsapTimeline.value = gsap.timeline({
        onComplete: resolve,
        onInterrupt: resolve,
      });

      // 10 个以下, z = 2100; 每多 3 个, z - 88
      const z = Math.max(
        1000,
        userTotal <= 10
          ? 2100
          : 2100 - Math.floor((userTotal - 10) / 3) * 88,
      );

      selectedCardsIndex.value.forEach((cardIndex, index) => {
        const card = cards.value[cardIndex];
        const user = users[index];

        updateCard(card, user);

        // 更新选中卡片样式的
        if (updateSelectCard.value) {
          const element = card.element as HTMLDivElement; // @ts-expect-error
          element.originalElement = element.cloneNode(true);
          updateSelectCard.value?.(element, user);
        }

        // 添加到时间轴
        selectGsapTimeline.value!.to(card.position, {
          x: locates[index].x,
          y: locates[index].y,
          z,
          duration: duration / 1000,
          ease,
        }, 0);

        selectGsapTimeline.value!.to(card.rotation, {
          x: 0,
          y: 0,
          z: 0,
          duration: duration / 1000,
          ease,
        }, 0);

        card.element.classList.add('prize');
      });
    });
  });

  // 容器大小变化时重新布局
  wheneverEffectScope(() => !!selectedCardsIndex.value.length, (_, __, onCleanup) => {
    watch([rootWidth, rootHeight], async () => {
      const duration = isSelecting.value ? currentDuration - (Date.now() - currentStartTime) : 0;

      ease = 'expo.out';
      select(currentUsers, duration);
      ease = 'expo.inOut';
    });

    onCleanup(() => {
      currentUsers = [];
    });
  });

  return {
    select,
    isSelecting,
  };
}

/**
 * 初始化
 */
export function useInit(props: LotteryProps) {
  const {
    rootRef, rootWidth, rootHeight,
    camera, scene, renderer, controls,
    highlightCells,
    cards, targets,
  } = useShared()!;

  const {
    transformToTable,
  } = useProvide()!;

  function initCamera() {
    camera.value = new THREE.PerspectiveCamera(
      40,
      rootWidth.value / rootHeight.value,
      1,
      10000,
    );
    camera.value!.position.z = 3000;

    scene.value = new THREE.Scene();
  }

  function initCard() {
    const users = Array.from(props.users);
    const usersLength = users.length;

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

        const cssObj = markRaw(new CSS3DObject(el));
        cssObj.position.x = random(-2000, 2000);
        cssObj.position.y = random(-2000, 2000);
        cssObj.position.z = random(-2000, 2000);
        scene.value!.add(cssObj);
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
  }

  function initRenderer() {
    renderer.value = new CSS3DRenderer();
    renderer.value.setSize(rootWidth.value, rootHeight.value);
    rootRef.value!.appendChild(renderer.value.domElement);
  }

  function initControls() {
    controls.value = new TrackballControls(camera.value!, renderer.value!.domElement);
    controls.value.rotateSpeed = 0.5;
    controls.value.minDistance = 500;
    controls.value.maxDistance = 6000;
  }

  function render() {
    renderer.value!.render(scene.value!, camera.value!);
  }

  function animate() {
    controls.value?.update();
    render();
    requestAnimationFrame(animate);
  }

  wheneverEffectScope(() => rootRef.value && camera.value && scene.value && renderer.value, () => {
    watch([rootWidth, rootHeight], () => {
      camera.value!.aspect = rootWidth.value / rootHeight.value;
      camera.value!.updateProjectionMatrix();
      renderer.value!.setSize(rootWidth.value, rootHeight.value);
      render();
    });
  });

  wheneverEffectScope(controls, () => {
    controls.value!.addEventListener('change', render);
  });

  onMounted(() => {
    initCamera();
    initCard();
    initRenderer();
    initControls();
    transformToTable();
    animate();
  });
}

/**
 * 随机切换卡片内容和背景, 实现卡片闪烁效果
 */
export function useShine(props: LotteryProps) {
  const { cards, selectedCardsIndex } = useShared()!;
  const { isRotating } = useProvide()!;

  wheneverEffectScopeImmediate(() => props.shine && !!props.users.length && !!cards.value.length, () => {
    useIntervalFn(
      () => {
        if (isRotating.value) return;

        const shineCount = randomNatural(10, 20);

        for (let i = 0; i < shineCount; i++) {
          const index = randomNatural(0, total - 1);

          // 当前选中的卡片不进行切换
          if (selectedCardsIndex.value.includes(index)) {
            continue;
          }

          const user = props.users[randomNatural(0, props.users.length - 1)];
          const card = cards.value[index];

          updateCard(card, user);

          // 非高亮单元格切换背景
          if (!card.element.classList.contains('lightitem')) {
            updateCardBg(card);
          }
        }
      },
      500,
    );
  });
}
