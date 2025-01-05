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
export const resolution = 1;

export const [
  useProvideStore,
  useStore,
] = createInjectionState(() => {
  const rootRef = ref<HTMLDivElement>();
  const { width: rootWidth, height: rootHeight } = useElementSize(rootRef);

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

      // 确保渲染更新
      gsap.ticker.add(render);
      // 动画结束后移除渲染器
      tl.call(() => {
        gsap.ticker.remove(render);
      });
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

      // 确保渲染更新
      gsap.ticker.add(render);
      // 动画结束后移除渲染器
      tl.call(() => {
        gsap.ticker.remove(render);
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
      const width = 140;
      const locates: { x: number; y: number }[] = [];
      let tag = -(users.length - 1) / 2;

      while (selectedCardIndex.value.length < users.length) {
        const index = randomNatural(0, total - 1);

        if (!selectedCardIndex.value.includes(index))
          selectedCardIndex.value.push(index);
      }

      // 计算位置信息, 大于5个分两排显示
      if (users.length > 5) {
        const yPosition = [-87, 87];
        const l = selectedCardIndex.value.length;
        const mid = Math.ceil(l / 2);

        tag = -(mid - 1) / 2;
        for (let i = 0; i < mid; i++) {
          locates.push({ x: tag * width * resolution, y: yPosition[0] * resolution });
          tag++;
        }

        tag = -(l - mid - 1) / 2;
        for (let i = mid; i < l; i++) {
          locates.push({ x: tag * width * resolution, y: yPosition[1] * resolution });
          tag++;
        }
      }
      else {
        for (let i = selectedCardIndex.value.length; i > 0; i--) {
          locates.push({ x: tag * width * resolution, y: 0 * resolution });
          tag++;
        }
      }

      const tl = gsap.timeline({
        onComplete: () => {
          resolve();
        },
      });

      selectedCardIndex.value.forEach((cardIndex, index) => {
        const card = cards.value[cardIndex];
        const user = users[index];

        updateCard(card, user);

        // 添加到时间轴
        tl.to(card.position, {
          x: locates[index].x,
          y: locates[index].y * resolution,
          z: 2200,
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

      // 每帧更新渲染
      gsap.ticker.add(render);
      // 动画结束后移除渲染器
      tl.call(() => {
        gsap.ticker.remove(render);
      });
    });
  });

  const vh = useCssVar('--mixte-lottery-vh', rootRef);

  watchImmediate(rootHeight, () => {
    vh.value = `${rootHeight.value / 100}px`;
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
