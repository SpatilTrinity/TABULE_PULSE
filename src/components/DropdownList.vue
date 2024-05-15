<template>
  <div>
    <q-btn flat no-caps :class="{ active: isActive }">
      <span class="text-weight-regular">
        <span class="text-bold text-subtitle1 q-pr-xs">{{ label }}</span>
        {{
          headerLabel.includes(label)
            ? "Insights"
            : label === "Know"
            ? "Your Tool"
            : "Analyzing"
        }}
      </span>
      <q-menu
        transition-show="scale"
        transition-hide="scale"
        ref="operationalInsightsDropdown"
      >
        <q-list dense bordered class="q-pa-sm" style="min-width: 250px">
          <q-item
            v-ripple
            clickable
            v-for="node in sortedList"
            :key="node.name"
            @click="navigate(node)"
            :class="{ disabled: userNodes.indexOf(node.name) === -1 }"
            @before-hide="showPerformance = false"
          >
            <q-item-section>
              <span
                class="text-body1"
                :class="{
                  'text-bold': userNodes.indexOf(node.name) !== -1,
                }"
                >{{ node.name }}</span
              >
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <div>
      <q-dialog v-model="targetModal" persistent>
        <q-card style="min-width: 70vw; min-height: 70vh; padding: 0px">
          <q-card-section style="padding: 0px">
            <q-card-section
              style="
                background-color: #dee2e6;
                text-align: left;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
              "
            >
              <div class="text-h6">
                <b>Offline Reports</b>
              </div>
              <q-icon
                name="close"
                color="black"
                size="24px"
                v-close-popup
                style="cursor: pointer"
              />
            </q-card-section>
          </q-card-section>
          <q-card-section style="padding: 0 10px">
            <q-tabs v-model="tab">
              <q-tab
                style="display: flex; justify-content: space-between"
                name="all"
                label="All"
              />
              <q-tab name="bookmarks" label="Bookmarks" />
            </q-tabs>
            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="all">
                <q-card-section style="padding: 0">
                  <div
                    class=""
                    style="
                      display: grid;
                      grid-template-columns: 3fr 1fr;
                      gap: 0.5em;
                    "
                  >
                    <q-input
                      ref="filterRef"
                      filled
                      v-model="filter"
                      @input="expandOnSearch()"
                      placeholder="Search the brands and files"
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
                  <q-card-section style="max-height: 50vh" class="scroll">
                    <div class="q-pa-md q-gutter-sm">
                      <q-tree
                        :nodes="spTreeData"
                        :filter="filter"
                        node-key="label"
                        connectors
                        class="black-connectors"
                        ref="spTree"
                        dense
                      >
                        <template v-slot:default-header="prop">
                          <div
                            class="row items-center"
                            style="
                              font-size: 14px;
                              font-family: Biryani, sans-serif;
                              display: flex;
                              align-items: center;
                              justify-content: space-between;
                            "
                          >
                            <q-icon
                              :name="prop.node.icon || 'share'"
                              color="black"
                              size="28px"
                              class="q-mr-sm"
                            ></q-icon>

                            <div @click="handleNodeClick(prop.node)">
                              <div class="">
                                <div class="">
                                  {{ prop.node.label }}
                                </div>
                              </div>
                            </div>
                          </div>
                          <q-rating
                            v-if="
                              prop.node.icon === 'folder' &&
                              no_rating_folders.indexOf(prop.node.label) === -1
                            "
                            @click.stop="bookMarkNode(prop.node)"
                            v-model="prop.node.isBookmark"
                            @click="bookMarkNode(prop.node)"
                            @update:model-value="getValue($event)"
                            size=""
                            :max="1"
                            color="black"
                            icon="star_border"
                            icon-selected="star"
                          />
                        </template>
                        <template v-slot:noNodes>
                          <div class="center-no-nodes">No nodes available.</div>
                        </template>
                      </q-tree>
                    </div>
                    <q-inner-loading :showing="loading">
                      <q-spinner size="30px" color="primary" />
                    </q-inner-loading>
                  </q-card-section>
                </q-card-section>
              </q-tab-panel>
              <q-tab-panel name="bookmarks">
                <Bookmark />
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
// import { mapState, mapMutations } from "vuex";
import { debounce } from "quasar";
import { ref } from "vue";
import config from "../config";
import Bookmark from "./Bookmark.vue";
import axios from "axios";

