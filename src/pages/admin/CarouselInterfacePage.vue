<template>
  <q-page class="q-pa-xl interfaz dialog-form">
    <div class="row col-12 q-pa-md q-gutter-lg">
      <div class="col-12" style="font-size: 30px">
        Elementos gestionables del Catálogo
      </div>
      <span class="section col-12">Encabezado del Carrusel</span>
      <div class="col-12">
        <div style="margin-bottom: 8px">Encabezado</div>
        <q-input
          :readonly="!permissionWrite('31')"
          v-model="form.titulo_carrusel"
          bg-color="grey-1"
          dense
          outlined
          color="grey-14"
        ></q-input>
      </div>
      <span class="section col-12">Carrusel de Obras</span>
      <div class="col-12 q-mb-md">
        <q-select
          :readonly="!permissionWrite('31')"
          bg-color="grey-1"
          dense
          outlined
          color="grey-14"
          map-options
          emit-value
          multiple
          use-input
          options-dense
          use-chips
          @filter="filterObras"
          option-label="titulo"
          option-value="id"
          v-model="form.obras_list"
          :options="obras"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Sin resultados
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <q-btn
        v-if="permissionWrite('31')"
        :loading="loading_btn_submit"
        style="border-radius: 10px; width: auto"
        class="col-1"
        color="light-green-14"
        @click="guardar"
        label="Guardar"
      >
        <template v-slot:loading>
          <q-spinner-dots color="white" size="2rem" />
        </template>
      </q-btn>
    </div>
  </q-page>
</template>

<script>
import { ref, watch, onBeforeMount } from "vue";
import { useQuasar, QSpinnerTail } from "quasar";
import { api } from "boot/axios";
import { useCounterStore } from "../../stores/example-store";

export default {
  name: "InterfacePage",
  setup() {
    const $q = useQuasar();
    const obras = ref([]);
    const loading_btn_submit = ref(false);
    const o = ref([]);
    const store = useCounterStore();

    const form = ref({
      id: null,
      obras_list: [],
    });

    onBeforeMount(async () => {
      $q.loading.show({
        spinner: QSpinnerTail,
      });
      try {
        const response = await api.get("/elementosInterfaz");
        form.value.titulo_carrusel = response.data[0].titulo_carrusel;
        form.value.id = response.data[0].id;
        form.value.obras_list =
          response.data[0].obras.length === 0 ? [] : response.data[0].obras;
      } catch (error) {
      } finally {
        const json = {
          limit: null,
          page: 1,
          order: "ASC",
          filter: "",
        };
        try {
          const response = await api.post("/expedientes", json);
          response.data.forEach((element) => {
            obras.value.push(element.obras[0]);
            o.value.push(element.obras[0]);
          });
        } catch (error) {
        } finally {
          $q.loading.hide();
        }
      }
    });
    function permissionWrite(codeToCheck) {
      return codeToCheck
        ? store.permissions.find((item) => item.code === codeToCheck)
        : true;
    }
    function filterObras(val, update) {
      if (val === "") {
        update(() => {
          obras.value = o.value;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        obras.value = o.value.filter(
          (v) => v.titulo.toLowerCase().indexOf(needle) > -1
        );
      });
    }

    async function guardar() {
      loading_btn_submit.value = true;
      const obras = [];
      form.value.obras_list.forEach((element) => {
        if (element.id) {
          obras.push(element.id);
        } else if (element !== "") obras.push(element);
      });
      const data = JSON.parse(JSON.stringify(form.value));
      data.obras_list = obras;
      try {
        const response = await api.post(
          "/elementosInterfaz/editarCarrusel",
          data
        );
        if (typeof response.data === "string") {
          $q.notify({
            color: "negative",
            position: "bottom-right",
            iconColor: "negative",
            icon: "close",
            message: `Mensaje de Error`,
            caption: `Ha ocurrido un error en la gestión de la sección carrusel del catálogo`,
            timeout: 2000,
          });
        } else {
          try {
            const response = await api.get("/elementosInterfaz");
            form.value.titulo_carrusel = response.data[0].titulo_carrusel;
            form.value.id = response.data[0].id;
            form.value.obras_list =
              response.data[0].obras.length === 0 ? [] : response.data[0].obras;
          } catch (error) {
          } finally {
          }
          $q.notify({
            color: "light-green-14",
            position: "bottom-right",
            icon: "done",
            iconColor: "positive",
            message: `Mensaje de Realizado`,
            caption: `La gestión de la sección carrusel del catálogo se guardó correctamente`,
            timeout: 2000,
          });
        }
      } catch (error) {
        $q.notify({
          color: "negative",
          position: "bottom-right",
          iconColor: "negative",
          icon: "close",
          message: `Mensaje de Error`,
          caption: `Ha ocurrido un error en la gestión de la sección carrusel del catálogo`,
          timeout: 2000,
        });
      } finally {
        loading_btn_submit.value = false;
      }
    }

    return {
      form,
      obras,
      permissionWrite,
      filterObras,
      guardar,
      loading_btn_submit,
    };
  },
};
</script>

<style scoped></style>
