<template>
  <q-page class="q-pa-xl">
    <div class="row justify-between">
      <div v-if="permissionWrite('33')" class="col q-gutter-sm">
        <q-btn
          class="col"
          :disable="selected.length < 1"
          @click="deleteOperation"
          dense
          outline
          label="Eliminar"
          padding="xs md"
          :loading="loading_delete"
          :color="selected.length < 1 ? 'grey-14' : 'red-14'"
          icon="delete"
        >
          <template v-slot:loading>
            <q-spinner-dots size="2rem" color="grey-1" />
          </template>
        </q-btn>
        <q-btn
          class="col create-edit"
          :disable="selected.length > 1"
          dense
          :label="selected.length === 1 ? 'Editar' : 'Crear'"
          padding="xs md"
          :color="selected.length > 1 ? 'grey-14' : 'light-green-14'"
          :icon="selected.length === 1 ? 'create' : 'add'"
          @click="showDialogNewEdit"
        ></q-btn>
      </div>
      <!-- <div>
        <q-btn text-color="grey-14" dense flat icon="filter_alt"></q-btn>
        <q-btn text-color="grey-14" dense outline flat icon="apps"></q-btn>
      </div> -->
    </div>
    <q-table
      :loading="loading_table"
      loading-label="Cargando..."
      no-results-label="No hay resultados que coincidan con su búsqueda..."
      title="Usuarios"
      dense
      class="q-my-md q-py-sm"
      :rows="rows"
      row-key="id"
      :columns="columns"
      v-model:pagination="pagination"
      selection="multiple"
      :filter="filter"
      v-model:selected="selected"
      @request="onRequest"
      no-data-label="No hay resultados..."
      rows-per-page-label="Resultados por página"
      :rows-per-page-options="[50, 150, 300, 1000]"
      binary-state-sort
      :pagination-label="
        (firstRowIndex, endRowIndex, totalRowsNumber) => {
          return `${firstRowIndex}-${endRowIndex} de ${totalRowsNumber}`;
        }
      "
      :selected-rows-label="
        (numberOfRows) => {
          return numberOfRows > 1
            ? `${numberOfRows} filas seleccionadas`
            : `${numberOfRows} fila seleccionada`;
        }
      "
    >
      <template #body="props">
        <tr :props="props">
          <q-td>
            <q-checkbox dense v-model="props.selected" color="primary" />
          </q-td>
          <q-td
            style="cursor: pointer"
            @click="onClick(props.row)"
            :props="props"
            key="name"
          >
            {{ props.row.name }}
          </q-td>
          <q-td
            style="cursor: pointer"
            @click="onClick(props.row)"
            :props="props"
            key="email"
          >
            {{ props.row.email }}
          </q-td>
          <q-td
            style="cursor: pointer"
            @click="onClick(props.row)"
            :props="props"
            key="rol.name"
          >
            {{ props.row.rol.name }}
          </q-td>
        </tr>
      </template>
      <template v-slot:top-right>
        <q-input
          hint="busca por nombre y apellidos..."
          color="grey-7"
          dense
          outlined
          debounce="300"
          v-model="filter"
          placeholder="Buscar..."
          clearable
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
    <form-dialog
      @action="notify"
      @open-edit="openEdit"
      @close-form="(mode) => closeDialogNewEdit(mode)"
      :item="selected[0]"
      :readonly="readonly"
      :show_dialog="show_form"
    ></form-dialog>
  </q-page>
</template>

