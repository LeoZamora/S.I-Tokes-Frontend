<template>
    <div id="logo" class="pa-1 position-absolute" style="top: 50%; left: 50%; transform:translate(-50%, -50%)">
      <div class="d-flex flex-column align-center">
        <img src="/logoIZ.jpg" width="400"/>
        <h1>Bienvenido</h1>
        <h4 class="text-grey">Sistema de Información</h4>
      </div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style scoped>
@keyframes slideInFromRight {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

#logo {
  animation: slideInFromRight 2s;
}

</style>