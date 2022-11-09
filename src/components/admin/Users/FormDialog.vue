<template>
  <q-dialog v-model="show" persistent>
    <q-card
      class="q-pa-md"
      :class="[form.id === null ? dialog_form_create : dialog_form_edit]"
      style="width: 40vw"
    >
      <q-form @submit="form.id ? action('editar') : action('crear')">
        <q-card-section class="text-h6 text-bold">
          <div class="row items-center justify-between">
            <div v-if="!readonly_show" class="row justify-center">
              {{ form.id ? "Editar Usuario" : "Crear Usuario" }}
            </div>
            <div v-else class="row justify-center">Detalles del Usuario</div>
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
          <div class="row items-center q-mb-md" style="align-items: baseline">
            <div class="col-12 col-md">
              <span v-if="!readonly_show" class="require">*</span> Nombre y
              Apellidos:
            </div>
            <div class="col-12 col-md-7">
              <q-input
                v-model="form.name"
                :readonly="readonly_show"
                dense
                @keyup="existUser"
                @update:model-value="
                  (v) => {
                    form.name = v.replace(
                      /[^a-zA-Z-ÿÁÉÍÓÚáéíóú\u00f1\u00d1a ]/g,
                      ''
                    );
                  }
                "
                outlined
                color="grey-14"
                :rules="[$rules.required('Campo requerido'), existUser]"
              ></q-input>
            </div>
          </div>

          <div class="row items-center q-mb-md" style="align-items: baseline">
            <div class="col-12 col-md">
              <span v-if="!readonly_show" class="require">*</span> Correo
              Electrónico:
            </div>
            <div class="col-12 col-md-7">
              <q-input
                v-model="form.email"
                dense
                :readonly="readonly_show"
                @keyup="existCorreo"
                :loading="loading_input_id"
                color="grey-14"
                outlined
                :rules="[
                  $rules.required('Campo requerido'),
                  $rules.email('Correo no válido'),
                  existCorreo,
                ]"
              ></q-input>
            </div>
          </div>

          <div
            class="row items-center q-mb-md"
            v-if="form.id === null"
            style="align-items: baseline"
          >
            <div class="col-12 col-md">
              <span v-if="!readonly_show" class="require">*</span> Contraseña:
            </div>
            <div class="col-12 col-md-7">
              <q-input
                v-model="form.password"
                dense
                :readonly="readonly_show"
                outlined
                counter
                :type="isPwd ? 'password' : 'text'"
                color="grey-14"
                :rules="[
                  (val) =>
                    /^(?=.*[0-9])(?=.*[:!@#$%^&,¡;¿/|?`=+~'<>')()}{*])(?=.*[A-Z])[a-zA-Z0-9:!@#$%^&,¡;¿/|?`=+~'<>')()}{*]/.test(
                      val
                    ) ||
                    'Debe contener al menos una letra mayúscula, un símbolo y un número',
                  $rules.required('Campo requerido'),
                  $rules.minLength(8, 'Debe tener 8 caracteres como mínimo'),
                ]"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </div>
          </div>

          <div
            class="row items-center q-mb-md roles"
            style="align-items: baseline"
          >
            <div class="col-12 col-md">
              <span v-if="!readonly_show" class="require">*</span> Rol:
            </div>
            <div class="col-12 col-md-7">
              <q-select
                dense
                :readonly="readonly_show"
                behavior="menu"
                v-model="form.rol_id"
                option-label="name"
                :options="rols"
                option-value="id"
                map-options
                emit-value
                outlined
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
const form = ref({ id: null });
const old_email = ref("");
const show_confirm = ref(false);
const old_name = ref("");
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
        console.log("editar");
        form.value.id = this.item.id;
        form.value.name = this.item.name;
        form.value.email = this.item.email;
        old_email.value = this.item.email;
        old_name.value = this.item.name;
        form.value.password = this.item.password;
        form.value.rol_id = this.item.rol;
      } else {
        console.log("crear");
        form.value.id = null;
        form.value.name = "";
        form.value.email = "";
        old_email.value = "";
        old_name.value = "";
        form.value.password = "";
        form.value.rol_id = "";
      }
    },
  },
  setup(props, { emit }) {
    const loading_btn_submit = ref(false);
    const loading_input_id = ref(false);
    const isPwd = ref(true);
    const rols = ref([]);
    const users = ref([]);
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
        rols.value = response.data;
      } catch (error) {}
      try {
        const response = await api.post(`/users`, json);
        users.value = response.data;
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
        const response = await api.post(`/users`, json);
        users.value = response.data;
      } catch (error) {
        console.log(error);
      } finally {
      }
    });
    function existCorreo() {
      let found = false;
      if (old_email.value.toLowerCase() !== form.value.email.toLowerCase()) {
        let i = 0;
        while (!found && i < users.value.length) {
          if (
            users.value[i].email.toLowerCase() ===
            form.value.email.toLowerCase()
          ) {
            found = true;
          }
          i++;
        }
      }
      return !found || "Este correo está en uso";
    }
    function existUser() {
      let found = false;
      if (old_name.value.toLowerCase() !== form.value.name.toLowerCase()) {
        let i = 0;
        while (!found && i < users.value.length) {
          if (
            users.value[i].name.toLowerCase() === form.value.name.toLowerCase()
          ) {
            found = true;
          }
          i++;
        }
      }
      return !found || "Este usuario ya existe";
    }

    async function action(act) {
      loading_btn_submit.value = true;
      if (act === "editar") {
        if (form.value.rol_id.id) {
          form.value.rol_id = form.value.rol_id.id;
        } else form.value.rol_id = form.value.rol_id;
        try {
          const response = await api.put(`/users/${act}`, form.value);
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
          const response = await api.post(`/users/${act}`, form.value);
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
      if (form.value.id === null) {
        return (
          form.value.name &&
          form.value.email &&
          form.value.password &&
          form.value.rol_id
        );
      } else {
        return form.value.name && form.value.email && form.value.rol_id;
      }
    }
    function clearForm(mode) {
      emit("closeForm", mode);
      form.value.id = null;
      form.value.name = "";
      delete form.value.email;
      old_email.value = "";
      old_name.value = "";
      form.value.password = "";
      delete form.value.rol_id;
      show_confirm.value = false;
      isPwd.value = true;
    }
    function confirmChanges() {
      if (form.value.id) {
        if (
          form.value.name !== item_ref.value.name ||
          form.value.email !== item_ref.value.email ||
          form.value.rol_id !== item_ref.value.rol
        ) {
          show_confirm.value = true;
        } else clearForm("cancelar");
      } else if (form.value.name || form.value.email || form.value.rol_id) {
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
      clearForm,
      form,
      disable,
      readonly_show,
      existCorreo,
      existUser,
      loading_input_id,
      isPwd,
      rols,
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
