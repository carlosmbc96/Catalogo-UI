<template>
  <q-dialog v-model="show" persistent>
    <q-card class="q-pa-md dialog-form" style="width: 40vw">
      <q-form
        ref="form_ref"
        @submit="form.id ? action('editar') : action('crear')"
      >
        <q-card-section class="text-h6 text-bold">
          <div class="row items-center justify-between">
            <div v-if="!readonly_show" class="row justify-center">
              {{
                form.id
                  ? "Editar Usuario de la Editorial"
                  : "Crear Usuario de la Editorial"
              }}
            </div>
            <div v-else class="row justify-center">
              Detalles del Usuario de la Editorial
            </div>
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
          <div class="row items-center q-mb-xs" style="align-items: baseline">
            <div class="col-12 col-md">
              <span v-if="!readonly_show" class="require">*</span> Nombre:
            </div>
            <div class="col-12 col-md-7">
              <q-input
                v-model="form.nombre"
                dense
                :readonly="readonly_show"
                @keyup="exist"
                @update:model-value="
                  (v) => {
                    form.nombre = v.replace(
                      /[^a-zA-Z0-9-ÿÁÉÍÓÚáéíóú\u00f1\u00d1a ]/g,
                      ''
                    );
                  }
                "
                outlined
                color="grey-14"
                :rules="[$rules.required('Campo requerido'), exist]"
              ></q-input>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="admin-style">
          <q-btn
            outline
            @click="confirmChanges"
            label="Cancelar"
            class="q-px-sm"
            padding="sm sm"
            color="grey-14"
          ></q-btn>
          <q-btn
            v-if="!readonly_show"
            class="q-my-xs"
            padding="sm lg"
            type="submit"
            :disable="!disable()"
            :loading="loading_btn_submit"
            color="light-green-14"
            text-color="white"
            :label="form.id ? 'guardar cambios' : 'Crear'"
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
          <b>usuario</b>
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
const form = ref({ nombre: "" });
const old_nombre = ref("");
const show_confirm = ref(false);
const readonly_show = ref(false);

export default {
  name: "FormDialog",
  props: {
    show_dialog: Boolean,
    item: Object,
    readonly: Boolean,
  },
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
        old_nombre.value = this.item.nombre;
        form.value.nombre = this.item.nombre;
      } else {
        form.value.id = null;
        form.value.nombre = "";
      }
    },
  },
  setup(props, { emit }) {
    const loading_btn_submit = ref(false);
    const loading_input_id = ref(false);
    const all_items = ref([]);
    const item_ref = toRef(props, "item");

    onBeforeMount(async () => {
      show.value = toRef(props, "show_dialog");
      const json = {
        limit: null,
        page: 1,
        order: "ASC",
        filter: "",
      };
      try {
        const response = await api.post(`/usuariosObra`, json);
        all_items.value = response.data;
      } catch (error) {
        console.log(error);
      } finally {
      }
    });
    watch(show, async () => {
      const json = {
        limit: null,
        page: 1,
        order: "ASC",
        filter: "",
      };
      try {
        const response = await api.post(`/usuariosObra`, json);
        all_items.value = response.data;
      } catch (error) {
        console.log(error);
      } finally {
      }
    });
    function exist() {
      let found = false;
      if (old_nombre.value.toLowerCase() !== form.value.nombre.toLowerCase()) {
        let i = 0;
        while (!found && i < all_items.value.length) {
          if (
            all_items.value[i].nombre.toLowerCase() ==
            form.value.nombre.toLowerCase()
          ) {
            found = true;
          }
          i++;
        }
      }
      return !found || "Este nombre ya existe";
    }

    async function action(act) {
      loading_btn_submit.value = true;
      if (act === "editar") {
        try {
          const response = await api.put(`/usuariosObra/${act}`, form.value);
          if (typeof response.data === "string") {
            emit("action", "editar", "error");
          } else {
            emit("action", "editar", "success");
          }
        } catch (error) {
          console.log(error);
        } finally {
          loading_btn_submit.value = false;
          clearForm();
        }
      } else {
        try {
          const response = await api.post(`/usuariosObra/${act}`, form.value);
          if (typeof response.data === "string") {
            emit("action", "crear", "error");
          } else {
            emit("action", "crear", "success");
          }
        } catch (error) {
          console.log(error);
        } finally {
          loading_btn_submit.value = false;
          clearForm();
        }
      }
    }
    function disable() {
      return form.value.nombre;
    }
    function openEdit() {
      emit("openEdit");
    }
    function clearForm(mode) {
      emit("closeForm", mode);
      form.value.id = null;
      show_confirm.value = false;
      old_nombre.value = "";
      form.value.nombre = "";
    }
    function confirmChanges() {
      if (form.value.id) {
        if (form.value.nombre !== item_ref.value.nombre) {
          show_confirm.value = true;
        } else clearForm("cancelar");
      } else if (form.value.nombre) {
        show_confirm.value = true;
      } else clearForm("cancelar");
    }
    return {
      openEdit,
      show_confirm,
      confirmChanges,
      loading_btn_submit,
      show,
      action,
      clearForm,
      all_items,
      readonly_show,
      form,
      disable,
      exist,
      loading_input_id,
    };
  },
};
</script>
<style scoped>
.btn-add-author {
  max-width: 230px;
  align-self: center;
}
</style>
