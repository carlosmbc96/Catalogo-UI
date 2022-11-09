<template>
  <q-page class="q-pa-xl interfaz dialog-form">
    <div class="row col-12 q-pa-md q-gutter-lg">
      <div class="col-12" style="font-size: 30px">
        Elementos gestionables del Catálogo
      </div>
      <span class="section col-12">Contenido de Cabecera</span>
      <div class="col-12">
        <div style="margin-bottom: 8px">Título</div>
        <q-input
          v-model="form.titulo"
          bg-color="grey-1"
          :readonly="!permissionWrite('29')"
          dense
          outlined
          color="grey-14"
        ></q-input>
      </div>
      <div class="col-12">
        <div style="margin-bottom: 8px">Eslogan</div>
        <q-input
          v-model="form.eslogan"
          :readonly="!permissionWrite('29')"
          bg-color="grey-1"
          dense
          outlined
          color="grey-14"
        ></q-input>
      </div>

      <q-btn
        v-if="permissionWrite('29')"
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
import { ref, onBeforeMount } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import { useCounterStore } from "../../stores/example-store";

export default {
  name: "InterfacePage",
  setup() {
    const $q = useQuasar();
    const store = useCounterStore();

    const loading_btn_submit = ref(false);

    const form = ref({
      id: null,
      titulo: null,
      eslogan: null,
    });

    onBeforeMount(async () => {
      try {
        const response = await api.get("/elementosInterfaz");
        form.value.titulo = response.data[0].titulo;
        form.value.eslogan = response.data[0].eslogan;
        form.value.id = response.data[0].id;
      } catch (error) {
      } finally {
      }
    });
    function permissionWrite(codeToCheck) {
      return codeToCheck
        ? store.permissions.find((item) => item.code === codeToCheck)
        : true;
    }
    async function guardar() {
      loading_btn_submit.value = true;
      try {
        const response = await api.post(
          "/elementosInterfaz/editarCabecera",
          form.value
        );
        if (typeof response.data === "string") {
          $q.notify({
            color: "negative",
            position: "bottom-right",
            iconColor: "negative",
            icon: "close",
            message: `Mensaje de Error`,
            caption: `Ha ocurrido un error en la gestión de la sección inicial del catálogo`,
            timeout: 2000,
          });
        } else {
          $q.notify({
            color: "light-green-14",
            position: "bottom-right",
            icon: "done",
            iconColor: "positive",
            message: `Mensaje de Realizado`,
            caption: `La gestión de la sección inicial del catálogo se guardó correctamente`,
            timeout: 2000,
          });
        }
        form.value.titulo = response.data.titulo;
        form.value.eslogan = response.data.eslogan;
      } catch (error) {
        $q.notify({
          color: "negative",
          position: "bottom-right",
          iconColor: "negative",
          icon: "close",
          message: `Mensaje de Error`,
          caption: `Ha ocurrido un error en la gestión de la sección inicial del catálogo`,
          timeout: 2000,
        });
      } finally {
        loading_btn_submit.value = false;
      }
    }
    return {
      form,
      guardar,
      permissionWrite,
      loading_btn_submit,
    };
  },
};
</script>

<style scoped></style>
