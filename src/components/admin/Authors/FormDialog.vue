<template>
  <q-dialog v-model="show" persistent full-width>
    <q-card class="q-pa-md dialog-form" style="padding-bottom: 60px !important">
      <q-form ref="formAutor">
        <q-card-section class="text-h6 text-bold">
          <div class="row items-center justify-between">
            <div v-if="!readonly_show" class="row justify-center">
              {{ form.id ? "Editar Autor" : "Crear Autor" }}
            </div>
            <div v-else class="row justify-center">Detalles del Autor</div>
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
            <div class="col-12 col-md-2">
              <span v-if="!readonly_show" class="require">*</span> Nombre y
              Apellidos:
            </div>
            <div class="col-12 col-md-10">
              <q-input
                v-model="form.nombre"
                dense
                @keyup="existNombre"
                :readonly="readonly_show"
                @update:model-value="
                  (v) => {
                    form.nombre = v.replace(
                      /[^a-zA-Z-ÿÁÉÍÓÚáéíóú\u00f1\u00d1a ]/g,
                      ''
                    );
                  }
                "
                bg-color="grey-1"
                color="grey-14"
                outlined
                :rules="[$rules.required('Campo requerido'), existNombre]"
              ></q-input>
            </div>
          </div>
          <div class="row items-center q-mb-md" style="align-items: baseline">
            <div class="col-12 col-md-2">Correo Electrónico:</div>
            <div class="col-12 col-md-10">
              <q-input
                v-model="form.correo"
                dense
                :readonly="readonly_show"
                outlined
                @keyup="existCorreo"
                bg-color="grey-1"
                color="grey-14"
                :rules="[$rules.email('Correo no válido'), existCorreo]"
              ></q-input>
            </div>
          </div>

          <div class="row items-center q-mb-md" style="align-items: baseline">
            <div class="col-12 col-md-2">Fecha de nacimiento:</div>
            <div class="col-12 col-md-10">
              <q-input
                readonly
                bg-color="grey-1"
                color="grey-14"
                outlined
                dense
                v-model="form.fecha_nacimiento"
                mask="date"
                style="width: fit-content"
              >
                <q-popup-proxy
                  v-if="!readonly_show"
                  ref="qDateProxy"
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                  style="min-width: 0px !important"
                >
                  <q-date
                    :readonly="readonly_show"
                    today-btn
                    :locale="myLocale"
                    v-model="form.fecha_nacimiento"
                    emit-immediately
                    v-close-popup="form.fecha_nacimiento != null ? true : false"
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Cerrar"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
                <template v-if="!readonly_show" v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        :readonly="readonly_show"
                        today-btn
                        :locale="myLocale"
                        v-model="form.fecha_nacimiento"
                        emit-immediately
                        v-close-popup="
                          form.fecha_nacimiento != null ? true : false
                        "
                      >
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Cerrar"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>

          <div class="row items-center q-mb-md">
            <div class="col-12 col-md-2">Biografía:</div>
            <div class="col-12 col-md-10">
              <q-input
                v-model="form.biografia"
                dense
                :readonly="readonly_show"
                type="textarea"
                bg-color="grey-1"
                color="grey-14"
                outlined
              ></q-input>
            </div>
          </div>
          <div class="row items-center q-mb-md">
            <div class="col-12 col-md-2">
              <span v-if="!readonly_show" class="require">*</span> Pequeña
              biografía:
            </div>
            <div class="col-12 col-md-10">
              <q-input
                v-model="form.peq_biografia"
                dense
                :readonly="readonly_show"
                counter
                maxlength="1000"
                type="textarea"
                outlined
                bg-color="grey-1"
                color="grey-14"
                :rules="[
                  $rules.required('Campo requerido'),
                  $rules.minLength(500, 'Mínimo 500 caracteres'),
                ]"
              ></q-input>
            </div>
          </div>
          <div class="row items-center q-mb-md" style="align-items: baseline">
            <div class="col-12 col-md-2">Redes Sociales:</div>
            <div class="col-12 col-md-10">
              <q-input
                v-model="form.redes"
                :readonly="readonly_show"
                dense
                bg-color="grey-1"
                color="grey-14"
                outlined
              ></q-input>
            </div>
          </div>
          <div class="row items-center q-mb-md">
            <div class="col-12 col-md-2">Foto de perfil:</div>
            <div class="col-12 col-md-10" style="height: 150px">
              <input
                v-if="!readonly_show"
                accept="image/*"
                id="file"
                type="file"
                @change="onFileChange"
                style="display: none"
              />
              <label class="file" for="file">
                <q-icon
                  v-if="url === null && !readonly_show"
                  size="40px"
                  name="add_photo_alternate"
                  style="color: white"
                />

                <img v-if="url !== null" class="img-perfil" :src="url" />
                <div class="hover">
                  <q-icon
                    @click.prevent="deleteImg"
                    v-if="url !== null && !readonly_show"
                    size="30px"
                    class="icon-file-delete"
                    name="delete"
                  />
                </div>
              </label>
            </div>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
    <div class="actions-btns admin-style">
      <div style="padding-right: 60px" class="row items-center q-gutter-x-md">
        <q-btn
          @click="confirmChanges"
          label="Cancelar"
          class="q-px-sm"
          outline
          padding="sm sm"
          color="grey-14"
        ></q-btn>
        <q-btn
          v-if="!readonly_show"
          class="q-my-xs"
          padding="sm lg"
          type="submit"
          :loading="loading_btn_submit"
          color="light-green-14"
          text-color="white"
          @click="form.id !== null ? action('editar') : action('crear')"
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
      </div>
    </div>
  </q-dialog>
  <q-dialog v-model="show_confirm" persistent>
    <q-card style="width: 330px">
      <q-card-section class="row items-center">
        <q-avatar icon="info" style="color: #2277aa" />
        <span class="q-ml-sm"
          >Hay
          <b>cambios</b>
          en los datos del
          <b>autor</b>
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
const url = ref(null);
const old_nombre = ref("");
const show_confirm = ref(false);
const old_correo = ref("");
const form = ref({
  id: "",
  fecha_nacimiento: "",
  nombre: "",
  biografia: "",
  peq_biografia: "",
  correo: "",
  redes: "",
  perfil: "",
});

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
        old_correo.value = this.item.correo;
        form.value.fecha_nacimiento = this.item.fecha_nacimiento;
        form.value.nombre = this.item.nombre;
        form.value.biografia = this.item.biografia;
        form.value.peq_biografia = this.item.peq_biografia;
        form.value.correo = this.item.correo;
        form.value.redes = this.item.redes;
        form.value.perfil = this.item.perfil;
        url.value =
          this.item.perfil !== null
            ? `${process.env.API}/storage/${this.item.perfil}`
            : null;
      } else {
        form.value.id = null;
        form.value.fecha_nacimiento = "";
        form.value.nombre = "";
        form.value.biografia = "";
        form.value.peq_biografia = "";
        form.value.correo = "";
        form.value.redes = "";
        form.value.perfil = "";
      }
    },
  },
  setup(props, { emit }) {
    const loading_btn_submit = ref(false);
    const all_items = ref([]);
    const formAutor = ref();
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
        const response = await api.post(`/autores`, json);
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
        const response = await api.post(`/autores`, json);
        all_items.value = response.data;
      } catch (error) {
        console.log(error);
      } finally {
      }
    });
    async function action(act) {
      const success = await formAutor.value.validate();
      if (success) {
        const data = new FormData();
        data.append("perfil", form.value.perfil);
        data.append("fecha_nacimiento", form.value.fecha_nacimiento);
        data.append("nombre", form.value.nombre);
        data.append("biografia", form.value.biografia);
        data.append("peq_biografia", form.value.peq_biografia);
        data.append("correo", form.value.correo);
        data.append("redes", form.value.redes);
        loading_btn_submit.value = true;
        if (act === "editar") {
          data.append("id", form.value.id);
          try {
            const response = await api.post(`/autores/${act}`, data);
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
            const response = await api.post(`/autores/${act}`, data);
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
    }
    function openEdit() {
      emit("openEdit");
    }
    function onFileChange(event) {
      form.value.perfil = event.target.files[0];

      if (form.value.perfil !== undefined) {
        url.value = URL.createObjectURL(form.value.perfil);
        return;
      } else {
        return;
      }
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
      return !found || "Ya existe un autor con este nombre";
    }
    function existCorreo() {
      if (old_correo.value !== null && form.value.correo !== null) {
        let found = false;
        if (
          old_correo.value.toLowerCase() !== form.value.correo.toLowerCase()
        ) {
          let i = 0;
          while (!found && i < all_items.value.length) {
            if (all_items.value[i].correo !== null) {
              console.log(
                all_items.value[i].correo.toLowerCase() ==
                  form.value.correo.toLowerCase()
              );
              if (
                all_items.value[i].correo.toLowerCase() ==
                form.value.correo.toLowerCase()
              ) {
                found = true;
              }
            }

            i++;
          }
        }
        return !found || "Ya existe un autor con este correo";
      }
    }
    function deleteImg() {
      form.value.perfil = "";
      url.value = null;
    }

    function clearForm(mode) {
      emit("closeForm", mode);
      form.value.id = null;
      form.value.fecha_nacimiento = "";
      form.value.nombre = "";
      form.value.biografia = "";
      form.value.peq_biografia = "";
      form.value.correo = "";
      form.value.redes = "";
      old_nombre.value = "";
      old_correo.value = "";
      form.value.perfil = "";
      url.value = null;
      show_confirm.value = false;
    }
    function confirmChanges() {
      if (form.value.id) {
        if (
          form.value.nombre !== item_ref.value.nombre ||
          form.value.biografia !== item_ref.value.biografia ||
          form.value.peq_biografia !== item_ref.value.peq_biografia ||
          form.value.correo !== item_ref.value.correo ||
          form.value.redes !== item_ref.value.redes ||
          form.value.fecha_nacimiento !== item_ref.value.fecha_nacimiento ||
          form.value.perfil !== item_ref.value.perfil
        ) {
          show_confirm.value = true;
        } else clearForm("cancelar");
      } else if (
        form.value.nombre ||
        form.value.biografia ||
        form.value.peq_biografia ||
        form.value.correo ||
        form.value.redes ||
        form.value.fecha_nacimiento ||
        form.value.perfil
      ) {
        show_confirm.value = true;
      } else clearForm("cancelar");
    }
    return {
      existNombre,
      show_confirm,
      confirmChanges,
      readonly_show,
      existCorreo,
      url,
      openEdit,
      formAutor,
      deleteImg,
      all_items,
      onFileChange,
      loading_btn_submit,
      show,
      action,
      clearForm,
      form,
      myLocale: {
        days: "Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_"),
        daysShort: "Dom_Lun_Mar_Mié_Jue_Vie_Sáb".split("_"),
        months:
          "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split(
            "_"
          ),
        monthsShort: "Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic".split(
          "_"
        ),
        firstDayOfWeek: 1,
        format24h: true,
        pluralDay: "dias",
      },
    };
  },
};
</script>
<style scoped>
.dialog-form {
  height: 85vh;
}
.actions-btns {
  height: 60px !important;
  width: 100% !important;
  position: relative !important;
  display: flex;
  bottom: 60px !important;
  background: white;
  border-radius: 0px 0px 4px 4px;
  -webkit-box-shadow: 0px -4px 3px rgba(50, 50, 50, 0.75);
  -moz-box-shadow: 0px -4px 3px rgba(50, 50, 50, 0.75);
  box-shadow: 0px 0px 8px #0000003d;
  justify-content: flex-end;
}
.btn-add-author {
  max-width: 230px;
  align-self: center;
}
</style>
