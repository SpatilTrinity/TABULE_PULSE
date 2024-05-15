<template>
  <q-header class="bg-white text-black">
    <q-toolbar>
      <q-toolbar-title class="flex q-py-md">
        <img
          class="cursor-pointer"
          src="img/logo.png"
          @click="$router.push('/')"
        />
      </q-toolbar-title>

      <!-- <q-space /> -->

      <div
        class="GL__toolbar-link text-body2 text-weight-bold row items-center no-wrap q-mr-xl"
      >
        <DropdownList
          label="Business"
          :list="nodes.businessNodes"
          :activeLabel="activeLabel"
        />
        <DropdownList
          label="Customer"
          :list="nodes.customerNodes"
          :activeLabel="activeLabel"
        />
        <DropdownList
          label="Operational"
          :list="nodes.operationalNodes"
          :activeLabel="activeLabel"
        />
      </div>

      <!-- <q-space /> -->
      <div
        class="q-pl-sm q-gutter-sm row items-center no-wrap"
        v-if="firstName"
      >
        <q-btn v-if="$q.screen.gt.sm" dense flat round icon="help_outline">
          <!-- @click="openUserGuide()" -->
          <q-tooltip :offset="[5, 5]" class="text-subtitle1" max-width="180px">
            For any queries please email to Ideasupport@ipsen.com
          </q-tooltip>
        </q-btn>
        <q-btn dense flat round icon="notifications">
          <!-- @click="toggleRightSidebar" -->
          <q-tooltip :offset="[5, 5]" class="text-subtitle1" max-width="150px">
            Feature would be the part of future release
          </q-tooltip>
          <q-badge color="red" class="q-pt-xs" rounded floating>0</q-badge>
        </q-btn>
        <q-btn flat rounded no-wrap no-caps class="bg-grey-11 items-center">
          <q-icon v-if="$q.screen.gt.sm" name="arrow_drop_down" size="20px" />
          <span class="q-pr-sm q-pl-xs q-pt-xs" v-if="$q.screen.gt.sm">{{
            firstName
          }}</span>
          <q-avatar round size="35px">
            <!-- <img :src="`img/users/${userData.image}`" /> -->
            <q-icon name="account_circle" />
          </q-avatar>

          <q-menu
            anchor="bottom end"
            self="top end"
            transition-show="scale"
            transition-hide="scale"
          >
            <div class="row no-wrap text-center q-pa-md" style="width: 320px">
              <div class="col">
                <q-avatar size="72px">
                  <!-- <img :src="`img/users/${userData.image}`" /> -->
                  <q-icon name="account_circle" size="72px" />
                </q-avatar>
                <div class="text-subtitle1 q-mt-md q-mb-sm">
                  {{ userName }}
                </div>
                <div class="">
                  <div class="text-caption q-mb-sm">
                    <!-- <q-icon size="xs" name="email" class="q-pr-sm" /> -->
                    {{ userEmail }}
                  </div>
                  <q-btn
                    v-close-popup
                    color="primary"
                    flat
                    rounded
                    no-caps
                    @click="configureKpis = true"
                  >
                    <q-icon size="xs" name="settings" class="q-pr-sm" />
                    <span class="q-mt-xs">Configure KPIs</span>
                  </q-btn>
                </div>

                <q-separator inset class="q-my-md" />

                <q-btn
                  outline
                  no-caps
                  color="negative"
                  label="Sign Out"
                  class="full-width"
                  size="md"
                  @click="logout()"
                />
              </div>
            </div>
          </q-menu>
        </q-btn>
      </div>
    </q-toolbar>
    <ConfigureKpis
      v-if="configureKpis"
      :open="configureKpis"
      @close="configureKpis = !configureKpis"
    />
  </q-header>
</template>

<script>
// import { mapState, mapMutations } from "vuex";
import DropdownList from "./DropdownList.vue";
import ConfigureKpis from "./ConfigureKpis.vue";
import { logout } from "boot/msalAD";

export default {
  name: "AppHeader",
  components: { DropdownList, ConfigureKpis },
  data() {
    return {
      activeLabel: "",
      configureKpis: false,
    };
  },
  computed: {
    /*     ...mapState("APP", [
      "nodes",
      "userData",
      "userName",
      "userEmail",
      "firstName",
    ]), */
  },
  mounted() {
    this.checkActiveClass();
  },
  methods: {
    // ...mapMutations("APP", ["toggleRightSidebar"]),
    checkActiveClass() {
      let path = window.location.pathname.split("/")[1];
      if (path === "business") this.activeLabel = "Business";
      else if (path === "customer") this.activeLabel = "Customer";
      else if (path === "operational") this.activeLabel = "Operational";
      else return (this.activeLabel = "");
    },
    logout() {
      localStorage.clear();
      this.$q.loading.show();
      logout();
    },
    openUserGuide() {
      window.open(
        "https://ipsengroup.sharepoint.com/:p:/r/sites/woa/_layouts/15/Doc.aspx?sourcedoc=%7B78B63343-72E2-4C71-AF80-07956D8FDA20%7D&file=IDEA%20Portal%20Videos.pptx&action=edit&mobileredirect=true",
        "_blank"
      );
    },
  },
  watch: {
    $route(to, from) {
      this.checkActiveClass();
    },
  },
};
</script>
