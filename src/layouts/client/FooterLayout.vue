<template>
  <div class="footer">
    <div
      v-if="!$q.screen.lt.sm && !$q.screen.lt.md"
      class="row"
      style="height: 100%; padding: 2em; text-align: center"
    >
      <div
        class="logo-fondo"
        :class="$q.screen.lt.sm ? 'footer-logo-fondo' : ''"
      ></div>
      <div class="row col-12 flex-center q-py-xl" style="height: 80%">
        <div class="row col flex-center">
          <div class="q-gutter-y-md col-12 q-mb-lg">
            <q-img
              class="col-4"
              src="~assets/LOGO_BLANCO_3x.webp"
              no-spinner
              fit="contain"
            />
          </div>
          <p class="text-footer" style="text-align: start">
            Nos dedicamos a la publicación de libros de texto y materiales de
            programas de alfabetización “Yo, sí puedo” dirigidos al sector
            educacional, tanto para la preparación de estudiantes, como
            docentes. Dicho programa ha sido aplicado y continúa realizándose en
            diversos países de América Latina, El Caribe, y África, con probada
            efectividad.
          </p>
        </div>

        <div class="row col flex-center text-center">
          <div
            class="q-gutter-y-md col-12"
            style="max-height: 27em; overflow: hidden"
          >
            <span
              :class="$q.screen.lt.sm ? 'footer-title' : ''"
              class="col-12 header-footer"
              >Sugerencias de la Editorial</span
            >
            <div
              :class="$q.screen.lt.sm ? 'footer-obras' : ''"
              class="text-start text-footer"
              v-for="(sug, i) in carrusel_list"
              :key="i"
            >
              <span @click="showDetails(sug)" style="cursor: pointer">{{
                sug.titulo
              }}</span>
            </div>
          </div>
        </div>

        <div class="row col flex-center">
          <div class="q-gutter-y-md col-12">
            <div class="row q-gutter-y-lg">
              <div class="col-12">
                <q-icon name="location_on" size="25px" color="white" />
                <span class="text-footer q-ml-md"
                  >Avenida 3a. No. 4601 e/ 46 y 60, Playa, La Habana, Cuba</span
                >
              </div>
              <div class="col-12">
                <q-icon name="email" size="25px" color="white" />
                <span class="text-footer q-ml-md">epe@enet.cu</span>
              </div>
              <div class="col-12">
                <q-icon name="phone" size="25px" color="white" />
                <span class="text-footer q-ml-md">+53-72125972</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row col-12 flex-center b" style="height: 10%">
        <div class="col footer-footer" style="height: 2vh">
          All Rights Reserved © 2022 Editorial Pueblo y Educación
        </div>
        <div style="height: 6vh" class="col footer-footer text-center">
          Desarrollado por:
          <span
            ><q-img
              no-spinner
              fit="contain"
              width="130px"
              height="50px"
              src="~assets/jade_footer.png"
          /></span>
        </div>
        <div style="height: 2vh" class="col text-right q-gutter-x-lg">
          <a
            href="https://www.linkedin.com/in/editorial-pueblo-y-educacion/"
            target="_blank"
            style="text-decoration: none"
            ><q-icon color="white" size="20px" name="ti-linkedin"
          /></a>
          <a
            href="https://instagram.com/puebloyeducacion?igshid=YmMyMTA2M2Y="
            target="_blank"
            style="text-decoration: none"
            ><q-icon color="white" size="20px" name="ti-instagram"
          /></a>
          <a
            href="https://twitter.com/PuebloEditorial"
            target="_blank"
            style="text-decoration: none"
          >
            <q-icon color="white" size="20px" name="ti-twitter"
          /></a>
          <a
            href="https://www.facebook.com/editorialpueblo"
            target="_blank"
            style="text-decoration: none"
            ><q-icon color="white" size="20px" name="ti-facebook"
          /></a>
          <a
            href="https://www.youtube.com/channel/UCtIGtRIU4vCoKrYUs-uBc-g"
            target="_blank"
            style="text-decoration: none"
            ><q-icon color="white" size="20px" name="ti-youtube"
          /></a>
        </div>
      </div>
    </div>

    <div
      v-else-if="$q.screen.lt.sm"
      class="row col-12 q-pa-xl"
      style="
        text-align: center;
        justify-content: center;
        padding: 1em 3em;
        height: -webkit-fill-available;
        align-content: space-evenly;
      "
    >
      <div style="width: 70%; height: max-content">
        <q-img
          src="~assets/LOGO_BLANCO_3x.webp"
          no-spinner
          height="30px"
          fit="contain"
        />
      </div>
      <div
        class="logo-fondo"
        :class="$q.screen.lt.sm ? 'footer-logo-fondo' : ''"
      ></div>
      <span class="description-footer text-footer"
        >Nos dedicamos a la publicación de libros de texto y materiales de
        programas de alfabetización “Yo, sí puedo” dirigidos al sector
        educacional, tanto para la preparación de estudiantes, como docentes.
        Dicho programa ha sido aplicado y continúa realizándose en diversos
        países de América Latina, El Caribe, y África, con probada
        efectividad.</span
      >
      <div>
        <span
          :class="$q.screen.lt.sm ? 'footer-title' : ''"
          class="header-footer"
          >Sugerencias de la Editorial</span
        >
        <div style="max-height: 7em; overflow: auto; margin: 7px 0px">
          <div
            :class="$q.screen.lt.sm ? 'footer-obras' : ''"
            class="text-start text-footer"
            v-for="(sug, i) in carrusel_list"
            :key="i"
          >
            <span @click="showDetails(sug)" style="cursor: pointer">{{
              sug.titulo
            }}</span>
          </div>
        </div>
      </div>

      <div class="section2" style="width: 100%">
        <q-icon
          name="location_on"
          size="18px"
          color="white"
          style="width: 100%"
        />
        <span class="text-footer-mobile"
          >Avenida 3a. No. 4601 e/ 46 y 60, Playa, La Habana, Cuba</span
        >
      </div>
      <div class="section2" style="width: 100%">
        <q-icon name="email" size="18px" color="white" style="width: 100%" />
        <span class="text-footer-mobile">epe@enet.cu</span>
      </div>
      <div class="section2" style="width: 100%">
        <q-icon name="phone" size="18px" color="white" style="width: 100%" />
        <span class="text-footer-mobile">7-212-59-72</span>
      </div>

      <div style="width: 100%; text-align: center; justify-content: center">
        <span
          class="footer-title header-footer"
          style="width: 100%; padding: 13px 0px"
          >Nuestras redes sociales</span
        >
        <div style="width: 100%">
          <a
            href="https://www.linkedin.com/in/editorial-pueblo-y-educacion/"
            target="_blank"
            style="text-decoration: none"
            class="icon-redes"
            ><q-icon color="white" name="ti-linkedin"
          /></a>
          <a
            href="https://instagram.com/puebloyeducacion?igshid=YmMyMTA2M2Y="
            target="_blank"
            style="text-decoration: none"
            class="icon-redes"
            ><q-icon color="white" name="ti-instagram"
          /></a>
          <a
            href="https://twitter.com/PuebloEditorial"
            target="_blank"
            style="text-decoration: none"
            class="icon-redes"
          >
            <q-icon color="white" name="ti-twitter"
          /></a>
          <a
            href="https://www.facebook.com/editorialpueblo"
            target="_blank"
            style="text-decoration: none"
            class="icon-redes"
            ><q-icon color="white" name="ti-facebook"
          /></a>
          <a
            href="https://www.youtube.com/channel/UCtIGtRIU4vCoKrYUs-uBc-g"
            target="_blank"
            style="text-decoration: none"
            class="icon-redes"
            ><q-icon color="white" name="ti-youtube"
          /></a>
        </div>
      </div>

      <div>
        <span style="font-size: 0.7em; color: white; margin-right: 2em"
          >Desarrollado por:</span
        >
        <span
          ><q-img
            style="width: 5.7em; height: 50px"
            no-spinner
            fit="contain"
            width="130px"
            height="50px"
            src="~assets/jade_footer.png"
        /></span>
      </div>
    </div>

    <div
      v-else
      class="row col-12 q-pa-xl"
      style="
        text-align: center;
        justify-content: center;
        padding: 1em 3em;
        height: -webkit-fill-available;
        align-content: space-evenly;
      "
    >
      <div style="width: 70%; height: max-content">
        <q-img
          src="~assets/LOGO_BLANCO_3x.webp"
          no-spinner
          height="80px"
          fit="contain"
        />
      </div>
      <div
        class="logo-fondo-tablet"
        :class="$q.screen.lt.sm ? 'footer-logo-fondo' : ''"
      ></div>
      <span class="description-footer-tablet text-footer"
        >Nos dedicamos a la publicación de libros de texto y materiales de
        programas de alfabetización “Yo, sí puedo” dirigidos al sector
        educacional, tanto para la preparación de estudiantes, como docentes.
        Dicho programa ha sido aplicado y continúa realizándose en diversos
        países de América Latina, El Caribe, y África, con probada
        efectividad.</span
      >
      <div>
        <span
          :class="$q.screen.lt.sm ? 'footer-title' : ''"
          class="header-footer-tablet"
          >Sugerencias de la Editorial</span
        >
        <div style="max-height: 10em; overflow: auto; margin: 7px 0px">
          <div
            :class="$q.screen.lt.sm ? 'footer-obras' : ''"
            class="text-start text-footer-tablet"
            v-for="(sug, i) in carrusel_list"
            :key="i"
          >
            <span @click="showDetails(sug)" style="cursor: pointer">{{
              sug.titulo
            }}</span>
          </div>
        </div>
      </div>

      <div class="section2" style="width: 100%; padding: 0.2em 0px">
        <span
          :class="$q.screen.lt.sm ? 'footer-title' : ''"
          class="header-footer-tablet"
          >Información de Contacto</span
        >
        <q-icon
          name="location_on"
          size="2em"
          color="white"
          style="width: 100%"
        />
        <span class="text-footer-tablet"
          >Avenida 3a. No. 4601 e/ 46 y 60, Playa, La Habana, Cuba</span
        >
      </div>
      <div class="section2" style="width: 100%">
        <q-icon
          name="email"
          size="2em"
          color="white"
          style="width: 100%; padding: 0.2em 0px"
        />
        <span class="text-footer-tablet">epe@enet.cu</span>
      </div>
      <div class="section2" style="width: 100%">
        <q-icon
          name="phone"
          size="2em"
          color="white"
          style="width: 100%; padding: 0.2em 0px"
        />
        <span class="text-footer-tablet">7-212-59-72</span>
      </div>

      <div style="width: 100%; text-align: center; justify-content: center">
        <div style="width: 100%">
          <a
            href="https://www.linkedin.com/in/editorial-pueblo-y-educacion/"
            target="_blank"
            style="text-decoration: none"
            class="icon-redes-tablet"
            ><q-icon color="white" name="ti-linkedin"
          /></a>
          <a
            href="https://instagram.com/puebloyeducacion?igshid=YmMyMTA2M2Y="
            target="_blank"
            style="text-decoration: none"
            class="icon-redes-tablet"
            ><q-icon color="white" name="ti-instagram"
          /></a>
          <a
            href="https://twitter.com/PuebloEditorial"
            target="_blank"
            style="text-decoration: none"
            class="icon-redes-tablet"
          >
            <q-icon color="white" name="ti-twitter"
          /></a>
          <a
            href="https://www.facebook.com/editorialpueblo"
            target="_blank"
            style="text-decoration: none"
            class="icon-redes-tablet"
            ><q-icon color="white" name="ti-facebook"
          /></a>
          <a
            href="https://www.youtube.com/channel/UCtIGtRIU4vCoKrYUs-uBc-g"
            target="_blank"
            style="text-decoration: none"
            class="icon-redes-tablet"
            ><q-icon color="white" name="ti-youtube"
          /></a>
        </div>
      </div>

      <div>
        <span style="font-size: 1.5em; color: white; margin-right: 2em"
          >Desarrollado por:</span
        >
        <span
          ><q-img
            style="width: 10em; height: 7em"
            no-spinner
            fit="contain"
            width="130px"
            height="50px"
            src="~assets/jade_footer.png"
        /></span>
      </div>
    </div>

    <div v-if="$q.screen.lt.sm" class="footer-footer-mobile fixed-bottom">
      All Rights Reserved © 2022 Editorial Pueblo y Educación
    </div>
    <div v-else-if="$q.screen.lt.md" class="footer-footer-tablet fixed-bottom">
      All Rights Reserved © 2022 Editorial Pueblo y Educación
    </div>
  </div>

  <details-modal
    :show="show_details"
    @close="show_details.show = false"
  ></details-modal>
