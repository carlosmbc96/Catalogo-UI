<template>
  <q-page class="q-pa-xl">
    <div class="row justify-between">
      <div v-if="permissionWrite('03')" class="col q-gutter-sm">
        <q-btn
          class="col"
          :disable="selected.length < 1"
          @click="deleteOperation"
          dense
          outline
          :loading="loading_delete"
          label="Eliminar"
          padding="xs md"
          :color="selected.length < 1 ? 'grey-14' : 'red-14'"
          icon="delete"
        >
          <template v-slot:loading>
            <q-spinner-dots size="2rem" color="grey-1" />
          </template>
        </q-btn>
        <q-fab
          style="width: 110px"
          :style="$q.screen.lt.sm ? 'display: flex' : ''"
          :disable="selected.length > 1"
          v-if="selected.length !== 1"
          v-model="type_actions_create"
          :color="selected.length > 1 ? 'grey-14' : 'light-green-14'"
          label="CREAR"
          square
          icon="add"
          direction="right"
        >
          <q-fab-action
            square
            :color="selected.length > 1 ? 'grey-14' : 'light-green-14'"
            @click="showDialogNewEdit('f')"
            label="FÍSICO"
          />
          <q-fab-action
            square
            :color="selected.length > 1 ? 'grey-14' : 'light-green-14'"
            @click="showDialogNewEdit('e')"
            label="EBOOK"
          />
          <q-fab-action
            square
            :color="selected.length > 1 ? 'grey-14' : 'light-green-14'"
            @click="showDialogNewEdit('a')"
            label="AUDIOLIBRO"
          />
          <q-fab-action
            square
            :color="selected.length > 1 ? 'grey-14' : 'light-green-14'"
            @click="showDialogNewEdit('apk')"
            label="APK"
          />
        </q-fab>
        <q-btn
          v-else
          class="col create-edit"
          :disable="selected.length > 1"
          dense
          label="Editar"
          padding="xs md"
          :color="selected.length > 1 ? 'grey-14' : 'light-green-14'"
          icon="create"
          @click="showDialogNewEdit"
        ></q-btn>
      </div>
    </div>
    <q-table
      :loading="loading_table"
      loading-label="Cargando..."
      no-results-label="No hay resultados que coincidan con su búsqueda..."
      title="Obras"
      dense
      class="q-my-md q-py-sm"
      :rows="rows"
      row-key="id"
      :columns="columns"
      v-model:pagination="pagination"
      selection="multiple"
      :filter="filter_"
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
            key="isbn"
          >
            {{ props.row.isbn }}
          </q-td>
          <q-td
            style="cursor: pointer"
            @click="onClick(props.row)"
            :props="props"
            key="titulo"
          >
            {{ props.row.titulo }}
          </q-td>
          <q-td
            style="cursor: pointer"
            @click="onClick(props.row)"
            :props="props"
            key="codigo"
          >
            {{ props.row.codigo }}
          </q-td>
          <q-td
            style="cursor: pointer"
            @click="onClick(props.row)"
            :props="props"
            key="tipo_trabajo"
          >
            {{ props.row.tipo_trabajo.nombre }}
          </q-td>
        </tr>
      </template>
      <template v-slot:top-right>
        <q-input
          hint="busca por título de la obra..."
          dense
          color="grey-7"
          outlined
          debounce="300"
          v-model="filter_"
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
      @close-form="(mode) => closeDialogNewEdit(mode)"
      @open-edit="openEdit"
      :item="selected[0]"
      :readonly="readonly"
      :show_dialog="show_form"
      :type_to_create="type_literary_work_to_create"
    ></form-dialog>
  </q-page>
</template>

