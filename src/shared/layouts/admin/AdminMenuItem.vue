<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import type { PropType } from 'vue';
import { useRoute } from 'vue-router';
import { useLayoutStore } from '@/core/stores/useLayoutStore';
import type { MenuItem } from '@/core/types/auth.ts' // CAMBIO AQUÍ

defineOptions({
  name: 'app-menu-item'
});

// interface MenuItem {
//   label?: string;
//   icon?: string;
//   to?: string;
//   url?: string;
//   target?: string;
//   class?: string;
//   visible?: boolean;
//   disabled?: boolean;
//   command?: (args: { originalEvent: MouseEvent; item: MenuItem }) => void;
//   items?: MenuItem[];
// }

const route = useRoute();
const layoutStore = useLayoutStore(); // USAMOS EL STORE

const props = defineProps({
  item: {
    type: Object as PropType<MenuItem>,
    default: () => ({})
  },
  index: {
    type: Number,
    default: 0
  },
  root: {
    type: Boolean,
    default: true
  },
  parentItemKey: {
    type: String as PropType<string | null>,
    default: null
  }
});

const isActiveMenu = ref<boolean>(false);
const itemKey = ref<string | null>(null);

onBeforeMount(() => {
  itemKey.value = props.parentItemKey
    ? props.parentItemKey + '-' + props.index
    : String(props.index);

  const activeItem = layoutStore.layoutState.activeMenuItem as string;
  isActiveMenu.value =
    activeItem === itemKey.value ||
    !!(activeItem && activeItem.startsWith(itemKey.value + '-'));
});

watch(
  () => layoutStore.layoutState.activeMenuItem as string,
  (newVal: string) => {
    isActiveMenu.value =
      newVal === itemKey.value || !!(newVal && newVal.startsWith(itemKey.value + '-'));
  }
);

function itemClick(event: MouseEvent, item: MenuItem): void {
  // if (item.disabled) {
  //   event.preventDefault();
  //   return;
  // }

  if ((item.link) && (layoutStore.layoutState.staticMenuMobileActive || layoutStore.layoutState.overlayMenuActive)) {
    layoutStore.toggleMenu(); // USAMOS FUNCIONES DEL STORE
  }

  if (item.command) {
    item.command({ originalEvent: event, item });
  }

  const foundItemKey = item.items
    ? (isActiveMenu.value ? props.parentItemKey : itemKey)
    : itemKey.value;
  layoutStore.setActiveMenuItem(foundItemKey);
}

function checkActiveRoute(item: MenuItem): boolean {
  return route.path === item.link;
}
</script>


<template>
  <li :class="{ 'layout-root-menuitem': root, 'active-menuitem': isActiveMenu }">
    <div v-if="root" class="layout-menuitem-root-text">
      {{ item.name }}
    </div>
    <a
      v-if="(!item.link || item.items)"
        :href="item.link"
        @click="itemClick($event, item)"
        :class="item.class"
        tabindex="0"
      >
        <i :class="item.icon" class="layout-menuitem-icon"></i>
        <span class="layout-menuitem-text">{{ item.name }}</span>
        <i class="pi pi-fw pi-angle-down layout-submenu-toggler" v-if="item.items"></i>
      </a>
      <router-link
        v-if="item.link && !item.items"
        @click="itemClick($event, item)"
        :class="[item.class, { 'active-route': checkActiveRoute(item) }]"
        tabindex="0"
        :to="item.link"
      >
        <i :class="item.icon" class="layout-menuitem-icon"></i>
        <span class="layout-menuitem-text">{{ item.name }}</span>
        <i class="pi pi-fw pi-angle-down layout-submenu-toggler" v-if="item.items"></i>
      </router-link>
      <Transition v-if="item.items" name="layout-submenu">
        <ul v-show="root ? true : isActiveMenu" class="layout-submenu">
          <app-menu-item
            v-for="(child, i) in item.items"
            :key="child.name || i"
            :index="i"
            :item="child"
            :parentItemKey="itemKey"
            :root="false"
          />
        </ul>
      </Transition>
    </li>
  </template>

<style lang="scss" scoped>
/* Tus estilos aquí */
</style>
