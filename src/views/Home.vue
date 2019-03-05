<template>
  <div>
    <img alt="Coffee Time logo" width="200px" src="@/assets/cf-time.jpg">
    <SpingningBoard></SpingningBoard>
  </div>
</template>

<script>
import SpingningBoard from '@/components/SpinningBoard';

export default {
  name: 'Home',
  components: {
    SpingningBoard: SpingningBoard
  }
};
</script>
