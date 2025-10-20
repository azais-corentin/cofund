<script lang="ts">
  import { Trash2, Pencil } from '@lucide/svelte';
  
  interface Props {
    children?: import('svelte').Snippet;
    onDelete: () => void;
    onEdit: () => void;
  }

  const { children, onDelete, onEdit }: Props = $props();

  let touchStartX = $state(0);
  let touchCurrentX = $state(0);
  let translateX = $state(0);
  let displayTranslateX = $state(0);
  let isSwiping = $state(false);
  let isActioning = $state(false);
  
  const SWIPE_THRESHOLD = 80;
  const ACTION_THRESHOLD = 120;
  const ANIMATION_DURATION = 300;

  function handleTouchStart(e: TouchEvent) {
    if (isActioning) return;
    touchStartX = e.touches[0].clientX;
    touchCurrentX = touchStartX;
    isSwiping = true;
  }

  function handleTouchMove(e: TouchEvent) {
    if (!isSwiping || isActioning) return;
    touchCurrentX = e.touches[0].clientX;
    const diff = touchCurrentX - touchStartX;
    
    if (diff > 0) {
      translateX = Math.min(diff, ACTION_THRESHOLD);
      displayTranslateX = translateX;
    } else {
      translateX = Math.max(diff, -ACTION_THRESHOLD);
      displayTranslateX = translateX;
    }
  }

  function handleTouchEnd() {
    if (!isSwiping || isActioning) return;
    isSwiping = false;

    if (translateX > ACTION_THRESHOLD) {
      handleDelete();
    } else if (translateX > SWIPE_THRESHOLD) {
      translateX = SWIPE_THRESHOLD;
      displayTranslateX = translateX;
    } else if (translateX < -ACTION_THRESHOLD) {
      handleEdit();
    } else if (translateX < -SWIPE_THRESHOLD) {
      translateX = -SWIPE_THRESHOLD;
      displayTranslateX = translateX;
    } else {
      translateX = 0;
      setTimeout(() => {
        displayTranslateX = 0;
      }, ANIMATION_DURATION);
    }
  }

  function handleDelete() {
    isActioning = true;
    translateX = window.innerWidth;
    displayTranslateX = translateX;
    
    setTimeout(() => {
      onDelete();
    }, ANIMATION_DURATION);
  }

  function handleEdit() {
    isActioning = true;
    translateX = -window.innerWidth;
    displayTranslateX = translateX;
    
    setTimeout(() => {
      onEdit();
    }, ANIMATION_DURATION);
  }

  function handleDeleteClick(e: MouseEvent) {
    e.stopPropagation();
    handleDelete();
  }

  function handleEditClick(e: MouseEvent) {
    e.stopPropagation();
    handleEdit();
  }
</script>

<div class="relative overflow-hidden">
  <div 
    class="absolute inset-0 bg-red-500 flex items-center justify-start px-6"
    class:hidden={displayTranslateX <= 0}
  >
    <button
      onclick={handleDeleteClick}
      class="text-white"
      aria-label="Delete expense"
    >
      <Trash2 class="size-6" />
    </button>
  </div>
  
  <div 
    class="absolute inset-0 bg-blue-500 flex items-center justify-end px-6"
    class:hidden={displayTranslateX >= 0}
  >
    <button
      onclick={handleEditClick}
      class="text-white"
      aria-label="Edit expense"
    >
      <Pencil class="size-6" />
    </button>
  </div>
  
  <div
    class="relative bg-card touch-pan-y"
    class:transition-transform={!isSwiping}
    class:duration-300={!isSwiping}
    class:ease-out={!isSwiping}
    style:transform="translateX({translateX}px)"
    ontouchstart={handleTouchStart}
    ontouchmove={handleTouchMove}
    ontouchend={handleTouchEnd}
  >
    {@render children?.()}
  </div>
</div>
