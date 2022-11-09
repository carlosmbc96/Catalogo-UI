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
      <q-form
        @submit="changePassword"
        @reset="onReset"
        class="q-gutter-md col-8"
      >
        <div class="col-12 text-center title-login q-mb-xl">
          <span>Restablecer contraseña</span>
        </div>
        <q-input
          dense
          outlined
          counter
          v-model="password"
          :type="isPwd1 ? 'password' : 'text'"
          label="Nueva contaseña*"
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
              :name="isPwd1 ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd1 = !isPwd1"
            />
          </template>
        </q-input>

        <q-input
          dense
          outlined
          v-model="password_confirmation"
          :type="isPwd2 ? 'password' : 'text'"
          label="Confirme su nueva contraseña*"
          lazy-rules
          :rules="[
            $rules.required('Campo requerido'),
            (val) => val === password || 'Las contrseñas no coinciden',
          ]"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd2 ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd2 = !isPwd2"
            />
          </template>
        </q-input>

        <div class="row justify-center q-mt-xl">
          <q-btn
            class="submit"
            label="Actualizar"
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
      <q-form
        @submit="changePassword"
        @reset="onReset"
        class="col-12 flex flex-center"
      >
        <div style="width: 60%">
          <div class="col-12 text-center title-login q-mb-xl">
            <span>Restablecer contraseña</span>
          </div>
          <q-input
            dense
            outlined
            counter
            v-model="password"
            :type="isPwd1 ? 'password' : 'text'"
            label="Nueva contaseña*"
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
                :name="isPwd1 ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd1 = !isPwd1"
              />
            </template>
          </q-input>

          <q-input
            dense
            outlined
            v-model="password_confirmation"
            :type="isPwd2 ? 'password' : 'text'"
            label="Confirme su nueva contraseña*"
            lazy-rules
            :rules="[
              $rules.required('Campo requerido'),
              (val) => val === password || 'Las contrseñas no coinciden',
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd2 ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd2 = !isPwd2"
              />
            </template>
          </q-input>

          <div class="row justify-center q-mt-xl">
            <q-btn
              class="submit"
              label="Actualizar"
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
import { defineComponent, ref, onBeforeMount } from "vue";
import { useQuasar } from "quasar";
import { useRouter, useRoute } from "vue-router";
import { api } from "boot/axios";

export default defineComponent({
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const route = useRoute();
    const loading = ref(false);
    const token = ref("");
    const email = ref(null);
    const password = ref("");
    const password_confirmation = ref("");
    const isPwd1 = ref(true);
    const isPwd2 = ref(true);
    $q.screen.setSizes({ sm: 1300 });

    onBeforeMount(() => {
      if (!route.query.token) {
        router.push({ name: "login" });
      } else {
        token.value = route.query.token;
        email.value = route.query.email;
      }
    });

    async function changePassword() {
      loading.value = true;
      try {
        const response = await api.post("update_password", {
          email: email.value,
          token: token.value,
          password: password.value,
          password_confirmation: password_confirmation.value,
        });
        router.push({ name: "login" });
        $q.notify({
          color: "light-green-14",
          position: "bottom-right",
          iconColor: "positive",
          icon: "done",
          message: `Mensaje de Realizado`,
          caption: `Su contraseña se ha actualizado con éxito`,
          timeout: 2000,
        });
      } catch (error) {
        console.log(error);
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
      } finally {
        loading.value = false;
      }
    }
    return {
      changePassword,
      password,
      password_confirmation,
      loading,
      isPwd1,
      isPwd2,
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
