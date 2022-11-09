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
        <div class="col-12 text-center title-login q-mb-xl">
          <span>Inicia Sesión</span>
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

        <q-input
          dense
          outlined
          v-model="password"
          :type="isPwd ? 'password' : 'text'"
          label="Contraseña *"
          lazy-rules
          :rules="[$rules.required('Campo requerido')]"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <div
          @click="$router.push({ name: 'forgot' })"
          class="col-3 column text-caption cursor-pointer"
          style="
            color: #5b5b5b !important;
            width: fit-content;
            float: right;
            margin: auto;
          "
          :class="isSmallScreen ? 'items-center' : 'items-end'"
        >
          ¿Has olvidado tu contraseña?
        </div>

        <div class="row justify-center q-mt-xl">
          <q-btn
            class="submit"
            label="Iniciar"
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
            <span>Inicia Sesión</span>
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

          <q-input
            dense
            outlined
            v-model="password"
            :type="isPwd ? 'password' : 'text'"
            label="Contraseña *"
            lazy-rules
            :rules="[$rules.required('Campo requerido')]"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <div
            @click="$router.push({ name: 'forgot' })"
            class="col-3 column text-caption cursor-pointer"
            style="
              color: #5b5b5b !important;
              width: fit-content;
              float: right;
              margin: auto;
            "
            :class="isSmallScreen ? 'items-center' : 'items-end'"
          >
            ¿Has olvidado tu contraseña?
          </div>

          <div class="row justify-center q-mt-xl">
            <q-btn
              class="submit"
              label="Iniciar"
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
import { defineComponent, ref, computed } from "vue";
import { api } from "boot/axios";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { SessionStorage } from "quasar";
import { useCounterStore } from "../../stores/example-store";
export default defineComponent({
  setup() {
    const email = ref("");
    const password = ref("");
    const loading = ref(false);
    const isPwd = ref(true);
    const router = useRouter();
    const $q = useQuasar();
    const store = useCounterStore();
    $q.screen.setSizes({ sm: 1300 });

    async function login() {
      /* $q.loading.show(); */
      loading.value = true;
      try {
        const response = await api.post("login", {
          email: email.value,
          password: password.value,
        });
        if (response.status == "201") {
          SessionStorage.set("User", {
            user: response.data.data.user,
            token: response.data.data.token,
          });
          store.permissions = response.data.data.user.rol.permissions;
          $q.notify({
            color: "light-green-14",
            position: "bottom-right",
            icon: "done",
            iconColor: "positive",
            message: `Mensaje de Realizado`,
            caption: `Inicio de sesión exitoso`,
            timeout: 2000,
          });
          if (
            response.data.data.user.id &&
            response.data.data.user.rol.permissions.find(
              (item) => item.code === "01" || item.code === "02"
            ) !== undefined
          ) {
            router.push({ name: "adminExpedients" });
          } else router.push({ name: "adminHome" });
        }
      } catch (error) {
        console.log(error);
        if (error && error.response && error.response.status === 401) {
          $q.notify({
            color: "negative",
            position: "bottom-right",
            iconColor: "negative",
            icon: "close",
            message: `Mensaje de Error`,
            caption: `Usuario o Contraseña incorrectos`,
            timeout: 2000,
          });
        } else if (error.message === "Network Error") {
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
      } finally {
        loading.value = false;
      }
      /* $q.loading.hide(); */
    }
    return {
      password,
      loading,
      router,
      email,
      isPwd,
      login,
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
