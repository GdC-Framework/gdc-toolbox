<template>
    <div style="display: flex; align-items: center; margin-left: auto; margin-left:1rem;">
        <InputSwitch v-model="isDark" />
        <img :src="isDark ? darkicon : lighticon" style="margin-left:0.5rem;" width="30"/> 
    </div>
</template>

<script setup>
import darkicon from '@/assets/img/dark-theme.svg'
import lighticon from '@/assets/img/light-theme.svg'
import InputSwitch from 'primevue/inputswitch'
import {useDark} from '@vueuse/core'
const isDark = useDark();
</script>