<template>
  <Card v-if="route.query.error" style="background-color: #ffffff88">
    <template #content>
      <ErrorBox
        :error="`${route.query.error}: ${route.query.error_description}`"
      >
        <Button class="w3-button gdc-color-tonic" @click="goHome">
          Retourner au menu principal
        </Button>
      </ErrorBox>
    </template>
  </Card>
</template>

<script lang="ts" setup>
const { replace } = useRouter()

const route = useRoute();
if (!route.query.error) {
  replace('/')
}

const goHome = () => replace('/');
</script>
