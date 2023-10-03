<template>
  <div style="height: 100%; display: flex; flex-direction: column" :class="[isDark && 'darkmode']">
    <Toast />
    <ConfirmPopup />
    <DynamicDialog />

    <NavBar />
    <main style="flex: 1">
      <Card class="container">
        <template #content>
          <slot />
        </template>
      </Card>
    </main>
  </div>
</template>

<script setup>
import Toast from 'primevue/toast'
import ConfirmPopup from 'primevue/confirmpopup'
import DynamicDialog from 'primevue/dynamicdialog'
import Card from 'primevue/card'
import {useDark, useToggle} from '@vueuse/core'

const isDark = useDark();
</script>

<style>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  background-color: transparent;
  box-shadow: none;
}
.darkmode {
  background-color: rgba(75, 75, 75, .5);;
}
</style>
