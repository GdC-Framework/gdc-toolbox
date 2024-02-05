<template>
  <div>
    <SplitButton
      v-if="isAuthenticated"
      icon="pi pi-user"
      :label="user?.name || 'Unknown User'"
      :model="[
        { label: 'Se déconnecter', icon: 'pi pi-sign-out', command: logout },
      ]"
    />
    <Button label="Se connecter" icon="pi pi-sign-in" v-else @click="login" />
  </div>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue'
import Button from 'primevue/button'
import SplitButton from 'primevue/splitbutton'

const runtimeConfig = useRuntimeConfig();

const {
  loginWithRedirect,
  logout: logoutWithRedirect,
  isAuthenticated,
  user,
} = useAuth0()

const login = () => {
  const authorizationParams = {
    audience: runtimeConfig.public.AUTH0_API_IDENTIFIER,
    redirect_uri: `${window.location.origin}/auth`,
  }
  loginWithRedirect({ authorizationParams })
}
const logout = () => {
  logoutWithRedirect({ returnTo: `${window.location.origin}/auth` })
}
</script>