<script>
import { ref, onBeforeMount } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import FormDialog from "../../components/admin/Users/FormDialog.vue";
import confirmDelete from "../../components/admin/generals/confirmDialog.vue";
import { useCounterStore } from "../../stores/example-store";
export default {
  name: "UsersPage",
  components: {
    FormDialog,
  },
  setup() {
    const selected = ref([]);
    const loading_delete = ref(false);
    const readonly = ref(false);
    const store = useCounterStore();
    const loading_table = ref(false);
    const show_form = ref(false);
    const rows = ref([]);
    const filter = ref("");
    const pagination = ref({
      sortBy: "asc",
      descending: true,
      page: 1,
      rowsPerPage: 50,
      rowsNumber: 0,
    });
    const $q = useQuasar();
    const columns = ref([
      {
        name: "name",
        required: true,
        label: "Nombre y Apellidos",
        align: "left",
        field: (row) => (row.name === null ? "" : row.name),
        format: (val) => `${val}`,
      },
      {
        name: "email",
        required: true,
        label: "Correo Electrónico",
        align: "left",
        field: (row) => (row.email === null ? "" : row.email),
        format: (val) => `${val}`,
      },
      {
        name: "rol.name",
        required: true,
        label: "Rol",
        align: "left",
        field: (row) => (row.rol.name === null ? "" : row.rol.name),
        format: (val) => `${val}`,
      },
    ]);

    onBeforeMount(() => {
      getData(pagination.value.rowsPerPage, pagination.value.page);
    });
    function permissionWrite(codeToCheck) {
      return codeToCheck
        ? store.permissions.find((item) => item.code === codeToCheck)
        : true;
    }
    function onClick(row) {
      selected.value[0] = row;
      readonly.value = true;
      show_form.value = !show_form.value;
    }

    function notify(action, message) {
      let action_positive_txt = "";
      let action_negative_txt = "";
      if (action === "editar") {
        action_positive_txt = "editó";
        action_negative_txt = "edición";
      } else if (action === "crear") {
        action_positive_txt = "creó";
        action_negative_txt = "creación";
      } else {
        action_positive_txt = "eliminó";
        action_negative_txt = "eliminación";
      }
      if (message === "success") {
        $q.notify({
          color: "light-green-14",
          position: "bottom-right",
          icon: "done",
          iconColor: "positive",
          message: `Mensaje de Realizado`,
          caption: `El usuario se ${action_positive_txt} correctamente`,
          timeout: 2000,
        });
      } else {
        $q.notify({
          color: "negative",
          position: "bottom-right",
          iconColor: "negative",
          icon: "close",
          message: `Mensaje de Error`,
          caption: `Ha ocurrido un error en la ${action_negative_txt} del usuario`,
          timeout: 2000,
        });
      }
    }
    function onRequest(props) {
      getData(
        props.pagination.rowsPerPage,
        props.pagination.page,
        props.filter
      );
    }
    async function getData(rowsPerPage, page, filter = "") {
      loading_table.value = true;
      const json = {
        limit: rowsPerPage,
        page: page,
        order: "ASC",
        filter: filter,
      };
      try {
        const response = await api.post(`/users`, json);
        rows.value = response.data[0];
        pagination.value.rowsNumber = response.data[1];
        pagination.value.page = page;
        pagination.value.rowsPerPage = rowsPerPage;
      } catch (error) {
        console.log(error);
      } finally {
        loading_table.value = false;
      }
    }
    async function deleteOperation(id) {
      $q
        .dialog({
          component: confirmDelete,
          componentProps: {
            icon: "delete",
            message: "Está seguro que desea eliminar este(os) elemento(s)?",
          },
        })
        .onOk(async () => {
          loading_delete.value = true;
          const users_id = [];
          selected.value.forEach((user) => {
            users_id.push(user.id);
          });
          try {
            console.log(users_id);
            const response = await api.post("/users/eliminar", {
              users: users_id,
            });
            if (typeof response.data === "string") {
              notify("eliminar", "error");
            } else {
              notify("eliminar", "success");
            }
            selected.value = [];
          } catch (error) {
            console.log(error);
          } finally {
            getData(pagination.value.rowsPerPage, pagination.value.page);
            loading_delete.value = false;
          }
        })
        .onCancel(() => {
          selected.value = [];
        }).onDismiss;
    }

    function closeDialogNewEdit(mode) {
      if (mode !== "cancelar") {
        getData(pagination.value.rowsPerPage, pagination.value.page);
      }
      show_form.value = !show_form.value;
      selected.value = [];
      readonly.value = false;
    }

    function showDialogNewEdit() {
      show_form.value = !show_form.value;
    }
    function openEdit() {
      show_form.value = !show_form.value;
      readonly.value = false;
      showDialogNewEdit();
    }
    return {
      deleteOperation,
      openEdit,
      readonly,
      onClick,
      closeDialogNewEdit,
      showDialogNewEdit,
      show_form,
      loading_delete,
      permissionWrite,
      loading_table,
      rows,
      columns,
      notify,
      selected,
      pagination,
      onRequest,
      filter,
    };
  },
};
</script>

<style scoped>
.create-edit {
  width: 110px;
}
.colum-desc {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
