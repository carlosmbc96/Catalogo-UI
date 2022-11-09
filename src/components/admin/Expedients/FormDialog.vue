<template>
  <q-dialog v-model="show" persistent>
    <q-card
      class="q-pa-md"
      :class="[form.id ? 'dialog-form-edit' : 'dialog-form-create']"
      style="max-width: 60vw; width: 60vw"
    >
      <q-form @submit="form.id ? action('editar') : action('crear')">
        <q-card-section class="text-h6 text-bold">
          <div class="row items-center justify-between">
            <div v-if="!readonly_show" class="row justify-center">
              {{ form.id ? "Editar Expediente" : "Crear Expediente" }}
            </div>
            <div v-else class="row justify-center">Detalles del Expediente</div>
            <q-btn
              dense
              flat
              round
              @click="confirmChanges"
              icon="close"
              style="position: absolute; right: 1px; top: 15px"
            ></q-btn>
          </div>
        </q-card-section>
        <q-card-section>
          <div
            class="row items-center q-mb-xs expedient-list"
            style="align-items: baseline"
          >
            <div class="col-12 col-md">
              <span v-if="!readonly_show" class="require">*</span> Nombre:
            </div>
            <div class="col-12 col-md-9">
              <q-input
                v-model="form.nombre"
                dense
                :readonly="readonly_show"
                @focus="loadExp"
                @keyup="filterExp"
                outlined
                @update:model-value="
                  (v) => {
                    form.nombre = v.replace(
                      /[^0-9-a-zA-Z-ÿÁÉÍÓÚáéíóú\u00f1\u00d1a, ]/g,
                      ''
                    );
                  }
                "
                color="grey-14"
                :rules="[$rules.required('Campo requerido'), filterExp]"
              ></q-input>
            </div>
            <q-expansion-item
              v-if="form.id"
              v-model="expanded"
              icon="auto_stories"
              label="Obras"
              style="background: #f5f8ff"
              caption="Obras del expediente"
              class="col-12"
            >
              <q-card v-for="obra in form.obras" :key="obra.id">
                <q-card-section class="row">
                  <span class="col-10"><b>Título: </b>{{ obra.titulo }}</span>
                  <span class="col-2 text-right"
                    ><b>Formato: </b>{{ obra.tipo_trabajo.nombre }}</span
                  >
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="admin-style self-end">
          <q-btn
            outline
            @click="confirmChanges"
            label="Cancelar"
            class="q-px-sm"
            padding="sm sm"
            color="grey-14"
          >
          </q-btn>
          <q-btn
            v-if="!readonly_show"
            class="q-my-xs"
            padding="sm lg"
            type="submit"
            :disable="!disable()"
            :loading="loading_btn_submit"
            color="light-green-14"
            text-color="white"
            :label="form.id ? 'Guardar Cambios' : 'Crear'"
          >
            <template v-slot:loading>
              <q-spinner-dots size="2rem" color="white" />
            </template>
          </q-btn>
          <q-btn
            v-if="readonly_show"
            class="q-mr-md"
            style="border-radius: 10px"
            color="light-green-14"
            @click="openEdit"
            label="Editar"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <q-dialog v-model="show_confirm" persistent>
    <q-card style="width: 330px">
      <q-card-section class="row items-center">
        <q-avatar icon="info" style="color: #2277aa" />
        <span class="q-ml-sm"
          >Hay
          <b>cambios</b>
          en los datos del
          <b>expediente</b>
          , si cancela la
          {{ form.id ? "edición" : "creación" }}, se <b>perderán</b>, desea
          continuar?</span
        >
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" v-close-popup style="color: #2277aa" />
        <q-btn
          flat
          label="Continuar"
          @click="clearForm('cancelar')"
          style="color: #2277aa"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { ref, toRef, onBeforeMount, watch } from "vue";
import { api } from "boot/axios";

const show = ref(false);
const readonly_show = ref(false);
const show_confirm = ref(false);
const form = ref({});
const old_nombre = ref("");

export default {
  name: "FormDialog",
  props: ["show_dialog", "item", "readonly"],
  watch: {
    show_dialog() {
      show.value = this.show_dialog;
    },
    readonly() {
      readonly_show.value = this.readonly;
    },
    item() {
      if (this.item && this.item.id) {
        form.value.id = this.item.id;
        form.value.nombre = this.item.nombre;
        old_nombre.value = this.item.nombre;
        form.value.obras = this.item.obras;
      } else {
        form.value.id = null;
        form.value.nombre = "";
      }
    },
  },
  setup(props, { emit }) {
    const loading_btn_submit = ref(false);
    const loading_input_exp = ref(false);
    const all_exp = ref([]);
    const expanded = ref(false);
    const item_ref = toRef(props, "item");

    onBeforeMount(() => {
      show.value = toRef(props, "show_dialog");
    });
    watch(show, async () => {
      const json = {
        limit: null,
        page: 1,
        order: "ASC",
        filter: "",
      };
      try {
        const response = await api.post(`/expedientes`, json);
        all_exp.value = response.data;
      } catch (error) {
        console.log(error);
      } finally {
      }
    });

    function confirmChanges() {
      if (form.value.id) {
        if (form.value.nombre !== item_ref.value.nombre) {
          show_confirm.value = true;
        } else clearForm("cancelar");
      } else if (form.value.nombre) {
        show_confirm.value = true;
      } else clearForm("cancelar");
    }

    async function loadExp() {
      const json = {
        limit: null,
        page: 1,
        order: "ASC",
        filter: "",
      };
      try {
        const response = await api.post(`/expedientes`, json);
        all_exp.value = response.data;
      } catch (error) {
        console.log(error);
      } finally {
      }
    }

    function filterExp() {
      let found = false;
      if (old_nombre.value.toLowerCase() !== form.value.nombre.toLowerCase()) {
        let i = 0;
        while (!found && i < all_exp.value.length) {
          if (
            all_exp.value[i].nombre.toLowerCase() ===
            form.value.nombre.toLowerCase()
          ) {
            found = true;
          }
          i++;
        }
      }
      return !found || "Este expediente ya existe";
    }

    async function action(act) {
      loading_btn_submit.value = true;
      if (act === "editar") {
        try {
          const response = await api.put(`/expedientes/${act}`, form.value);
          if (typeof response.data === "string") {
            emit("action", "editar", "error");
          } else {
            emit("action", "editar", "success");
          }
        } catch (error) {
          emit("action", "editar", "error");
        } finally {
          loading_btn_submit.value = false;
          clearForm();
        }
      } else {
        try {
          const response = await api.post(`/expedientes/${act}`, form.value);
          if (typeof response.data === "string") {
            emit("action", "crear", "error");
          } else {
            emit("action", "crear", "success");
          }
        } catch (error) {
          emit("action", "crear", "error");
        } finally {
          loading_btn_submit.value = false;
          clearForm();
        }
      }
    }

    function disable() {
      return form.value.nombre;
    }

    function clearForm(mode) {
      emit("closeForm", mode);
      form.value.id = null;
      form.value.nombre = "";
      old_nombre.value = "";
      show_confirm.value = false;
      expanded.value = false;
    }

    function openEdit() {
      emit("openEdit");
    }

    return {
      loading_btn_submit,
      openEdit,
      confirmChanges,
      show,
      show_confirm,
      readonly_show,
      action,
      expanded,
      clearForm,
      form,
      disable,
      loadExp,
      filterExp,
      loading_input_exp,
    };
  },
};
</script>
<style scoped>
.dialog-form-edit {
  height: 45vh;
}

.btn-add-author {
  max-width: 230px;
  align-self: center;
}
</style>
