<template>
  <div class="">
    <div
      class=""
      style="display: grid; grid-template-columns: 3fr 1fr; gap: 0.5em"
    >
      <q-input
        ref="filterRef"
        @input="expandOnSearch()"
        filled
        v-model="filter"
        placeholder="Search the bookmarks"
      >
        <template v-slot:prepend>
          <q-btn flat size="lg" round icon="search" />
        </template>
      </q-input>
      <q-btn
        color="white"
        text-color="black"
        :disable="loading"
        @click="expandCollapse()"
      >
        {{ btnName }}
      </q-btn>
    </div>

    <q-tree
      :nodes="bookmarkData"
      node-key="label"
      connectors
      class="black-connectors"
      :filter="filter"
      dense
      no-nodes-label="No Bookmarks yet!"
      ref="bookmarkRef"
    >
      <template v-slot:default-header="prop">
        <div class="row items-center">
          <q-icon
            :name="prop.node.icon || 'share'"
            color="black"
            size="28px"
            class="q-mr-sm"
          ></q-icon>

          <div
            style="font-size: 16px; font-family: Biryani, sans-serif"
            @click="handleNodeClick(prop.node)"
          >
            {{ prop.node.label }}
          </div>
        </div>
      </template>
    </q-tree>

    <q-inner-loading :showing="loading">
      <q-spinner size="30px" color="primary" />
    </q-inner-loading>
  </div>
</template>

<script>
// import { mapState } from "vuex";
import { ref } from "vue";
import config from "src/config";
import axios from "axios";
export default {
  props: {
    open: Boolean,
  },
  // eslint-disable-next-line vue/multi-word-component-names
  name: "BookMark",
  data() {
    return {
      kpis: [],
      bookmarkTree: ref(false),
      filterRef: ref(true),
      filter: "",
      loading: false,
      btnName: "Expand All",
      bookmarkRef: ref(true),
    };
  },
  computed: {
    ...mapState("APP", ["userEmail"]),
  },
  methods: {
    getBookmarks() {
      this.loading = true;
      axios
        .get(`${config.GET_BOOKMARKS}?email=${this.userEmail}`)
        .then((resp) => {
          this.bookmarkData = resp.data.data;
        })
        .finally(() => {
          this.loading = false;
        })
        .catch((error) => {
          Notify.create({
            type: "negative",
            position: "bottom-left",
            message: "Something went wrong while fetching brand details",
          });
          reject(error);
        });
    },
    handleNodeClick(node) {
      if (node.icon === "description") {
        let createPath = `${node.path}`;
        let url = `${config.DOWNLOAD_REPORT}?path=IDEA Reports/${createPath}&email=${this.userEmail}`;
        window.open(url, "_self");
      }
    },
    expandOnSearch() {
      this.$refs.bookmarkRef.expandAll();
    },
    expandCollapse() {
      if (this.btnName === "Expand All") {
        this.$refs.bookmarkRef.expandAll();
        this.btnName = "Collapse All";
      } else {
        this.$refs.bookmarkRef.collapseAll();
        this.btnName = "Expand All";
      }
    },
  },
  mounted() {
    this.getBookmarks();
  },
};
</script>

<style scoped>
/* .center-no-nodes {
  display: flex;
  align-items: center !important;
  justify-content: center !important;
  height: 100%;
  margin: 1em 0;

}
.center-no-nodes div {
    color: #555;
  font-size: 16px;
  font-family: Biryani, sans-serif;
  text-align: center;
  padding-top: 30px;
} */
.black-connectors {
  color: black;
  text-align: center;
  padding-top: 30px;
}
</style>
