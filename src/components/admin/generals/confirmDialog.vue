<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="q-dialog-plugin">
      <q-card-section class="row items-center">
        <div class="col-3">
          <q-avatar
            :icon="icon"
            class=""
            color="negative"
            text-color="white"
            v-if="icon"
          />
        </div>
        <span class="col-8 q-ml-sm">{{ message }}</span>
      </q-card-section>
      <q-card-actions align="right" class="admin-style">
        <q-btn
          dense
          outline
          label="Cancelar"
          color="red-14"
          @click="onDialogCancel"
        />
        <q-btn
          dense
          label="Aceptar"
          color="light-green-14"
          @click="onOKClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent } from "quasar";
export default {
  name: "ConfirmDialog",
  props: {
    icon: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  emits: [...useDialogPluginComponent.emits],

  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent();
    return {
      dialogRef,
      onDialogHide,
      onDialogCancel,
      onOKClick() {
        // on OK, it is REQUIRED to
        // call onDialogOK (with optional payload)
        onDialogOK();
        // or with payload: onDialogOK({ ... })
        // ...and it will also hide the dialog automatically
      },
    };
  },
};
</script>