<script>
import { ref, onBeforeMount } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import FormDialog from "../../components/admin/LiteraryWorks/FormDialog.vue";
import confirmDelete from "../../components/admin/generals/confirmDialog.vue";
import { useCounterStore } from "../../stores/example-store";
export default {
  name: "LiteraryWorksPage",
  components: {
    FormDialog,
  },
  setup() {
    const loading_delete = ref(false);
    const store = useCounterStore();
    const readonly = ref(false);
    const type_actions_create = ref(false);
    const loading_table = ref(false);
    const selected = ref([]);
    const show_form = ref(false);
    const rows = ref([]);
    const filter_ = ref("");
    const type_literary_work_to_create = ref("");
    const pagination = ref({
      sortBy: "asc",
      descending: true,
      page: 1,
      rowsPerPage: 50,
      rowsNumber: 0,
    });
    const $q = useQuasar();
    $q.screen.setSizes({ sm: 721 });
    const columns = ref([
      {
        name: "isbn",
        required: true,
        label: "ISBN",
        align: "left",
        field: (row) => (row.isbn_parte === null ? "-" : row.isbn),
        format: (val) => `${val}`,
      },
      {
        name: "titulo",
        required: true,
        label: "Título",
        align: "left",
        field: (row) => (row.titulo === null ? "" : row.titulo),
        format: (val) => `${val}`,
      },

      {
        name: "codigo",
        required: true,
        label: "Código",
        align: "left",
        field: (row) => (row.codigo === null ? "" : row.codigo),
        format: (val) => `${val}`,
        /* style: "max-width: 150px; overflow: hidden; text-overflow: ellipsis", */
      },
      {
        name: "tipo_trabajo",
        required: true,
        label: "Formato",
        align: "left",
        field: (row) =>
          row.tipo_trabajo.nombre === null ? "" : row.tipo_trabajo.nombre,
        format: (val) => `${val}`,
      },
    ]);

    onBeforeMount(() => {
      loadData(pagination.value.rowsPerPage, pagination.value.page);
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
          caption: `La obra se ${action_positive_txt} correctamente`,
          timeout: 2000,
        });
      } else {
        $q.notify({
          color: "negative",
          position: "bottom-right",
          iconColor: "negative",
          icon: "close",
          message: `Mensaje de Error`,
          caption: `Ha ocurrido un error en la ${action_negative_txt} de la obra`,
          timeout: 2000,
        });
      }
    }
    function onRequest(props) {
      loadData(
        props.pagination.rowsPerPage,
        props.pagination.page,
        props.filter
      );
    }
    async function loadData(rowsPerPage, page, filter = "") {
      loading_table.value = true;
      const json = {
        limit: rowsPerPage,
        page: page,
        order: "ASC",
        filter: filter,
      };
      try {
        const response = await api.post(`/obras`, json);
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
            message: "Está seguro que desea eliminar este(os) elemento(s)",
          },
        })
        .onOk(async () => {
          loading_delete.value = true;
          try {
            const response = await api.post("/obras/eliminar", {
              obra: selected.value,
            });
            if (typeof response.data === "string") {
              notify("eliminar", "error");
            } else {
              notify("eliminar", "success");
            }
            selected.value = [];
            filter_.value = "";
          } catch (error) {
            notify("eliminar", "error");
          } finally {
            selected.value = [];
            loadData(pagination.value.rowsPerPage, pagination.value.page);
            loading_delete.value = false;
          }
        })
        .onCancel(() => {
          selected.value = [];
        }).onDismiss;
    }

    function closeDialogNewEdit(mode) {
      if (mode !== "cancelar") {
        loadData(pagination.value.rowsPerPage, pagination.value.page);
      }
      show_form.value = !show_form.value;
      selected.value = [];
      readonly.value = false;
      type_literary_work_to_create.value = "";
    }

    function showDialogNewEdit(type) {
      if (type === "f") {
        type_literary_work_to_create.value = "f";
      } else if (type === "e") {
        type_literary_work_to_create.value = "e";
      } else if (type === "a") {
        type_literary_work_to_create.value = "a";
      } else if (type === "apk") {
        type_literary_work_to_create.value = "apk";
      }
      show_form.value = !show_form.value;
    }
    function openEdit() {
      show_form.value = !show_form.value;
      readonly.value = false;
      showDialogNewEdit();
    }

    return {
      openEdit,
      deleteOperation,
      readonly,
      onClick,
      loading_delete,
      loading_table,
      closeDialogNewEdit,
      permissionWrite,
      showDialogNewEdit,
      type_literary_work_to_create,
      show_form,
      notify,
      rows,
      columns,
      selected,
      type_actions_create,
      pagination,
      onRequest,
      filter_,
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
