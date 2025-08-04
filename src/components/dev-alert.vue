<template>
  <div class="dev-alert">
    <div class="icon">🛠️</div>
    <div class="text">
      <h2>¡Módulo en desarrollo!</h2>
      <p>Esta sección aún está en construcción. Pronto estará disponible.</p>
    </div>
  </div>
</template>

<script setup>
// No se requiere lógica por ahora
</script>

<style scoped>
.dev-alert {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 2px dashed #ff9800;
  background-color: #fff8e1;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  color: #e65100;
  font-family: sans-serif;
}

.icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.text h2 {
  margin: 0;
  font-size: 1.5rem;
}

.text p {
  margin: 0.5rem 0 0;
}
</style>