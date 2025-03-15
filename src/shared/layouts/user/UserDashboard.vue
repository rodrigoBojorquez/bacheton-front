<template>
  <div class="flex flex-col h-full">
    <div class="flex-none">
      <h1>hola</h1>
      <TopBar />
    </div>
    <div class="flex flex-1">
      <SideBar />
      <div class="flex-1 p-4">
        <router-view />
      </div>
    </div>
  </div>
</template>
