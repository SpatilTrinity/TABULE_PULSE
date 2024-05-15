<template>
  <q-drawer v-model="rightDrawer" side="right" overlay elevated>
    <div class="q-pa-sm">
      <!-- <div class="text-overline">Notifications</div>
      <div class="text-center text-grey q-my-xl"></div> -->
      <q-list>
        <q-item class="q-pa-xs">
          <q-item-section>
            <q-item-label class="text-subtitle2">Notifications</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-btn
              flat
              round
              icon="highlight_off"
              @click="toggleRightSidebar"
            />
          </q-item-section>
        </q-item>
        <q-item
          clickable
          class="bg-blue-1 shadow-1 q-mb-sm q-pa-md"
          v-for="i in 3"
          :key="i"
        >
          <q-item-section top side>
            <q-icon
              :color="i % 2 !== 0 ? 'positive' : 'negative'"
              class="text-bold"
              :name="i % 2 !== 0 ? 'north' : 'south'"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label>Market Share is up 5%</q-item-label>
            <q-item-label caption lines="2"
              >Market share Q4'21 is up 5% compare to Q3'21</q-item-label
            >
            <q-item-label caption class="q-pt-sm items-center">
              <q-icon name="schedule" size="xs" />
              Jan 21 - 12:32pm
            </q-item-label>
          </q-item-section>

          <q-item-section side bottom>
            <q-icon name="arrow_circle_right" color="primary" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-drawer>
</template>

<script>
// import { mapState, mapMutations } from "vuex";

export default {
  name: "SideBar",
  computed: {
    // ...mapState("APP", ["rightDrawer"]),
  },
  methods: {
    // ...mapMutations("APP", ["toggleRightSidebar"]),
  },
};
</script>
