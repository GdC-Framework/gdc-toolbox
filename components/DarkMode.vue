<template>
    <div style="display: flex; align-items: center; margin-left: auto; margin-left:1rem;">
        <InputSwitch v-model="isDark" />
        <i :class="isDark ? 'pi pi-moon' : 'pi pi-sun'" style="margin-left:0.5rem;font-size:1.5rem;" :style="isDark ? 'color:#F6F1D5' : 'color:#ebc834'" /> 
    </div>
</template>

<script setup>
import InputSwitch from 'primevue/inputswitch'
import {useDark} from '@vueuse/core'
const isDark = useDark();
</script>