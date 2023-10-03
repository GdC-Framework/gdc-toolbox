<template>
    <div style="display: flex; align-items: center; margin-left: auto">
        <InputSwitch v-model="isDark" />
    </div>
</template>

<script setup>
import InputSwitch from 'primevue/inputswitch'
import {useDark, useToggle} from '@vueuse/core'
const isDark = useDark();
const toggleDark = useToggle(isDark)
</script>