<template>
  <q-layout view="lHh Lpr lFf">
    <h1>Its rendering</h1>
    <AppHeader />
    <Sidebar />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
defineOptions({
  name: "MainLayout",
  components: {
    AppHeader: () => import("components/AppHeader.vue"),
    Sidebar: () => import("components/Sidebar.vue"),
  },
});
</script>