</template>

<script>
import DetailsModal from "../../components/client/DetailsModal.vue";
import { toRef, ref } from "vue";
import { useQuasar } from "quasar";

export default {
  name: "FooterLayout",
  components: {
    DetailsModal,
  },
  props: ["search_list"],
  setup(props) {
    const carrusel_list = toRef(props, "search_list");
    const name = ref(null);
    const email = ref(null);
    const sms = ref(null);
    const email_boletin = ref(null);
    const show_details = ref({
      show: false,
      object: {},
    });
    const $q = useQuasar();
    $q.screen.setSizes({ sm: 721, md: 1366 });

    function showDetails(obj) {
      let names = "";
      obj.autores.forEach((autor) => {
        names += autor.nombre + ", ";
      });
      show_details.value.show = true;
      show_details.value.authors_names = names.substring(0, names.length - 2);
      show_details.value.object = obj;
    }

    return {
      carrusel_list,
      name,
      email,
      sms,
      email_boletin,
      show_details,
      showDetails,
    };
  },
};
</script>

<style scoped>
.b {
  border-top: 1px solid rgba(255, 255, 255, 0.249);
}
.description-footer {
  font-size: 0.7em !important;
}
.description-footer-tablet {
  font-size: 1.2em !important;
}
.header-footer {
  color: white;
  font-size: 20px;
}
.header-footer-tablet {
  color: white;
  font-size: 1.5em;
}
.footer-footer {
  color: white;
  font-size: 14px;
}
.footer-footer-mobile {
  color: white;
  font-size: 0.7em;
  text-align: center;
  padding: 3px;
  background: rgba(255, 255, 255, 0.03);
}
.footer-footer-tablet {
  color: white;
  font-size: 1em;
  text-align: center;
  padding: 3px;
  background: rgba(255, 255, 255, 0.03);
}
.text-footer {
  color: white;
  font-size: 14px;
  opacity: 0.6;
}
.text-footer-tablet {
  color: white;
  font-size: 1em !important;
  opacity: 0.6;
}
.text-footer-mobile {
  color: white;
  font-size: 0.7em;
  opacity: 0.6;
}
.logo-fondo {
  width: 70%;
  height: 76%;
  position: absolute;
  background-image: url("~assets/LOGO_NEGRO_FOOTER.png");
  background-repeat: no-repeat;
  background-size: contain;
  right: 0px;
  top: 20%;
}
.logo-fondo-tablet {
  width: 100%;
  height: 76%;
  position: absolute;
  background-image: url("~assets/LOGO_NEGRO_FOOTER.png");
  background-repeat: no-repeat;
  background-size: contain;
  right: 0px;
  top: 56%;
}
.footer-logo-fondo {
  top: 65%;
  width: 100%;
  background-size: cover;
  height: 30%;
}
.footer-title {
  font-size: 1em !important;
}
.footer-obras {
  font-size: 0.7em !important;
}

.icon-redes {
  margin: 0px 0.8em;
  font-size: 1em !important;
}
.icon-redes-tablet {
  margin: 0px 0.8em;
  font-size: 1.5em !important;
}
.btn-boletin-mobile {
  margin-top: 0.6em;
  height: 56px;
}
</style>
