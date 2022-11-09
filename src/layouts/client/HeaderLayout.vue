<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <div>
        <div class="header-content">
          <div
            class="head-search row flex-center"
            style="width: 100%; max-width: 1000px"
          >
            <div class="title col-12">{{ title }}</div>
            <div class="sub-title col-12">
              {{ eslogan }}
            </div>
            <general-search @press-enter="$emit('pressEnter')"></general-search>
          </div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import GeneralSearch from "../../components/client/GeneralSearch.vue";
import { ref, toRefs } from "vue";

export default {
  name: "HeaderLayout",
  components: {
    GeneralSearch,
  },
  props: { title: String, eslogan: String },
  setup(props) {
    const { title, eslogan } = toRefs(props);
    return {};
  },
};
</script>

<style scoped>
.header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2277aa;
  height: 100vh;
  background-image: url("~assets/HEADER_CORREGIDO.svg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

/* este es el query */
@media screen and (max-width: 600px) {
  .header-content {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2277aa;
    height: 100vh;
    background-image: url("~assets/Samsung_Galaxy.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;
  }
}
@media screen and (max-width: 1366px) and (min-width: 600px) {
  .header-content {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2277aa;
    height: 100vh;
    background-image: url("~assets/HEADER_WEBP.webp");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-position: center;
  }
}
.head-search {
  padding: 2%;
}
@media screen and (min-width: 600px) {
  .head-search {
    padding: 10%;
  }
}
.title {
  font-size: calc(3em + 1vw);
  font-weight: 600;
  text-align: center;
  color: #fff;
}
.sub-title {
  margin-bottom: 10px;
  font-size: calc(0.8em + 0.8vw);
  line-height: 1.5;
  text-align: center;
  color: rgba(255, 255, 255);
}
</style>