export default {
  components: { Bookmark },
  name: "DropdownList",
  props: ["label", "list", "activeLabel"],
  data() {
    return {
      tab: "all",
      no_rating_folders: [
        "Neuro",
        "Dysport",
        "Oncology",
        "Onivyde",
        "Somatuline NET",
        "Rare",
        "Increlex",
        "Somatuline ACRO",
        "Bylvay",
        "Sohonos",
        "Cross Business Unit",
        "Cross Oncology Brand",
      ],
      operationalInsightsDropdown: ref(false),
      menu: false,
      menuOver: false,
      listOver: false,
      showing: false,
      headerLabel: ["Business", "Customer", "Operational"],
      bookmarkData: [],
      q_rating: 0,
      targetModal: ref(false),
      showPerformance: false,
      spTreeData: [],
      bookMarkedLabels: [],
      loading: false,
      filter: "",
      btnName: "Expand All",
    };
  },
  computed: {
    ...mapState("APP", ["userNodes", "userReportTree", "userEmail"]),
    isActive() {
      return this.label === this.activeLabel;
    },
    sortedList() {
      let sorted = [];
      if (this.list && this.list.length) {
        this.list.forEach((el) => {
          if (this.userNodes.indexOf(el.name) === -1) {
            sorted.push(el);
          } else {
            sorted.unshift(el);
          }
        });
      }
      return sorted;
    },
  },
  methods: {
    ...mapMutations("APP", ["updateUserReports"]),
    // navigate(node) {
    //  if (this.userNodes.indexOf(node.name) > -1 && node.link) {
    //     if (
    //       ["KPI Catalogue","Targets","Offline Reports", "Data Dictionary"].includes(node.name)
    //     ) {
    //       window.open(node.link, "_blank");
    //     } else {
    //       this.$router.push(node.link);
    //     }
    //   }
    // },

    addIsBookmarkProperty(data, isBookmark = 0) {
      data.forEach((item) => {
        item.isBookmark = isBookmark;

        if (item?.children?.length > 0) {
          this.addIsBookmarkProperty(item.children, isBookmark);
        }
      });
    },
    expandOnSearch() {
      this.$refs.spTree[0].expandAll();
    },
    unBookmarkProperty(data, node) {
      return data.map((item) => {
        if (item.label === node.label) {
          return { ...item, isBookmark: 0 };
        }
        if (item?.children?.length > 0) {
          return {
            ...item,
            children: this.unBookmarkProperty(item.children, node),
          };
        }
        return item;
      });
    },
    comparePathLable(node) {
      let path = this.findPathToNode(this.spTreeData, node);
      let pathLabel = path.map((el) => el.label).join("/");
      let bookmarkLabel = this.bookMarkedLabels.map((el) => el.path);
      if (bookmarkLabel.includes(pathLabel)) {
        return true;
      } else {
        false;
      }
    },
    addBookmarkProperty(data) {
      return data.map((item) => {
        if (this.comparePathLable(item)) {
          return { ...item, isBookmark: 1 };
        }
        if (item?.children?.length > 0) {
          return {
            ...item,
            children: this.addBookmarkProperty(item.children),
          };
        }
        return item;
      });
    },
    expandCollapse() {
      if (this.btnName === "Expand All") {
        this.$refs.spTree[0].expandAll();
        this.btnName = "Collapse All";
      } else {
        this.$refs.spTree[0].collapseAll();
        this.btnName = "Expand All";
      }
    },
    navigate(node) {
      if (node.name === "Offline Reports") {
        this.loading = true;
        this.targetModal = true;
        this.$refs.operationalInsightsDropdown.hide();
        this.$store
          .dispatch("APP/GET_USER_REPORTS")
          .then(() => {
            this.spTreeData = this.userReportTree;
            this.addIsBookmarkProperty(this.spTreeData, 0);
            return axios.get(
              `${config.GET_BOOKMARKS}?email=${this.userEmail}`
              //`${config.GET_BOOKMARKS}?email=manish.chauhan.ext@ipsen.com`
            );
          })
          .then((resp) => {
            this.bookMarkedLabels = resp.data.data.map((el) => {
              return {
                label: el.lable,
                path: el.path,
              };
            });
            let finalData = this.addBookmarkProperty(this.spTreeData);
            this.spTreeData = finalData;
          })
          .finally(() => {
            this.loading = false;
          });
      }
      if (this.userNodes.indexOf(node.name) > -1 && node.link) {
        if (["KPI Catalogue", "Targets"].includes(node.name)) {
          window.open(node.link, "_blank");
        } else {
          this.$router.push(node.link);
        }
      }
    },
    bookMarkNode(node) {
      let payload = {
        bookmark_status: node.isBookmark == 1 ? "add" : "remove",
        email: this.userEmail,
        path: this.findPathToNode(this.spTreeData, node)
          .map((el) => el.label)
          .join("/"),
      };
      axios
        .post(`${config.ADD_REMOVE_BOOKMARK}`, payload)
        .then((resp) => {})
        .catch((error) => {
          let newData = this.unBookmarkProperty(
            this.spTreeData,
            node,
            node.isBookmark
          );
          this.$set(this, "spTreeData", newData);
          Notify.create({
            type: "negative",
            position: "bottom-left",
            message: "Something went wrong while fetching brand details",
          });
          reject(error);
        });
    },

    handleNodeClick(node) {
      const path = this.findPathToNode(this.spTreeData, node);
      let createPath = path.map((el) => el.label).join("/");
      if (createPath.split("/").length >= 4) {
        let url = `${config.DOWNLOAD_REPORT}?path=IDEA Reports/${createPath}&email=${this.userEmail}`;
        window.open(url, "_self");
      }
    },
    findPathToNode(tree, targetNode) {
      for (const node of tree) {
        if (node === targetNode) {
          return [node];
        }
        if (node.children) {
          const pathInSubtree = this.findPathToNode(node.children, targetNode);
          if (pathInSubtree) {
            return [node, ...pathInSubtree];
          }
        }
      }
      return null;
    },

    debounceFunc: debounce(function () {
      this.checkMenu();
    }, 100),
    checkMenu() {
      if (this.menuOver || this.listOver) {
        this.menu = true;
      } else {
        this.menu = false;
      }
    },
  },
  watch: {
    // menuOver(val) {
    //   this.debounceFunc();
    // },
    // listOver(val) {
    //   this.debounceFunc();
    // },
  },
};
</script>

<style lang="scss" scoped>
.q-btn.active {
  position: relative;
  border-radius: 0px;

  &::after {
    content: "";
    border-bottom: 4px solid $banner;
    margin-left: 25%;
    width: 50%;
  }
}
.q-tab-panel {
  padding: 16px 0;
  background: none !important;
}
.q-card__section--vert {
  padding: 10px;
}
.q-tab {
  padding: 0 16px;
  transition: color 0.3s, background-color 0.3s;
  white-space: nowrap;
  color: inherit;
  text-decoration: none;
}
.center-no-nodes {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin: 1em 0;
  color: #555;
}
.black-connectors {
  color: black;
}
.q-tree__icon,
.q-tree__node-header-content .q-icon {
  font-size: 30px;
}
</style>
