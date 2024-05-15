<template>
  <q-dialog persistent :value="open">
    <q-card style="width: 35%; max-width: 100vw; padding: 0">
      <q-toolbar class="text-dark">
        <q-toolbar-title class="text-subtitle1 text-bold">
          Configure KPIs
        </q-toolbar-title>
        <q-space />
        <q-btn flat round dense icon="close" @click="$emit('close')" />
      </q-toolbar>

      <q-separator />

      <q-card-section class="scroll">
        <q-list class="q-pa-md">
          <q-item>
            <q-item-section>
              <div class="text-dark text-body2">Brands</div>
              <q-select
                filled
                v-model="brand"
                :options="brandOptions"
                option-value="brand_id"
                option-label="brand_name"
                @input="getBrandKips"
                lazy-rules
                emit-value
                map-options
                :rules="[(val) => val || 'Please select Brand']"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-italic text-caption text-dark">
                      No Brands found to display
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <div class="text-dark text-body2">KPIs</div>
              <q-select
                use-chips
                filled
                multiple
                max-values="3"
                v-model="kpis"
                emit-value
                map-options
                :options="kpiOptions"
                option-value="kpi_id"
                option-label="kpi_name"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Please select KPIs',
                ]"
              >
                <template v-slot:hint>
                  Maximum 3 KPIs can be selected
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-italic text-caption text-dark">
                      No KPIs found to display
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-item-section>
          </q-item>
          <q-item class="q-mt-md">
            <q-item-section>
              <q-btn
                rounded
                :disable="loading"
                size="md"
                color="primary"
                @click="saveKpiMapping()"
                >Save</q-btn
              >
            </q-item-section>
          </q-item>
        </q-list>
        <q-inner-loading :showing="loading">
          <q-spinner size="30px" color="primary" />
        </q-inner-loading>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
// import { mapState, mapMutations } from "vuex";

export default {
  name: "ConfigureKpis",
  props: {
    open: Boolean,
  },
  computed: {
    ...mapState("APP", [
      "brandOptions",
      "kpiOptions",
      "selectedBrand",
      "userEmail",
    ]),
  },
  data() {
    return {
      kpis: [],
      loading: false,
      brand: "",
    };
  },
  methods: {
    ...mapMutations("APP", ["updateKPIDetails"]),
    saveKpiMapping() {
      const that = this;
      if (this.brand && this.kpis.length > 0) {
        this.loading = true;
        this.$store
          .dispatch("APP/SAVE_KPI_MAPPING", {
            brand_id: this.brand,
            kpi_ids: this.kpis,
            email: this.userEmail,
          })
          .then((resp) => {
            if (that.selectedBrand == that.brand) {
              this.updateKPIDetails(resp.data.data);
            }
            this.$q.notify({
              message: "KPI mappings has been updated successfully.",
              position: "bottom-left",
              type: "positive",
            });
          })
          .finally(() => (this.loading = false));
      }
    },
    getBrandKips(brand) {
      this.loading = true;
      this.kpis = [];
      this.$store.dispatch("APP/GET_BRAND_KPIS", brand).then(() => {
        this.loading = false;
      });
    },
  },
};
</script>

<style></style>
