<template>
  <div class="app-container home">
    <div class="center">
      <p>欢迎使用 {{system}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Index",
    data() {
      return {
        // 版本号
        version: "3.4.0",
        system: process.env.VUE_APP_TITLE
      };
    },
    methods: {
      goTarget(href) {
        window.open(href, "_blank");
      },
    },
  };
</script>

<style scoped lang="scss">
  .home {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  p {
    font-style: italic;
  }
</style>



