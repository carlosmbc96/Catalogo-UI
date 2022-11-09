<template>
  <q-card
    v-if="!$q.screen.lt.sm"
    class="login-card shadow-20 absolute-center row"
  >
    <q-card-section class="row col-5 logo flex-center q-pa-xl">
      <q-img
        width="100%"
        height="100px"
        fit="fill"
        class="image-login"
        src="~assets/LOGO_COLOR_3x.webp"
        no-spinner
      />
    </q-card-section>
    <q-card-section class="col-7 row justify-center items-center">
      <q-form @submit="login" @reset="onReset" class="q-gutter-md col-8">
        <div class="col-12 text-center title-login q-mb-sm">
          <span>Recuperar contraseña</span>
          <br />
          <span class="filters-empty text-no-wrap"
            >Se enviará un correo a esta dirección con un enlace para cambiar su
            contraseña</span
          >
        </div>
        <q-input
          dense
          outlined
          v-model="email"
          label="Correo *"
          type="email"
          lazy-rules
          :rules="[
            $rules.email('Correo no válido'),
            $rules.required('Campo requerido'),
          ]"
        />

        <div
          @click="$router.push({ name: 'login' })"
          class="col text-caption cursor-pointer"
          style="color: #5b5b5b !important; width: fit-content; float: left"
        >
          <q-icon name="arrow_back" />
          Iniciar Sesión
        </div>

        <div class="row justify-center q-mt-xl">
          <q-btn
            class="submit"
            label="Recuperar"
            unelevated
            type="submit"
            :loading="loading"
            color="primary"
            text-color="white"
          >
            <template v-slot:loading>
              <q-spinner-dots size="2rem" color="white" />
            </template>
          </q-btn>
        </div>
      </q-form>
    </q-card-section>
  </q-card>

  <q-card v-else class="login-card shadow-20 absolute-center row">
    <q-card-section class="col-12 row justify-center" style="padding: 0">
      <q-card-section class="row col-12 logo-mobile flex-center">
        <q-img
          width="100%"
          height="100px"
          fit="fill"
          class="image-login"
          src="~assets/LOGO_COLOR_3x.webp"
          no-spinner
        />
      </q-card-section>
      <q-form @submit="login" @reset="onReset" class="col-12 flex flex-center">
        <div style="width: 60%">
          <div class="col-12 text-center title-login q-mb-md">
            <span>Recuperar contraseña</span>
            <br />
            <span class="filters-empty text-no-wrap"
              >Se enviará un correo a esta dirección con un enlace para cambiar
              su contraseña</span
            >
          </div>
          <q-input
            dense
            outlined
            v-model="email"
            label="Correo *"
            type="email"
            lazy-rules
            :rules="[
              $rules.email('Correo no válido'),
              $rules.required('Campo requerido'),
            ]"
          />
          <div
            @click="$router.push({ name: 'login' })"
            class="col text-caption cursor-pointer"
            style="color: #5b5b5b !important; width: fit-content; float: left"
          >
            <q-icon name="arrow_back" />
            Iniciar Sesión
          </div>
          <div class="row justify-center q-mt-xl">
            <q-btn
              class="submit"
              label="Recuperar"
              unelevated
              type="submit"
              :loading="loading"
              color="primary"
              text-color="white"
            >
              <template v-slot:loading>
                <q-spinner-dots size="2rem" color="white" />
              </template>
            </q-btn>
          </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>
<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { api } from "boot/axios";

export default defineComponent({
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const email = ref(null);
    const loading = ref(false);
    $q.screen.setSizes({ sm: 1300 });

    async function login() {
      loading.value = true;
      try {
        const response = await api.post("restore_account", {
          email: email.value,
        });
        if (typeof response.data !== "string") {
          $q.notify({
            color: "light-green-14",
            position: "bottom-right",
            iconColor: "positive",
            icon: "done",
            message: `Mensaje de Realizado`,
            caption: `Se le ha enviado un correo para su cambio de contreseña, por favor revise`,
            timeout: 2000,
          });
        } else {
          if (response.data === "no usuario") {
            $q.notify({
              color: "negative",
              position: "bottom-right",
              iconColor: "negative",
              icon: "close",
              message: `Mensaje de Error`,
              caption: `Usuario no registrado en el sistema`,
              timeout: 2000,
            });
          } else {
            $q.notify({
              color: "negative",
              position: "bottom-right",
              iconColor: "negative",
              icon: "close",
              message: `Mensaje de Error`,
              caption: `Ha ocurrido un error con el servidor de correo`,
              timeout: 2000,
            });
          }
        }
        router.push({ name: "login" });
      } catch (error) {
        $q.notify({
          color: "negative",
          position: "bottom-right",
          iconColor: "negative",
          icon: "close",
          message: `Mensaje de Error`,
          caption: `Ha ocurrido un error con el servidor de correo`,
          timeout: 2000,
        });
        if (error.message === "Network Error") {
          $q.notify({
            color: "negative",
            position: "bottom-right",
            iconColor: "negative",
            icon: "close",
            message: `Mensaje de Error`,
            caption: `Verifique su conexión`,
            timeout: 2000,
          });
        }
      }
      loading.value = false;
    }
    return {
      login,
      loading,
      email,
    };
  },
});
</script>
<style scoped>
.login-card {
  width: 100%;
  max-width: 80vw;
  max-height: 80vh;
  height: 100%;
  border-radius: 10px;
}
.submit {
  max-width: 350px;
  width: 100%;
  background-color: #2375a9 !important;
}
.title-login {
  font-size: 20px;
  color: #5b5b5b;
  font-weight: 600;
}
.q-card__section.q-card__section--vert.col-5.inner-content {
  padding: 0;
}
.logo {
  background: radial-gradient(white, #97c5d2);
  border-radius: 10px 0px 0px 10px !important;
}
.logo-mobile {
  background: radial-gradient(white, #97c5d2);
  border-radius: 10px 10px 0px 0px !important;
  padding: 0px 125px;
}
</style>
