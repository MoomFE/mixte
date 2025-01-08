import type * as THREE from 'three';
import type { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import type { CSS3DObject, CSS3DRenderer } from './CSS3DRenderer';
import type { User } from './types';
import { updateCard } from '@mixte/snippets/lottery/utils';
import { useRequest, watchImmediate, wheneverEffectScope } from '@mixte/use';
import { createInjectionState, useCssVar, useElementSize } from '@vueuse/core';
import { gsap } from 'gsap';
import { onceRun, random, randomNatural } from 'mixte';
import { computed, reactive, ref, watch } from 'vue';

export const rowCount = 7;
export const colCount = 17;
export const total = rowCount * colCount;

export const [
  useProvideStore,
  useStore,
] = createInjectionState(() => {
  const rootRef = ref<HTMLDivElement>();
  const { width: rootWidth, height: rootHeight } = useElementSize(rootRef);
  const vhValue = computed(() => rootHeight.value / 100);

  const camera = ref<THREE.PerspectiveCamera>();
  const scene = ref<THREE.Scene>();
  const renderer = ref<CSS3DRenderer>();
  const controls = ref<TrackballControls>();

  const cards = ref<CSS3DObject[]>([]);
  const targets = reactive({
    table: [] as THREE.Object3D[],
    sphere: [] as THREE.Object3D[],
    current: [] as THREE.Object3D[],
  });

  function render() {
    renderer.value!.render(scene.value!, camera.value!);
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

  function animate() {
    controls.value?.update();
    render();
    requestAnimationFrame(animate);
  }

  const isTable = computed(() => targets.current === targets.table);
  const isSphere = computed(() => targets.current === targets.sphere);

  const transform = useRequest((targets: THREE.Object3D[], duration: number) => {
    return new Promise<void>((resolve) => {
      const tl = gsap.timeline({
        onComplete: () => {
          resolve();
        },
      });

      for (let i = 0; i < cards.value.length; i++) {
        const card = cards.value[i];
        const target = targets[i];

        tl.to(card.position, {
          x: target.position.x,
          y: target.position.y,
          z: target.position.z,
          duration: random(duration, duration * 2) / 1000,
          ease: 'expo.inOut',
        }, 0);

        tl.to(card.rotation, {
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
    if (isTable.value) return;
    return transform.execute(targets.current = targets.table, duration);
  }
  function transformToSphere(duration = 2000) {
    if (isSphere.value) return;
    return transform.execute(targets.current = targets.sphere, duration);
  }

  const rotateGsap = ref<gsap.core.Tween>();
  const selectedCardIndex = ref<number[]>([]);

  const resetCard = onceRun((duration = 500) => {
    if (!selectedCardIndex.value.length) return Promise.resolve();

    return new Promise<void>((resolve) => {
      const tl = gsap.timeline({
        onComplete: () => {
          selectedCardIndex.value.forEach((index) => {
            const card = cards.value[index];
            card.element.classList.remove('prize');
          });
          selectedCardIndex.value = [];
          resolve();
        },
      });

      selectedCardIndex.value.forEach((index) => {
        const card = cards.value[index];
        const target = targets.current[index];

        // 位置动画
        tl.to(card.position, {
          x: target.position.x,
          y: target.position.y,
          z: target.position.z,
          duration: random(duration, duration * 2) / 1000,
          ease: 'expo.inOut',
        }, 0);

        // 旋转动画
        tl.to(card.rotation, {
          x: target.rotation.x,
          y: target.rotation.y,
          z: target.rotation.z,
          duration: random(duration, duration * 2) / 1000,
          ease: 'expo.inOut',
        }, 0);
      });
    });
  });

  const rotate = useRequest(() => {
    return new Promise<void>((resolve) => {
      resetCard().then(() => {
        scene.value!.rotation.y = 0;
        rotateGsap.value = gsap.to(scene.value!.rotation, {
          y: Math.PI * 6 * 1000,
          duration: 3000,
          onUpdate: render,
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
  });

  function stopRotate() {
    rotateGsap.value?.kill();
  }

  const selectCard = onceRun(async (users: User[], duration = 600) => {
    await resetCard();
    stopRotate();

    return new Promise<void>((resolve) => {
      const width = (12 * vhValue.value) + (2 * vhValue.value);
      const height = (16 * vhValue.value) + (2 * vhValue.value);
      const locates: { x: number; y: number }[] = [];
      const total = users.length;

      // 计算每行显示数量
      let colNum = 5; // 默认每行5个
      if (total > 15) {
        colNum = Math.ceil(total / 3); // 大于15个时，将总数/3作为每行数量
      }

      // 计算总行数
      const rowNum = Math.ceil(total / colNum);
      // 计算起始位置
      const startY = ((rowNum - 1) * height) / 2;

      while (selectedCardIndex.value.length < total) {
        const index = randomNatural(0, total - 1);
        if (!selectedCardIndex.value.includes(index))
          selectedCardIndex.value.push(index);
      }

      // 计算每个卡片的位置
      for (let row = 0; row < rowNum; row++) {
        const itemsInThisRow = Math.min(colNum, total - row * colNum);
        const startX = -((itemsInThisRow - 1) * width) / 2;

        for (let col = 0; col < itemsInThisRow; col++) {
          locates.push({
            x: startX + col * width,
            y: startY - row * height,
          });
        }
      }

      const tl = gsap.timeline({
        onComplete: () => {
          resolve();
        },
      });

      // 10 个以下, z = 2100; 每多 3 个, z - 88
      const z = total <= 10
        ? 2100
        : 2100 - Math.floor((total - 10) / 3) * 88;

      selectedCardIndex.value.forEach((cardIndex, index) => {
        const card = cards.value[cardIndex];
        const user = users[index];

        updateCard(card, user);

        // 添加到时间轴
        tl.to(card.position, {
          x: locates[index].x,
          y: locates[index].y,
          z,
          duration: duration / 1000,
          ease: 'expo.inOut',
        }, 0);

        tl.to(card.rotation, {
          x: 0,
          y: 0,
          z: 0,
          duration: duration / 1000,
          ease: 'expo.inOut',
        }, 0);

        card.element.classList.add('prize');
      });
    });
  });

  const vh = useCssVar('--mixte-lottery-vh', rootRef);

  watchImmediate(rootHeight, () => {
    vh.value = `${vhValue.value}px`;
  });

  return {
    rootRef,
    rootWidth,
    rootHeight,

    camera,
    scene,
    renderer,
    controls,

    cards,
    targets,
    isTable,
    isSphere,

    transformToTable: onceRun(transformToTable),
    transformToSphere: onceRun(transformToSphere),
    isTransforming: transform.isLoading,

    rotate: onceRun(rotate.execute),
    stopRotate,
    isRotating: rotate.isLoading,

    selectCard,
    resetCard,

    animate,
  };
});
