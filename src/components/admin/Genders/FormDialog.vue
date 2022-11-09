<template>
  <q-dialog v-model="show" persistent>
    <q-card class="q-pa-md dialog-form" style="width: 40vw">
      <q-form @submit="form.id ? action('editar') : action('crear')">
        <q-card-section class="text-h6 text-bold">
          <div class="row items-center justify-between">
            <div v-if="!readonly_show" class="row justify-center">
              {{ form.id ? "Editar Género" : "Crear Género" }}
            </div>
            <div v-else class="row justify-center">Detalles del Género</div>
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
              <span v-if="!readonly_show" class="require">*</span>
              Identificador:
            </div>
            <div class="col-12 col-md-7">
              <q-input
                v-model="form.numero"
                dense
                readonly
                @keyup="exist"
                @update:model-value="
                  (v) => {
                    form.numero = v.replace(/[^0-9]/g, '');
                  }
                "
                color="grey-14"
                outlined
                :rules="[$rules.required('Campo requerido'), exist]"
              ></q-input>
            </div>
          </div>

          <div class="row items-center q-mb-xs" style="align-items: baseline">
            <div class="col-12 col-md">
              <span v-if="!readonly_show" class="require">*</span> Nombre:
            </div>
            <div class="col-12 col-md-7">
              <q-input
                v-model="form.nombre"
                dense
                :readonly="readonly_show"
                @keyup="existNombre"
                @update:model-value="
                  (v) => {
                    form.nombre = v.replace(
                      /[^a-zA-Z-ÿÁÉÍÓÚáéíóú\u00f1\u00d1a ]/g,
                      ''
                    );
                  }
                "
                outlined
                color="grey-14"
                :rules="[$rules.required('Campo requerido'), existNombre]"
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
          <b>género</b>
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
import { ref, onBeforeMount, watch, toRef } from "vue";
import { api } from "boot/axios";

const form = ref({ id: null });
const old_numero = ref("");
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
    readonly() {
      readonly_show.value = this.readonly;
    },
    item() {
      if (this.item && this.item.id) {
        form.value.id = this.item.id;
        old_numero.value = this.item.numero;
        old_nombre.value = this.item.nombre;
        form.value.numero = this.item.numero;
        form.value.nombre = this.item.nombre;
      } else {
        form.value.id = null;
        form.value.numero = "";
        form.value.nombre = "";
      }
    },
  },
  setup(props, { emit }) {
    const loading_btn_submit = ref(false);
    const loading_input_id = ref(false);
    const show = toRef(props, "show_dialog");
    const all_items = ref([]);
    const item_ref = toRef(props, "item");

    onBeforeMount(async () => {
      const json = {
        limit: null,
        page: 1,
        order: "ASC",
        filter: "",
      };
      try {
        const response = await api.post(`/generos`, json);
        all_items.value = response.data;
        all_items.value.sort(function (a, b) {
          return a.numero - b.numero;
        });
      } catch (error) {
        console.log(error);
      } finally {
        if (form.value.id === null) {
          let jump = false;
          if (all_items.value.length === 0) {
            jump = true;
            form.value.numero = 1;
          } else {
            if (all_items.value[0].numero !== 1) {
              jump = true;
              form.value.numero = 1;
            } else {
              for (let i = 0; i < all_items.value.length; i++) {
                if (
                  all_items.value[i].id !==
                  all_items.value[all_items.value.length - 1].id
                ) {
                  if (
                    all_items.value[i].numero + 1 !==
                    all_items.value[i + 1].numero
                  ) {
                    jump = true;
                    form.value.numero = all_items.value[i].numero + 1;
                    break;
                  }
                }
              }
            }
            if (!jump) {
              form.value.numero =
                all_items.value[all_items.value.length - 1].numero + 1;
            }
          }
        }
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
        const response = await api.post(`/generos`, json);
        all_items.value = response.data;
        all_items.value.sort(function (a, b) {
          return a.numero - b.numero;
        });
      } catch (error) {
        console.log(error);
      } finally {
        if (form.value.id === null) {
          let jump = false;
          if (all_items.value.length === 0) {
            jump = true;
            form.value.numero = 1;
          } else {
            if (all_items.value[0].numero !== 1) {
              jump = true;
              form.value.numero = 1;
            } else {
              for (let i = 0; i < all_items.value.length; i++) {
                if (
                  all_items.value[i].id !==
                  all_items.value[all_items.value.length - 1].id
                ) {
                  if (
                    all_items.value[i].numero + 1 !==
                    all_items.value[i + 1].numero
                  ) {
                    jump = true;
                    form.value.numero = all_items.value[i].numero + 1;
                    break;
                  }
                }
              }
            }
            if (!jump) {
              form.value.numero =
                all_items.value[all_items.value.length - 1].numero + 1;
            }
          }
        }
      }
    });
    function openEdit() {
      emit("openEdit");
    }
    function exist() {
      let found = false;
      if (old_numero.value !== Number(form.value.numero)) {
        let i = 0;
        while (!found && i < all_items.value.length) {
          if (all_items.value[i].numero == form.value.numero) {
            found = true;
          }
          i++;
        }
      }
      return !found || "Este identificador ya existe";
    }

    function existNombre() {
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
      return !found || "Ya existe una temática con este nombre";
    }

    async function action(act) {
      loading_btn_submit.value = true;
      if (act === "editar") {
        try {
          const response = await api.put(`/generos/${act}`, form.value);
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
          const response = await api.post(`/generos/${act}`, form.value);
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
      return form.value.nombre && form.value.numero;
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
    function clearForm(mode) {
      emit("closeForm", mode);
      form.value.id = null;
      old_numero.value = "";
      show_confirm.value = false;
      old_nombre.value = "";
      form.value.numero = "";
      form.value.nombre = "";
    }

    return {
      openEdit,
      loading_btn_submit,
      show,
      action,
      show_confirm,
      confirmChanges,
      readonly_show,
      clearForm,
      old_numero,
      all_items,
      form,
      disable,
      exist,
      existNombre,
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
