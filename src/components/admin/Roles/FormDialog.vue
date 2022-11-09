<template>
  <q-dialog v-model="show" persistent>
    <q-card class="q-pa-md dialog-form" style="min-width: 50vw">
      <q-form @submit="form.id ? action('editar') : action('crear')">
        <q-card-section class="text-h6 text-bold q-pb-xs">
          <div class="row items-center justify-between">
            <div v-if="!readonly_show" class="row justify-center">
              {{ form.id ? "Editar Rol" : "Crear Rol" }}
            </div>
            <div v-else class="row justify-center">Detalles del Rol</div>
            <q-btn
              dense
              flat
              round
              @click="confirmChanges"
              icon="close"
              style="position: absolute; right: 1px; top: 15px"
            ></q-btn>
          </div>
          <span v-if="!readonly_show" class="filters-empty"
            >Los campos marcados con un (</span
          >
          <span v-if="!readonly_show" class="require header">*</span>
          <span v-if="!readonly_show" class="filters-empty"
            >) son obligatorios</span
          >
        </q-card-section>
        <q-card-section>
          <div class="row items-center q-mb-xs" style="align-items: baseline">
            <div class="col-12 col-md">
              <span v-if="!readonly_show" class="require">*</span> Nombre:
            </div>
            <div class="col-12 col-md-7">
              <q-input
                v-model="form.name"
                dense
                :readonly="readonly_show"
                @keyup="existNombre"
                @update:model-value="
                  (v) => {
                    form.name = v.replace(
                      /[^0-9-a-zA-Z-ÿÁÉÍÓÚáéíóú\u00f1\u00d1a ]/g,
                      ''
                    );
                  }
                "
                color="grey-14"
                outlined
                :rules="[$rules.required('Campo requerido'), existNombre]"
              ></q-input>
            </div>
          </div>

          <div class="row items-center q-mb-lg">
            <div class="col-12 col-md">Descripción:</div>
            <div class="col-12 col-md-7">
              <q-input
                v-model="form.description"
                dense
                :readonly="readonly_show"
                type="textarea"
                outlined
                color="grey-14"
              ></q-input>
            </div>
          </div>

          <div class="row items-center q-mb-xs" style="align-items: baseline">
            <div class="col-12 col-md">
              <span v-if="!readonly_show" class="require">*</span> Permisos:
            </div>
            <div class="col-12 col-md-7">
              <q-select
                multiple
                :readonly="readonly_show"
                dense
                color="grey-14"
                use-chips
                map-options
                emit-value
                use-input
                options-dense
                option-label="name"
                @filter="fitlerPermissions"
                option-value="id"
                v-model="form.permissions"
                :options="permission"
                outlined
                :rules="[$rules.required('Campo requerido')]"
              />
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
          <b>rol</b>
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
const form = ref({ id: null });
const old_nombre = ref("");
const readonly_show = ref(false);
const show_confirm = ref(false);

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
        old_nombre.value = this.item.name;
        form.value.id = this.item.id;
        form.value.name = this.item.name;
        form.value.description = this.item.description;
        form.value.permissions = this.item.permissions;
      } else {
        form.value.id = null;
        form.value.name = "";
        form.value.description = "";
        form.value.permissions = [];
      }
    },
  },
  setup(props, { emit }) {
    const loading_btn_submit = ref(false);
    const loading_input_id = ref(false);
    const permission = ref([]);
    const permission_list = ref([]);
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
        const response = await api.post(`/rols`, json);
        all_items.value = response.data;
      } catch (error) {
        console.log(error);
      } finally {
      }
      try {
        permission_list.value = await api.post(`/permissions`, json);
        permission.value = permission_list.value.data;
      } catch (error) {}
    });
    watch(show, async () => {
      const json = {
        limit: null,
        page: 1,
        order: "ASC",
        filter: "",
      };
      try {
        const response = await api.post(`/rols`, json);
        all_items.value = response.data;
      } catch (error) {
        console.log(error);
      } finally {
      }
    });
    function fitlerPermissions(val, update) {
      if (val === "") {
        update(() => {
          permission.value = permission_list.value.data;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        permission.value = permission_list.value.data.filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1
        );
      });
    }
    function existNombre() {
      let found = false;
      if (old_nombre.value.toLowerCase() !== form.value.name.toLowerCase()) {
        let i = 0;

        while (!found && i < all_items.value.length) {
          if (
            all_items.value[i].name.toLowerCase() ==
            form.value.name.toLowerCase()
          ) {
            found = true;
          }
          i++;
        }
      }
      return !found || "Ya existe un rol con este nombre";
    }

    async function action(act) {
      loading_btn_submit.value = true;

      if (act === "editar") {
        const per = [];
        form.value.permissions.forEach((perm) => {
          if (perm.id) {
            per.push(perm.id);
          } else per.push(perm);
        });
        form.value.permissions = per;
        try {
          const response = await api.put(`/rols/${act}`, form.value);
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
          const response = await api.post(`/rols/${act}`, form.value);
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
      return form.value.name && form.value.permissions;
    }
    function clearForm(mode) {
      emit("closeForm", mode);
      form.value.id = null;
      old_nombre.value = "";
      show_confirm.value = false;
      delete form.value.description;
      delete form.value.name;
      delete form.value.permissions;
    }
    function confirmChanges() {
      if (form.value.id) {
        if (
          form.value.name !== item_ref.value.name ||
          form.value.description !== item_ref.value.description ||
          form.value.permissions !== item_ref.value.permissions
        ) {
          show_confirm.value = true;
        } else clearForm("cancelar");
      } else if (
        form.value.name ||
        form.value.description ||
        form.value.permissions
      ) {
        show_confirm.value = true;
      } else clearForm("cancelar");
    }
    function openEdit() {
      emit("openEdit");
    }
    return {
      openEdit,
      loading_btn_submit,
      show,
      action,
      show_confirm,
      confirmChanges,
      fitlerPermissions,
      clearForm,
      form,
      readonly_show,
      old_nombre,
      existNombre,
      loading_input_id,
      permission,
      disable,
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
