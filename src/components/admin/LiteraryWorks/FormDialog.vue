<template>
  <q-dialog v-model="show" persistent full-width full-height>
    <q-card class="q-pa-md dialog-form form-obra">
      <q-card-section
        class="text-h6 text-bold"
        style="margin-left: 30px !important"
      >
        <div class="row items-center justify-between">
          <div v-if="!readonly_show" class="row justify-center">
            {{ literary_work.id ? "Editar Obra" : "Crear Obra" }}
          </div>
          <div v-else class="row justify-center">Detalles de la Obra</div>
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
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="left"
        narrow-indicator
      >
        <q-tab name="passport_fis" label="Pasaporte de Obra Física" />
        <q-tab
          v-if="
            type_ === 'e' || type_ === 'a' || type_ === 'apk' || digitalFormat()
          "
          name="passport_ebook"
          label="Pasaporte de Ebook"
        />
        <q-tab name="adicional_info" label="Información Adicional" />
      </q-tabs>
      <q-tab-panels v-model="tab" animated>
        <!-- Pasaporte de Obra Física tab -->
        <q-tab-pane name="passport_fis">
          <q-form ref="physicalForm">
            <div
              v-if="!readonly_show"
              style="margin-left: 50px; margin-top: 8px"
            >
              <span class="filters-empty">Los campos marcados con un (</span>
              <span class="require header" v-if="!readonly_show">*</span>
              <span class="filters-empty">) son obligatorios</span>
            </div>
            <div class="row">
              <div
                class="row col-9 q-px-xl q-py-lg items-start"
                :class="$q.screen.lt.md ? 'col-12' : ''"
              >
                <span class="col-12 section q-mb-md"> Datos Generales</span>
                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">
                    <span class="require" v-if="!readonly_show">*</span> Título
                  </div>
                  <q-input
                    v-model="literary_work.titulo"
                    bg-color="grey-1"
                    dense
                    :readonly="readonly_show"
                    @change="existExpedient"
                    @update:model-value="
                      (v) => {
                        literary_work.titulo = v.replace(
                          /[^a-zA-Z-0-9ÿÁÉÍÓÚáéíóú\u00f1\u00d1a ]/g,
                          ''
                        );
                      }
                    "
                    outlined
                    color="grey-14"
                    :rules="[$rules.required('Campo requerido')]"
                  ></q-input>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">
                    <span class="require" v-if="!readonly_show">*</span>
                    Autor(es)
                  </div>
                  <div>
                    <q-select
                      :readonly="readonly_show"
                      outlined
                      bg-color="grey-1"
                      dense
                      v-model="literary_work.authors_id"
                      option-label="nombre"
                      option-value="id"
                      emit-value
                      map-options
                      use-input
                      color="grey-14"
                      :rules="[$rules.required('Campo requerido')]"
                      multiple
                      use-chips
                      options-dense
                      :options="authors_filtered"
                      @filter="filterAuthor"
                      hint="Seleccione o cree el(los) autor(es)"
                    >
                      <template v-slot:option="scope">
                        <q-item
                          v-close-popup
                          v-bind="scope.itemProps"
                          v-on="scope.itemEvents"
                        >
                          <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                        </q-item>
                      </template>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey row justify-center">
                            <q-spinner-tail
                              class="col-12"
                              size="xl"
                              v-if="loading"
                              color="grey-14"
                            />
                            <q-input
                              v-else
                              :readonly="readonly_show"
                              v-model="model_author"
                              dense
                              @update:model-value="
                                (v) => {
                                  model_author = v.replace(
                                    /[^a-zA-Z-ÿÁÉÍÓÚáéíóú\u00f1\u00d1a ]/g,
                                    ''
                                  );
                                }
                              "
                              :rules="[filterNewAuthor]"
                              @keyup="filterNewAuthor"
                              class="q-mb-sm"
                              :error="error"
                              :error-message="error_msg"
                              label="Crear un nuevo autor"
                              color="grey-14"
                              outlined
                              hint="Introduzca el nombre del autor y añádalo presionando el símbolo de + a su derecha"
                            >
                              <template v-slot:prepend>
                                <q-icon name="person" color="grey-14" />
                              </template>
                              <template v-slot:after>
                                <q-btn
                                  class="add-b"
                                  flat
                                  :ripple="false"
                                  dense
                                  :disable="model_author === '' || exist_author"
                                  icon="add_box"
                                  @click="addAuthor"
                                  size="xl"
                                />
                              </template>
                            </q-input>
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                </div>

                <div
                  class="col-4 q-mb-lg"
                  :class="$q.screen.lt.md ? 'col-12' : ''"
                >
                  <div style="margin-bottom: 8px">
                    Derechos de Autor y Talento Artístico
                  </div>
                  <q-input
                    :readonly="readonly_show"
                    v-model="literary_work.derechos_autor_talento_artistico"
                    bg-color="grey-1"
                    dense
                    @update:model-value="
                      (v) => {
                        literary_work.derechos_autor_talento_artistico =
                          v.replace(/[^0-9]/g, '');
                      }
                    "
                    outlined
                    color="grey-14"
                    :rules="[$rules.numeric('Sólo números')]"
                  ></q-input>
                </div>

                <div class="row col-12 q-gutter-lg">
                  <div class="col-4 q-mb-lg">
                    <div style="margin-bottom: 8px">Otros servicios en MLC</div>
                    <q-input
                      :readonly="readonly_show"
                      v-model="literary_work.servicios_cuc"
                      bg-color="grey-1"
                      @update:model-value="
                        (v) => {
                          literary_work.servicios_cuc = v.replace(
                            /[^0-9]/g,
                            ''
                          );
                        }
                      "
                      dense
                      outlined
                      color="grey-14"
                      :rules="[$rules.numeric('Sólo números')]"
                    ></q-input>
                  </div>
                  <!-- otros servicios en mn-->
                  <div class="col-4 q-mb-lg">
                    <div style="margin-bottom: 8px">Otros servicios en MN</div>
                    <q-input
                      :readonly="readonly_show"
                      v-model="literary_work.servicios_mn"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.servicios_mn = v.replace(/[^0-9]/g, '');
                        }
                      "
                      outlined
                      color="grey-14"
                      :rules="[$rules.numeric('Sólo números')]"
                    ></q-input>
                  </div>
                </div>

                <div class="row col-12 q-gutter-lg">
                  <span class="col-12 section">Materiales a Emplear</span>
                  <div class="col-4 q-mb-lg">
                    <div style="margin-bottom: 8px">
                      <span class="require" v-if="!readonly_show">*</span>Tipo
                      de Papel
                    </div>
                    <q-select
                      :readonly="readonly_show"
                      outlined
                      v-model="literary_work.papers_id"
                      use-input
                      bg-color="grey-1"
                      color="grey-14"
                      multiple
                      options-dense
                      dense
                      use-chips
                      option-label="nombre"
                      option-value="id"
                      emit-value
                      map-options
                      :options="types_paper"
                      @filter="filterPaper"
                      :rules="[$rules.required('Campo requerido')]"
                    >
                      <template v-slot:option="scope">
                        <q-item
                          v-close-popup
                          v-bind="scope.itemProps"
                          v-on="scope.itemEvents"
                        >
                          <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                        </q-item>
                      </template>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            Sin resultados
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                  <!-- tipo de cartulina -->
                  <div class="col-4 q-mb-lg">
                    <div style="margin-bottom: 8px">
                      <span class="require" v-if="!readonly_show">*</span> Tipo
                      de Cartulina
                    </div>
                    <q-select
                      :readonly="readonly_show"
                      bg-color="grey-1"
                      color="grey-14"
                      outlined
                      v-model="literary_work.cardboards_id"
                      use-input
                      emit-value
                      map-options
                      options-dense
                      use-chips
                      dense
                      multiple
                      option-label="nombre"
                      option-value="id"
                      :options="types_cardboard"
                      @filter="filterCardBoard"
                      :rules="[$rules.required('Campo requerido')]"
                    >
                      <template v-slot:option="scope">
                        <q-item
                          v-close-popup
                          v-bind="scope.itemProps"
                          v-on="scope.itemEvents"
                        >
                          <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                        </q-item>
                      </template>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            Sin resultados
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                </div>

                <div class="row col-12 q-gutter-lg">
                  <span class="col-12 section">Páginas</span>
                  <div class="col q-mb-lg">
                    <div style="margin-bottom: 8px">
                      <span class="require" v-if="!readonly_show">*</span
                      >Acetato
                    </div>
                    <q-input
                      :readonly="readonly_show"
                      v-model="literary_work.acetato"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.acetato = v.replace(/[^0-9]/g, '');
                        }
                      "
                      outlined
                      color="grey-14"
                      :rules="[
                        $rules.required('Campo requerido'),
                        $rules.numeric('Sólo números'),
                      ]"
                    ></q-input>
                  </div>
                  <div class="col q-mb-lg">
                    <div
                      style="
                        margin-bottom: 8px;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                      "
                    >
                      <span class="require" v-if="!readonly_show">*</span>
                      Película Positiva
                    </div>
                    <q-input
                      :readonly="readonly_show"
                      v-model="literary_work.pelicula_positiva"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.pelicula_positiva = v.replace(
                            /[^0-9]/g,
                            ''
                          );
                        }
                      "
                      outlined
                      color="grey-14"
                      :rules="[
                        $rules.required('Campo requerido'),
                        $rules.numeric('Sólo números'),
                      ]"
                    ></q-input>
                  </div>
                  <div class="col q-mb-lg">
                    <div
                      style="
                        margin-bottom: 8px;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                      "
                    >
                      <span class="require" v-if="!readonly_show">*</span
                      >Original Impreso
                    </div>
                    <q-input
                      :readonly="readonly_show"
                      v-model="literary_work.original_impreso"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.original_impreso = v.replace(
                            /[^0-9]/g,
                            ''
                          );
                        }
                      "
                      outlined
                      color="grey-14"
                      :rules="[
                        $rules.required('Campo requerido'),
                        $rules.numeric('Sólo números'),
                      ]"
                    ></q-input>
                  </div>
                  <div class="col q-mb-lg">
                    <div style="margin-bottom: 8px">
                      <span class="require" v-if="!readonly_show">*</span>
                      CD-ROM
                    </div>
                    <q-input
                      :readonly="readonly_show"
                      v-model="literary_work.cdrom"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.cdrom = v.replace(/[^0-9]/g, '');
                        }
                      "
                      outlined
                      color="grey-14"
                      :rules="[
                        $rules.required('Campo requerido'),
                        $rules.numeric('Sólo números'),
                      ]"
                    ></q-input>
                  </div>
                </div>

                <div class="row col-12 q-gutter-lg">
                  <span class="col-12 section">Colores de Trabajo</span>
                  <div style="width: 223.3px" class="q-mb-lg">
                    <div style="margin-bottom: 8px">
                      <span class="require" v-if="!readonly_show">*</span>Tripa
                    </div>
                    <q-input
                      :readonly="readonly_show"
                      v-model="literary_work.tripa"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.tripa = v.replace(/[^0-9]/g, '');
                        }
                      "
                      outlined
                      color="grey-14"
                      :rules="[
                        $rules.required('Campo requerido'),
                        $rules.numeric('Sólo números'),
                      ]"
                    ></q-input>
                  </div>
                  <div style="width: 223.3px" class="q-mb-lg">
                    <div style="margin-bottom: 8px">
                      <span class="require" v-if="!readonly_show">*</span>
                      Cubierta
                    </div>
                    <q-input
                      :readonly="readonly_show"
                      v-model="literary_work.cubierta"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.cubierta = v.replace(/[^0-9]/g, '');
                        }
                      "
                      outlined
                      color="grey-14"
                      :rules="[
                        $rules.required('Campo requerido'),
                        $rules.numeric('Sólo números'),
                      ]"
                    ></q-input>
                  </div>
                  <div style="width: 223.3px" class="q-mb-lg">
                    <div style="margin-bottom: 8px">
                      <span class="require" v-if="!readonly_show">*</span>
                      Cubierta Retiro
                    </div>
                    <q-input
                      :readonly="readonly_show"
                      v-model="literary_work.cubierta_retiro"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.cubierta_retiro = v.replace(
                            /[^0-9]/g,
                            ''
                          );
                        }
                      "
                      outlined
                      color="grey-14"
                      :rules="[
                        $rules.required('Campo requerido'),
                        $rules.numeric('Sólo números'),
                      ]"
                    ></q-input>
                  </div>
                </div>

                <div class="row col-12 q-gutter-lg">
                  <span class="col-12 section"> Encuadernación</span>
                  <div class="q-mb-lg">
                    <q-checkbox
                      v-if="!readonly_show || literary_work.flexiback"
                      :disable="readonly_show"
                      class="self-center"
                      size="xs"
                      label="Flexiback"
                      v-model="literary_work.flexiback"
                    />
                  </div>
                  <div class="q-mb-lg">
                    <q-checkbox
                      v-if="!readonly_show || literary_work.hilo"
                      :disable="readonly_show"
                      class="self-center"
                      label="Hilo"
                      size="xs"
                      v-model="literary_work.hilo"
                    />
                  </div>
                  <div class="q-mb-lg">
                    <q-checkbox
                      v-if="!readonly_show || literary_work.rustica"
                      :disable="readonly_show"
                      class="self-center"
                      size="xs"
                      label="Rústica"
                      v-model="literary_work.rustica"
                    />
                  </div>
                  <div class="q-mb-lg">
                    <q-checkbox
                      v-if="!readonly_show || literary_work.caballete"
                      :disable="readonly_show"
                      class="self-center"
                      size="xs"
                      label="Caballete"
                      v-model="literary_work.caballete"
                    />
                  </div>
                </div>

                <div class="row col-12 q-gutter-lg">
                  <span class="col-12 section">Formato</span>
                  <div class="col-4 q-mb-lg">
                    <div style="margin-bottom: 8px">
                      <span class="require" v-if="!readonly_show">*</span> Ancho
                    </div>
                    <q-input
                      :readonly="readonly_show"
                      v-model="literary_work.ancho"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.ancho = v.replace(
                            /[^0-9&quot;cm]/g,
                            ''
                          );
                        }
                      "
                      outlined
                      color="grey-14"
                      :rules="[$rules.required('Campo requerido')]"
                    ></q-input>
                  </div>
                  <div class="col-4 q-mb-lg">
                    <div style="margin-bottom: 8px">
                      <span class="require" v-if="!readonly_show">*</span> Alto
                    </div>
                    <q-input
                      :readonly="readonly_show"
                      v-model="literary_work.alto"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.alto = v.replace(/[^0-9&quot;cm]/g, '');
                        }
                      "
                      outlined
                      color="grey-14"
                      :rules="[$rules.required('Campo requerido')]"
                    ></q-input>
                  </div>
                </div>

                <div class="row col-12 q-gutter-lg">
                  <span class="col-12 section"> Complejidad General</span>
                  <div class="col-4 q-mb-lg">
                    <div
                      style="
                        margin-bottom: 8px;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                      "
                    >
                      Complejidad del Trabajo
                    </div>
                    <q-select
                      options-dense
                      :readonly="readonly_show"
                      bg-color="grey-1"
                      color="grey-14"
                      dense
                      outlined
                      v-model="literary_work.compl_general"
                      :options="[
                        'Simple',
                        'Semi-Complejo',
                        'Complejo',
                        'Muy Complejo',
                      ]"
                    />
                  </div>
                  <div class="col-3 q-mb-lg">
                    <div
                      style="
                        margin-bottom: 8px;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                      "
                    >
                      Cantidad de páginas
                    </div>
                    <q-input
                      :readonly="readonly_show"
                      v-model="literary_work.compl_general_valor"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.compl_general_valor = v.replace(
                            /[^0-9]/g,
                            ''
                          );
                        }
                      "
                      outlined
                      color="grey-14"
                      :rules="[$rules.numeric('Sólo números')]"
                    ></q-input>
                  </div>
                </div>

                <div class="row col-12 q-gutter-lg">
                  <span class="col-12 section"
                    >Complejidad por Departamento</span
                  >
                  <div class="col q-mb-lg">
                    <div style="margin-bottom: 8px">Redacción</div>
                    <q-select
                      options-dense
                      :readonly="readonly_show"
                      bg-color="grey-1"
                      color="grey-14"
                      dense
                      outlined
                      v-model="literary_work.compl_redaccion"
                      :options="[
                        'Simple',
                        'Semi-Complejo',
                        'Complejo',
                        'Muy Complejo',
                      ]"
                    />
                  </div>
                  <div class="col q-mb-lg">
                    <div style="margin-bottom: 8px">Mecanografía</div>
                    <q-select
                      options-dense
                      :readonly="readonly_show"
                      bg-color="grey-1"
                      color="grey-14"
                      dense
                      outlined
                      v-model="literary_work.compl_mecanografia"
                      :options="[
                        'Simple',
                        'Semi-Complejo',
                        'Complejo',
                        'Muy Complejo',
                      ]"
                    />
                  </div>
                  <div class="col q-mb-lg">
                    <div style="margin-bottom: 8px">Corrección</div>
                    <q-select
                      options-dense
                      :readonly="readonly_show"
                      bg-color="grey-1"
                      color="grey-14"
                      dense
                      outlined
                      v-model="literary_work.compl_correccion"
                      :options="[
                        'Simple',
                        'Semi-Complejo',
                        'Complejo',
                        'Muy Complejo',
                      ]"
                    />
                  </div>
                  <div class="col q-mb-lg">
                    <div style="margin-bottom: 8px">Ilustración</div>
                    <q-select
                      options-dense
                      :readonly="readonly_show"
                      bg-color="grey-1"
                      color="grey-14"
                      dense
                      outlined
                      v-model="literary_work.compl_ilustracion"
                      :options="[
                        'Simple',
                        'Semi-Complejo',
                        'Complejo',
                        'Muy Complejo',
                      ]"
                    />
                  </div>
                </div>

                <div class="row col-12 q-gutter-lg">
                  <span class="col-12 section">Complejidad Pre-Prensa</span>
                  <div class="col-4 q-mb-lg">
                    <div style="margin-bottom: 8px">Complejidad</div>
                    <q-select
                      options-dense
                      :readonly="readonly_show"
                      bg-color="grey-1"
                      color="grey-14"
                      dense
                      outlined
                      v-model="literary_work.compl_prensa"
                      :options="[
                        'Simple',
                        'Semi-Complejo',
                        'Complejo',
                        'Muy Complejo',
                      ]"
                    />
                  </div>
                  <div class="col-3 q-mb-md">
                    <div
                      style="
                        margin-bottom: 8px;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                      "
                    >
                      Cantidad de páginas
                    </div>
                    <q-input
                      :readonly="readonly_show"
                      v-model="literary_work.compl_prensa_valor"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.compl_prensa_valor = v.replace(
                            /[^0-9]/g,
                            ''
                          );
                        }
                      "
                      outlined
                      color="grey-14"
                      :rules="[$rules.numeric('Sólo números')]"
                    ></q-input>
                  </div>
                </div>

                <div class="row col-12 q-gutter-lg">
                  <span class="col-12 section">Ilustraciones</span>
                  <div class="col q-mb-lg">
                    <div style="margin-bottom: 8px">
                      <span class="require" v-if="!readonly_show">*</span
                      >Cantidad
                    </div>
                    <q-input
                      :readonly="readonly_show"
                      v-model="literary_work.ilust_cant"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.ilust_cant = v.replace(/[^0-9]/g, '');
                        }
                      "
                      outlined
                      color="grey-14"
                      :rules="[
                        $rules.required('Campo requerido'),
                        $rules.numeric('Debe contener sólo números'),
                      ]"
                    ></q-input>
                  </div>
                  <div class="col q-mb-lg">
                    <div style="margin-bottom: 8px">
                      <span class="require" v-if="!readonly_show">*</span> Línea
                    </div>
                    <q-input
                      :readonly="readonly_show"
                      v-model="literary_work.ilust_linea"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.ilust_linea = v.replace(/[^0-9]/g, '');
                        }
                      "
                      outlined
                      color="grey-14"
                      :rules="[
                        $rules.required('Campo requerido'),
                        $rules.numeric('Debe contener sólo números'),
                      ]"
                    ></q-input>
                  </div>
                  <div class="col q-mb-lg">
                    <div style="margin-bottom: 8px">
                      <span class="require" v-if="!readonly_show">*</span>Color
                    </div>
                    <q-input
                      :readonly="readonly_show"
                      v-model="literary_work.ilust_color"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.ilust_color = v.replace(/[^0-9]/g, '');
                        }
                      "
                      outlined
                      color="grey-14"
                      :rules="[
                        $rules.required('Campo requerido'),
                        $rules.numeric('Debe contener sólo números'),
                      ]"
                    ></q-input>
                  </div>
                  <div class="col q-mb-lg">
                    <div style="margin-bottom: 8px">
                      <span class="require" v-if="!readonly_show">*</span> Fotos
                    </div>
                    <q-input
                      :readonly="readonly_show"
                      v-model="literary_work.ilust_fotos"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.ilust_fotos = v.replace(/[^0-9]/g, '');
                        }
                      "
                      outlined
                      color="grey-14"
                      :rules="[
                        $rules.required('Campo requerido'),
                        $rules.numeric('Debe contener sólo números'),
                      ]"
                    ></q-input>
                  </div>
                </div>

                <div class="row col-12 q-gutter-lg">
                  <span class="col-12 section">Observaciones</span>
                  <div class="col-12">
                    <div style="margin-bottom: 8px">Comentarios</div>
                    <q-input
                      :readonly="readonly_show"
                      v-model="literary_work.comentarios"
                      bg-color="grey-1"
                      dense
                      type="textarea"
                      outlined
                      color="grey-14"
                    ></q-input>
                  </div>
                  <div class="col-12 q-mb-lg">
                    <div style="margin-bottom: 8px">
                      Observaciones Pasaporte
                    </div>
                    <q-input
                      :readonly="readonly_show"
                      v-model="literary_work.obsv_pasaporte"
                      bg-color="grey-1"
                      dense
                      type="textarea"
                      outlined
                      color="grey-14"
                    ></q-input>
                  </div>
                </div>

                <div class="row justify-between col-12">
                  <div class="row col-12 q-mb-lg">
                    <span class="col-6 section">Cronograma</span>
                    <span class="col-6 section">Pauta</span>
                  </div>
                  <div class="row col-12">
                    <div class="col-3">
                      <div style="margin-bottom: 8px">Plan</div>
                      <q-input
                        :readonly="readonly_show"
                        bg-color="grey-1"
                        outlined
                        dense
                        color="grey-14"
                        v-model="literary_work.plan"
                        mask="####"
                      >
                        <q-popup-proxy
                          v-if="!readonly_show"
                          ref="qDateProxy"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            minimal
                            default-view="Years"
                            :locale="myLocale"
                            v-model="literary_work.plan"
                            emit-immediately
                            v-close-popup="
                              literary_work.plan != null ? true : false
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
                        <template v-if="!readonly_show" v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              cover
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date
                                minimal
                                default-view="Years"
                                :locale="myLocale"
                                v-model="literary_work.plan"
                                emit-immediately
                                v-close-popup
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
                    <div
                      class="col-2"
                      style="margin-left: 4em"
                      :style="
                        $q.screen.lt.md ? 'margin-left: 30px !important' : ''
                      "
                    >
                      <div style="margin-bottom: 8px">PR</div>
                      <q-input
                        :readonly="readonly_show"
                        v-model="literary_work.pr"
                        bg-color="grey-1"
                        dense
                        outlined
                        color="grey-14"
                        mask="#####"
                      ></q-input>
                    </div>
                    <div
                      class="col-2"
                      style="margin-left: 4em"
                      :style="
                        $q.screen.lt.md ? 'margin-left: 30px !important' : ''
                      "
                    >
                      <div style="margin-bottom: 8px">ART</div>
                      <q-input
                        :readonly="readonly_show"
                        v-model="literary_work.art"
                        bg-color="grey-1"
                        dense
                        outlined
                        color="grey-14"
                        mask="#####"
                      ></q-input>
                    </div>
                    <div
                      class="col-2"
                      style="margin-left: 4em"
                      :style="
                        $q.screen.lt.md ? 'margin-left: 30px !important' : ''
                      "
                    >
                      <div style="margin-bottom: 8px">LH</div>
                      <q-input
                        :readonly="readonly_show"
                        v-model="literary_work.lh"
                        bg-color="grey-1"
                        dense
                        outlined
                        color="grey-14"
                        mask="#####"
                      ></q-input>
                    </div>
                  </div>
                  <div class="row col-12">
                    <div class="col-3 q-mb-lg">
                      <div style="margin-bottom: 8px">Entrada</div>
                      <q-input
                        readonly
                        bg-color="grey-1"
                        outlined
                        dense
                        color="grey-14"
                        v-model="literary_work.entrada"
                        mask="date"
                      >
                        <q-popup-proxy
                          v-if="!readonly_show"
                          ref="qDateProxy"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            today-btn
                            :locale="myLocale"
                            v-model="literary_work.entrada"
                            emit-immediately
                            v-close-popup="
                              literary_work.entrada != null ? true : false
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
                        <template v-if="!readonly_show" v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              cover
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date
                                today-btn
                                :locale="myLocale"
                                v-model="literary_work.entrada"
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
                    <div
                      class="col-2"
                      style="margin-left: 4em"
                      :style="
                        $q.screen.lt.md ? 'margin-left: 30px !important' : ''
                      "
                    >
                      <div style="margin-bottom: 8px">MAY</div>
                      <q-input
                        :readonly="readonly_show"
                        v-model="literary_work.may"
                        bg-color="grey-1"
                        dense
                        outlined
                        mask="#####"
                        color="grey-14"
                      ></q-input>
                    </div>
                    <div
                      class="col-2"
                      style="margin-left: 4em"
                      :style="
                        $q.screen.lt.md ? 'margin-left: 30px !important' : ''
                      "
                    >
                      <div style="margin-bottom: 8px">MAT</div>
                      <q-input
                        :readonly="readonly_show"
                        v-model="literary_work.m"
                        bg-color="grey-1"
                        dense
                        outlined
                        mask="#####"
                        color="grey-14"
                      ></q-input>
                    </div>
                    <div
                      class="col-2"
                      style="margin-left: 4em"
                      :style="
                        $q.screen.lt.md ? 'margin-left: 30px !important' : ''
                      "
                    >
                      <div style="margin-bottom: 8px">VCL</div>
                      <q-input
                        :readonly="readonly_show"
                        v-model="literary_work.vc"
                        bg-color="grey-1"
                        dense
                        mask="#####"
                        outlined
                        color="grey-14"
                      ></q-input>
                    </div>
                  </div>
                  <div class="row col-12">
                    <div class="col-3 q-mb-lg">
                      <div style="margin-bottom: 8px">A Edición</div>
                      <q-input
                        readonly
                        bg-color="grey-1"
                        outlined
                        dense
                        color="grey-14"
                        v-model="literary_work.a_edicion"
                        mask="date"
                      >
                        <q-popup-proxy
                          v-if="!readonly_show"
                          ref="qDateProxy"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            today-btn
                            :locale="myLocale"
                            v-model="literary_work.a_edicion"
                            emit-immediately
                            v-close-popup="
                              literary_work.a_edicion != null ? true : false
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
                        <template v-if="!readonly_show" v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              cover
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date
                                today-btn
                                :locale="myLocale"
                                v-model="literary_work.a_edicion"
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
                    <div
                      class="col-2"
                      style="margin-left: 4em"
                      :style="
                        $q.screen.lt.md ? 'margin-left: 30px !important' : ''
                      "
                    >
                      <div style="margin-bottom: 8px">CF</div>
                      <q-input
                        :readonly="readonly_show"
                        v-model="literary_work.cf"
                        bg-color="grey-1"
                        mask="#####"
                        dense
                        outlined
                        color="grey-14"
                      ></q-input>
                    </div>
                    <div
                      class="col-2"
                      style="margin-left: 4em"
                      :style="
                        $q.screen.lt.md ? 'margin-left: 30px !important' : ''
                      "
                    >
                      <div style="margin-bottom: 8px">SS</div>
                      <q-input
                        :readonly="readonly_show"
                        v-model="literary_work.ss"
                        bg-color="grey-1"
                        mask="#####"
                        dense
                        outlined
                        color="grey-14"
                      ></q-input>
                    </div>
                    <div
                      class="col-2"
                      style="margin-left: 4em"
                      :style="
                        $q.screen.lt.md ? 'margin-left: 30px !important' : ''
                      "
                    >
                      <div style="margin-bottom: 8px">CA</div>
                      <q-input
                        :readonly="readonly_show"
                        v-model="literary_work.ca"
                        bg-color="grey-1"
                        mask="#####"
                        dense
                        outlined
                        color="grey-14"
                      ></q-input>
                    </div>
                  </div>
                  <div class="row col-12">
                    <div class="col-3 q-mb-lg">
                      <div style="margin-bottom: 8px">Devuelto</div>
                      <q-input
                        readonly
                        bg-color="grey-1"
                        outlined
                        dense
                        color="grey-14"
                        v-model="literary_work.devuelto"
                        mask="date"
                      >
                        <q-popup-proxy
                          v-if="!readonly_show"
                          ref="qDateProxy"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            today-btn
                            :locale="myLocale"
                            v-model="literary_work.devuelto"
                            emit-immediately
                            v-close-popup="
                              literary_work.devuelto != null ? true : false
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
                        <template v-if="!readonly_show" v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              cover
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date
                                today-btn
                                :locale="myLocale"
                                v-model="literary_work.devuelto"
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
                    <div
                      class="col-2"
                      style="margin-left: 4em"
                      :style="
                        $q.screen.lt.md ? 'margin-left: 30px !important' : ''
                      "
                    >
                      <div style="margin-bottom: 8px">C</div>
                      <q-input
                        :readonly="readonly_show"
                        v-model="literary_work.c"
                        bg-color="grey-1"
                        dense
                        mask="#####"
                        outlined
                        color="grey-14"
                      ></q-input>
                    </div>
                    <div
                      class="col-2"
                      style="margin-left: 4em"
                      :style="
                        $q.screen.lt.md ? 'margin-left: 30px !important' : ''
                      "
                    >
                      <div style="margin-bottom: 8px">LT</div>
                      <q-input
                        :readonly="readonly_show"
                        v-model="literary_work.lt"
                        bg-color="grey-1"
                        dense
                        mask="#####"
                        outlined
                        color="grey-14"
                      ></q-input>
                    </div>
                    <div
                      class="col-2"
                      style="margin-left: 4em"
                      :style="
                        $q.screen.lt.md ? 'margin-left: 30px !important' : ''
                      "
                    >
                      <div style="margin-bottom: 8px">H</div>
                      <q-input
                        :readonly="readonly_show"
                        v-model="literary_work.h"
                        bg-color="grey-1"
                        dense
                        outlined
                        mask="#####"
                        color="grey-14"
                      ></q-input>
                    </div>
                  </div>
                  <div class="row col-12">
                    <div class="col-3 q-mb-lg">
                      <div style="margin-bottom: 8px">Cancelado</div>
                      <q-input
                        readonly
                        bg-color="grey-1"
                        outlined
                        dense
                        color="grey-14"
                        v-model="literary_work.cancelado"
                        mask="date"
                      >
                        <q-popup-proxy
                          v-if="!readonly_show"
                          ref="qDateProxy"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            today-btn
                            :locale="myLocale"
                            v-model="literary_work.cancelado"
                            emit-immediately
                            v-close-popup="
                              literary_work.cancelado != null ? true : false
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
                        <template v-if="!readonly_show" v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              cover
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date
                                today-btn
                                :locale="myLocale"
                                v-model="literary_work.cancelado"
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
                    <div
                      class="col-2"
                      style="margin-left: 4em"
                      :style="
                        $q.screen.lt.md ? 'margin-left: 30px !important' : ''
                      "
                    >
                      <div style="margin-bottom: 8px">G</div>
                      <q-input
                        v-model="literary_work.g"
                        bg-color="grey-1"
                        dense
                        outlined
                        color="grey-14"
                        mask="#####"
                      ></q-input>
                    </div>
                    <div
                      class="col-2"
                      style="margin-left: 4em"
                      :style="
                        $q.screen.lt.md ? 'margin-left: 30px !important' : ''
                      "
                    >
                      <div style="margin-bottom: 8px">SC</div>
                      <q-input
                        :readonly="readonly_show"
                        v-model="literary_work.sc"
                        bg-color="grey-1"
                        dense
                        mask="#####"
                        outlined
                        color="grey-14"
                      ></q-input>
                    </div>
                    <div
                      class="col-2"
                      style="margin-left: 4em"
                      :style="
                        $q.screen.lt.md ? 'margin-left: 30px !important' : ''
                      "
                    >
                      <div style="margin-bottom: 8px">GMO</div>
                      <q-input
                        :readonly="readonly_show"
                        v-model="literary_work.gmo"
                        bg-color="grey-1"
                        mask="#####"
                        dense
                        outlined
                        color="grey-14"
                      ></q-input>
                    </div>
                  </div>
                  <div class="row col-12">
                    <div class="col-3 q-mb-lg">
                      <div style="margin-bottom: 8px">Registro</div>
                      <q-input
                        readonly
                        bg-color="grey-1"
                        outlined
                        dense
                        color="grey-14"
                        v-model="literary_work.registro"
                        mask="date"
                      >
                        <q-popup-proxy
                          v-if="!readonly_show"
                          ref="qDateProxy"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            today-btn
                            :locale="myLocale"
                            v-model="literary_work.registro"
                            emit-immediately
                            v-close-popup="
                              literary_work.registro != null ? true : false
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
                        <template v-if="!readonly_show" v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              cover
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date
                                today-btn
                                :locale="myLocale"
                                v-model="literary_work.registro"
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
                    <div
                      class="col-2"
                      style="margin-left: 4em"
                      :style="
                        $q.screen.lt.md ? 'margin-left: 30px !important' : ''
                      "
                    >
                      <div style="margin-bottom: 8px">ENAME</div>
                      <q-input
                        :readonly="readonly_show"
                        v-model="literary_work.ename"
                        bg-color="grey-1"
                        dense
                        outlined
                        mask="#####"
                        color="grey-14"
                      ></q-input>
                    </div>
                    <div
                      class="col-2"
                      style="margin-left: 4em"
                      :style="
                        $q.screen.lt.md ? 'margin-left: 30px !important' : ''
                      "
                    >
                      <div style="margin-bottom: 8px">MINED</div>
                      <q-input
                        :readonly="readonly_show"
                        v-model="literary_work.mined"
                        bg-color="grey-1"
                        dense
                        mask="#####"
                        outlined
                        color="grey-14"
                      ></q-input>
                    </div>
                    <div
                      class="col-2"
                      style="margin-left: 4em"
                      :style="
                        $q.screen.lt.md ? 'margin-left: 30px !important' : ''
                      "
                    >
                      <div style="margin-bottom: 8px">Muestras</div>
                      <q-input
                        :readonly="readonly_show"
                        v-model="literary_work.muestra"
                        bg-color="grey-1"
                        dense
                        mask="#####"
                        outlined
                        color="grey-14"
                      ></q-input>
                    </div>
                  </div>
                  <div class="row col-12">
                    <div class="col-3 q-mb-lg">
                      <div
                        style="
                          margin-bottom: 8px;
                          text-overflow: ellipsis;
                          overflow: hidden;
                          white-space: nowrap;
                        "
                      >
                        Term. Editorial
                      </div>
                      <q-input
                        readonly
                        bg-color="grey-1"
                        outlined
                        dense
                        color="grey-14"
                        v-model="literary_work.term_editorial"
                        mask="date"
                      >
                        <q-popup-proxy
                          v-if="!readonly_show"
                          ref="qDateProxy"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            today-btn
                            :locale="myLocale"
                            v-model="literary_work.term_editorial"
                            emit-immediately
                            v-close-popup="
                              literary_work.term_editorial != null
                                ? true
                                : false
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
                        <template v-if="!readonly_show" v-slot:append>
                          <q-icon name="event" class="cursor-pointer">
                            <q-popup-proxy
                              ref="qDateProxy"
                              cover
                              transition-show="scale"
                              transition-hide="scale"
                            >
                              <q-date
                                today-btn
                                :locale="myLocale"
                                v-model="literary_work.term_editorial"
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
                    <div
                      class="col-2"
                      style="margin-left: 4em"
                      :style="
                        $q.screen.lt.md ? 'margin-left: 30px !important' : ''
                      "
                    >
                      <div style="margin-bottom: 8px">Otros</div>
                      <q-input
                        :readonly="readonly_show"
                        v-model="literary_work.otros"
                        bg-color="grey-1"
                        dense
                        mask="#####"
                        outlined
                        color="grey-14"
                      ></q-input>
                    </div>
                    <div
                      class="col-2"
                      style="margin-left: 4em"
                      :style="
                        $q.screen.lt.md ? 'margin-left: 30px !important' : ''
                      "
                    >
                      <div style="margin-bottom: 8px; font-weight: 700">
                        TOTAL
                      </div>
                      <q-input
                        :readonly="readonly_show"
                        v-model="literary_work.total"
                        bg-color="grey-1"
                        dense
                        outlined
                        mask="#####"
                        color="grey-14"
                      ></q-input>
                    </div>
                    <div
                      class="col-2"
                      style="margin-left: 4em"
                      :style="
                        $q.screen.lt.md ? 'margin-left: 30px !important' : ''
                      "
                    >
                      <div style="margin-bottom: 8px; font-weight: 700">
                        SUMA
                      </div>
                      <q-input
                        :readonly="readonly_show"
                        v-model="literary_work.suma"
                        bg-color="grey-1"
                        dense
                        outlined
                        mask="#####"
                        color="grey-14"
                      ></q-input>
                    </div>
                  </div>
                </div>

                <div class="row col-12">
                  <div class="col-3 q-mb-lg">
                    <div style="margin-bottom: 8px">
                      Entrega a Servicio Poligráfico
                    </div>
                    <q-input
                      readonly
                      bg-color="grey-1"
                      outlined
                      dense
                      color="grey-14"
                      v-model="literary_work.entr_sev_poligrafico"
                      mask="date"
                    >
                      <q-popup-proxy
                        v-if="!readonly_show"
                        ref="qDateProxy"
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          today-btn
                          :locale="myLocale"
                          v-model="literary_work.entr_sev_poligrafico"
                          emit-immediately
                          v-close-popup="
                            literary_work.entr_sev_poligrafico != null
                              ? true
                              : false
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
                      <template v-if="!readonly_show" v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            ref="qDateProxy"
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date
                              today-btn
                              :locale="myLocale"
                              v-model="literary_work.entr_sev_poligrafico"
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

                <div class="row col-12">
                  <div class="col-3 q-mb-lg">
                    <div style="margin-bottom: 8px">Ent. Industria</div>
                    <q-input
                      readonly
                      bg-color="grey-1"
                      outlined
                      dense
                      color="grey-14"
                      v-model="literary_work.entr_industria"
                      mask="date"
                    >
                      <q-popup-proxy
                        v-if="!readonly_show"
                        ref="qDateProxy"
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          today-btn
                          :locale="myLocale"
                          v-model="literary_work.entr_industria"
                          emit-immediately
                          v-close-popup="
                            literary_work.entr_industria != null ? true : false
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
                      <template v-if="!readonly_show" v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            ref="qDateProxy"
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date
                              today-btn
                              :locale="myLocale"
                              v-model="literary_work.entr_industria"
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

                <div class="row col-12">
                  <div class="col-3 q-mb-lg">
                    <div style="margin-bottom: 8px">Terminado</div>
                    <q-input
                      readonly
                      bg-color="grey-1"
                      outlined
                      dense
                      color="grey-14"
                      v-model="literary_work.terminado"
                      mask="date"
                    >
                      <q-popup-proxy
                        v-if="!readonly_show"
                        ref="qDateProxy"
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          today-btn
                          :locale="myLocale"
                          v-model="literary_work.terminado"
                          emit-immediately
                          v-close-popup="
                            literary_work.terminado != null ? true : false
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
                      <template v-if="!readonly_show" v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            ref="qDateProxy"
                            cover
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date
                              today-btn
                              :locale="myLocale"
                              v-model="literary_work.terminado"
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
                <div class="row col-12">
                  <div class="col-3 q-mb-md">
                    <div style="margin-bottom: 8px; color: transparent">-</div>
                    <div style="margin-bottom: 8px; color: transparent">-</div>
                  </div>
                </div>
              </div>
              <div
                class="row col-3 q-px-xl q-py-lg items-start"
                :class="$q.screen.lt.md ? 'col-12' : ''"
              >
                <span class="col-12 section q-mb-md">Otros Datos</span>
                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">
                    <span class="require" v-if="!readonly_show">*</span>
                    Expediente
                  </div>
                  <q-select
                    options-dense
                    :readonly="readonly_show"
                    outlined
                    v-model="literary_work.expediente_id"
                    use-input
                    use-chips
                    emit-value
                    map-options
                    option-label="nombre"
                    :options="expedients"
                    @filter="filterExpedients"
                    @update:model-value="expObra"
                    dense
                    bg-color="grey-1"
                    color="grey-14"
                    :rules="[$rules.required('Campo requerido')]"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          Sin resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">
                    <span class="require" v-if="!readonly_show">*</span> Código
                  </div>
                  <q-input
                    :readonly="readonly_show"
                    v-model="literary_work.codigo"
                    bg-color="grey-1"
                    dense
                    @update:model-value="
                      (v) => {
                        literary_work.codigo = v.replace(
                          /[^0-9a-zA-ZÿÁÉÍÓÚáéíóú\u00f1\u00d1a]/g,
                          ''
                        );
                      }
                    "
                    outlined
                    color="grey-14"
                    :rules="[$rules.required('Campo requerido')]"
                  ></q-input>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">
                    <span class="require" v-if="!readonly_show">*</span> ISBN
                  </div>
                  <q-input
                    :readonly="readonly_show"
                    v-model="literary_work.isbn"
                    bg-color="grey-1"
                    dense
                    mask="###-###-##-####-#"
                    outlined
                    @keyup="existIsbn"
                    :error="error_isbn"
                    :error-message="error_message_isbn"
                    color="grey-14"
                    :rules="[
                      $rules.required('Campo requerido'),
                      $rules.minLength(17, 'ISBN incompleto'),
                    ]"
                  ></q-input>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">ISBN Obra</div>
                  <q-input
                    :readonly="readonly_show"
                    v-model="literary_work.isbn_obra"
                    bg-color="grey-1"
                    dense
                    outlined
                    @keyup="existIsbnObra"
                    :error="error_isbn_obra"
                    :error-message="error_message_isbn_obra"
                    mask="###-###-##-####-#"
                    color="grey-14"
                    :rules="[$rules.minLength(17, 'ISBN Obra incompleto')]"
                  ></q-input>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">
                    <span class="require" v-if="!readonly_show">*</span> CPCU
                  </div>
                  <q-input
                    :readonly="readonly_show"
                    v-model="literary_work.cpcu"
                    bg-color="grey-1"
                    dense
                    mask="#####.#.##.##.####.#"
                    outlined
                    @keyup="existCpcu"
                    :error="error_cpcu"
                    :error-message="error_message_cpcu"
                    color="grey-14"
                    :rules="[
                      $rules.required('Campo requerido'),
                      $rules.minLength(20, 'CPCU incompleto'),
                    ]"
                  ></q-input>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">
                    <span class="require" v-if="!readonly_show">*</span>
                    Usuarios
                  </div>
                  <q-select
                    options-dense
                    :readonly="readonly_show"
                    outlined
                    v-model="literary_work.usuarios_obra_id"
                    use-input
                    multiple
                    use-chips
                    option-label="nombre"
                    option-value="id"
                    emit-value
                    map-options
                    :options="usuarios_obra"
                    @filter="fitlerUsuariosObra"
                    dense
                    bg-color="grey-1"
                    :rules="[$rules.required('Campo requerido')]"
                    color="grey-14"
                  >
                    <template v-slot:option="scope">
                      <q-item
                        v-close-popup
                        v-bind="scope.itemProps"
                        v-on="scope.itemEvents"
                      >
                        <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                      </q-item>
                    </template>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          Sin resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>

                <div class="col-12 q-mb-xl">
                  <div style="margin-bottom: 8px">
                    <span class="require" v-if="!readonly_show">*</span>
                    Clasificación
                  </div>
                  <q-select
                    options-dense
                    :readonly="readonly_show"
                    outlined
                    v-model="literary_work.clasificacion_id"
                    use-input
                    use-chips
                    emit-value
                    map-options
                    option-label="nombre"
                    option-value="id"
                    :options="clasifications"
                    @filter="filterClasifications"
                    dense
                    bg-color="grey-1"
                    color="grey-14"
                    :rules="[$rules.required('Campo requerido')]"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          Sin resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>

                <div class="col-12 q-mb-xl">
                  <div style="margin-bottom: 8px">
                    <span class="require" v-if="!readonly_show">*</span>
                    Clasificador
                  </div>
                  <q-select
                    options-dense
                    :readonly="readonly_show"
                    outlined
                    v-model="literary_work.clasificators_id"
                    use-input
                    multiple
                    use-chips
                    emit-value
                    map-options
                    option-label="nombre"
                    option-value="id"
                    :options="clasificators"
                    @filter="filterClasificators"
                    :rules="[$rules.required('Campo requerido')]"
                    dense
                    bg-color="grey-1"
                    color="grey-14"
                  >
                    <template v-slot:option="scope">
                      <q-item
                        v-close-popup
                        v-bind="scope.itemProps"
                        v-on="scope.itemEvents"
                      >
                        <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                      </q-item>
                    </template>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          Sin resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">
                    <span class="require" v-if="!readonly_show">*</span> Tipo de
                    Trabajo
                  </div>
                  <q-select
                    options-dense
                    :readonly="readonly_show"
                    outlined
                    v-model="literary_work.tipo_trabajo_id"
                    use-input
                    use-chips
                    option-label="nombre"
                    option-value="id"
                    emit-value
                    map-options
                    :options="types_work"
                    @filter="fitlerTypesWork"
                    dense
                    bg-color="grey-1"
                    color="grey-14"
                    :rules="[$rules.required('Campo requerido')]"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          Sin resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">Poligráfico</div>
                  <q-input
                    :readonly="readonly_show"
                    v-model="literary_work.poligrafico"
                    bg-color="grey-1"
                    dense
                    @update:model-value="
                      (v) => {
                        literary_work.poligrafico = v.replace(
                          /[^0-9a-zA-ZÿÁÉÍÓÚáéíóú\u00f1\u00d1a]/g,
                          ''
                        );
                      }
                    "
                    outlined
                    color="grey-14"
                  ></q-input>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">
                    <span class="require" v-if="!readonly_show">*</span> Grupo
                  </div>
                  <q-select
                    options-dense
                    :readonly="readonly_show"
                    outlined
                    v-model="literary_work.groups_id"
                    use-input
                    multiple
                    use-chips
                    option-label="nombre"
                    option-value="id"
                    emit-value
                    map-options
                    :options="groups"
                    @filter="fitlerGroups"
                    :rules="[$rules.required('Campo requerido')]"
                    dense
                    bg-color="grey-1"
                    color="grey-14"
                  >
                    <template v-slot:option="scope">
                      <q-item
                        v-close-popup
                        v-bind="scope.itemProps"
                        v-on="scope.itemEvents"
                      >
                        <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                      </q-item>
                    </template>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          Sin resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">
                    <span class="require" v-if="!readonly_show">*</span> Género
                  </div>
                  <q-select
                    options-dense
                    :readonly="readonly_show"
                    outlined
                    v-model="literary_work.genders_id"
                    use-input
                    multiple
                    use-chips
                    option-label="nombre"
                    option-value="id"
                    emit-value
                    map-options
                    :options="genders"
                    @filter="fitlerGenders"
                    dense
                    bg-color="grey-1"
                    color="grey-14"
                    :rules="[$rules.required('Campo requerido')]"
                  >
                    <template v-slot:option="scope">
                      <q-item
                        v-close-popup
                        v-bind="scope.itemProps"
                        v-on="scope.itemEvents"
                      >
                        <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                      </q-item>
                    </template>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          Sin resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">
                    <span class="require" v-if="!readonly_show">*</span>
                    Temáticas
                  </div>
                  <q-select
                    options-dense
                    :readonly="readonly_show"
                    outlined
                    v-model="literary_work.tematics_id"
                    use-input
                    multiple
                    use-chips
                    option-label="nombre"
                    option-value="id"
                    emit-value
                    map-options
                    :options="tematics"
                    @filter="fitlerTematics"
                    dense
                    bg-color="grey-1"
                    :rules="[$rules.required('Campo requerido')]"
                    color="grey-14"
                  >
                    <template v-slot:option="scope">
                      <q-item
                        v-close-popup
                        v-bind="scope.itemProps"
                        v-on="scope.itemEvents"
                      >
                        <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                      </q-item>
                    </template>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          Sin resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">
                    <span class="require" v-if="!readonly_show">*</span> Idiomas
                  </div>
                  <q-select
                    options-dense
                    :readonly="readonly_show"
                    outlined
                    v-model="literary_work.languages_id"
                    use-input
                    multiple
                    use-chips
                    option-label="nombre"
                    option-value="id"
                    emit-value
                    map-options
                    :options="languages"
                    @filter="fitlerLanguages"
                    dense
                    bg-color="grey-1"
                    :rules="[$rules.required('Campo requerido')]"
                    color="grey-14"
                  >
                    <template v-slot:option="scope">
                      <q-item
                        v-close-popup
                        v-bind="scope.itemProps"
                        v-on="scope.itemEvents"
                      >
                        <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                      </q-item>
                    </template>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          Sin resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">
                    <span class="require" v-if="!readonly_show">*</span> Tipo de
                    Libro
                  </div>
                  <q-select
                    options-dense
                    :readonly="readonly_show"
                    outlined
                    v-model="literary_work.types_book_id"
                    use-input
                    multiple
                    use-chips
                    option-label="nombre"
                    option-value="id"
                    emit-value
                    map-options
                    :options="types_book"
                    @filter="fitlerTypesBook"
                    dense
                    bg-color="grey-1"
                    :rules="[$rules.required('Campo requerido')]"
                    color="grey-14"
                  >
                    <template v-slot:option="scope">
                      <q-item
                        v-close-popup
                        v-bind="scope.itemProps"
                        v-on="scope.itemEvents"
                      >
                        <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                      </q-item>
                    </template>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          Sin resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>

                <div class="col-12 q-mb-lg">
                  <q-checkbox
                    v-if="!readonly_show || literary_work.sello"
                    :disable="readonly_show"
                    class="self-center"
                    size="xs"
                    label="Con Sello"
                    v-model="literary_work.sello"
                  />
                </div>

                <div class="col-12 q-mb-lg">
                  <q-checkbox
                    v-if="!readonly_show || literary_work.riso"
                    :disable="readonly_show"
                    class="self-center"
                    size="xs"
                    label="Riso"
                    v-model="literary_work.riso"
                  />
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">
                    <span class="require" v-if="!readonly_show">*</span> Edición
                    Editorial
                  </div>
                  <q-input
                    :readonly="readonly_show"
                    v-model="literary_work.edicion_editorial"
                    bg-color="grey-1"
                    dense
                    @update:model-value="
                      (v) => {
                        literary_work.edicion_editorial = v.replace(
                          /[^0-9a-zA-ZÿÁÉÍÓÚáéíóú\u00f1\u00d1a]/g,
                          ''
                        );
                      }
                    "
                    outlined
                    color="grey-14"
                    :rules="[$rules.required('Campo requerido')]"
                  ></q-input>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">
                    <span class="require" v-if="!readonly_show">*</span>
                    Antecedentes
                  </div>
                  <q-input
                    :readonly="readonly_show"
                    v-model="literary_work.antecedentes"
                    bg-color="grey-1"
                    dense
                    @update:model-value="
                      (v) => {
                        literary_work.antecedentes = v.replace(
                          /[^0-9a-zA-ZÿÁÉÍÓÚáéíóú\u00f1\u00d1a]/g,
                          ''
                        );
                      }
                    "
                    outlined
                    color="grey-14"
                    :rules="[$rules.required('Campo requerido')]"
                  ></q-input>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">Películas Recibidas</div>
                  <q-input
                    :readonly="readonly_show"
                    v-model="literary_work.peliculas_recibidas"
                    bg-color="grey-1"
                    dense
                    @update:model-value="
                      (v) => {
                        literary_work.peliculas_recibidas = v.replace(
                          /[^0-9]/g,
                          ''
                        );
                      }
                    "
                    outlined
                    color="grey-14"
                    :rules="[$rules.numeric('Sólo números')]"
                  ></q-input>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">No. Suplemento</div>
                  <q-input
                    :readonly="readonly_show"
                    v-model="literary_work.no_suplemento"
                    bg-color="grey-1"
                    dense
                    @update:model-value="
                      (v) => {
                        literary_work.no_suplemento = v.replace(/[^0-9]/g, '');
                      }
                    "
                    outlined
                    color="grey-14"
                    :rules="[$rules.numeric('Sólo números')]"
                  ></q-input>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">Etapa</div>
                  <q-input
                    :readonly="readonly_show"
                    v-model="literary_work.etapa"
                    bg-color="grey-1"
                    dense
                    @update:model-value="
                      (v) => {
                        literary_work.etapa = v.replace(/[^0-9]/g, '');
                      }
                    "
                    outlined
                    mask="##"
                    color="grey-14"
                    :rules="[$rules.numeric('Sólo números')]"
                  ></q-input>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">Coeficiente</div>
                  <q-input
                    :readonly="readonly_show"
                    v-model="literary_work.coeficiente"
                    bg-color="grey-1"
                    dense
                    @update:model-value="
                      (v) => {
                        literary_work.coeficiente = v.replace(/[^0-9]/g, '');
                      }
                    "
                    outlined
                    color="grey-14"
                    :rules="[$rules.numeric('Sólo números')]"
                  ></q-input>
                </div>

                <div class="row col-12 q-mb-md">
                  <span class="col-12 section">Tirada</span>
                  <div
                    :class="$q.screen.lt.md ? 'col-12' : ''"
                    style="margin-bottom: 8px"
                  >
                    Tirada Plan
                  </div>
                  <q-input
                    :readonly="readonly_show"
                    v-model="literary_work.tirada_plan"
                    style="margin-top: 0px"
                    bg-color="grey-1"
                    dense
                    @update:model-value="
                      (v) => {
                        literary_work.tirada_plan = v.replace(/[^0-9]/g, '');
                      }
                    "
                    outlined
                    color="grey-14"
                    :rules="[$rules.numeric('Sólo números')]"
                  ></q-input>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">Cantidad ENAME</div>
                  <q-input
                    :readonly="readonly_show"
                    v-model="literary_work.cant_ename"
                    bg-color="grey-1"
                    dense
                    @update:model-value="
                      (v) => {
                        literary_work.cant_ename = v.replace(/[^0-9]/g, '');
                      }
                    "
                    outlined
                    color="grey-14"
                    :rules="[$rules.numeric('Sólo números')]"
                  ></q-input>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">Cantidad UEB Ventas</div>
                  <q-input
                    :readonly="readonly_show"
                    v-model="literary_work.cant_ueb_ventas"
                    bg-color="grey-1"
                    dense
                    @update:model-value="
                      (v) => {
                        literary_work.cant_ueb_ventas = v.replace(
                          /[^0-9]/g,
                          ''
                        );
                      }
                    "
                    outlined
                    color="grey-14"
                    :rules="[$rules.numeric('Sólo números')]"
                  ></q-input>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">Cantidad Otros</div>
                  <q-input
                    :readonly="readonly_show"
                    v-model="literary_work.cant_otros"
                    bg-color="grey-1"
                    dense
                    @update:model-value="
                      (v) => {
                        literary_work.cant_otros = v.replace(/[^0-9]/g, '');
                      }
                    "
                    outlined
                    color="grey-14"
                    :rules="[$rules.numeric('Sólo números')]"
                  ></q-input>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">Cantidad Muestras</div>
                  <q-input
                    :readonly="readonly_show"
                    v-model="literary_work.cant_muestras"
                    bg-color="grey-1"
                    dense
                    @update:model-value="
                      (v) => {
                        literary_work.cant_muestras = v.replace(/[^0-9]/g, '');
                      }
                    "
                    outlined
                    color="grey-14"
                    :rules="[$rules.numeric('Sólo números')]"
                  ></q-input>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">Precio Obra</div>
                  <q-input
                    :readonly="readonly_show"
                    v-model="literary_work.precio_obra"
                    bg-color="grey-1"
                    dense
                    @update:model-value="
                      (v) => {
                        literary_work.precio_obra = v.replace(/[^0-9]/g, '');
                      }
                    "
                    outlined
                    color="grey-14"
                    :rules="[$rules.numeric('Sólo números')]"
                  ></q-input>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">Precio Costo</div>
                  <q-input
                    :readonly="readonly_show"
                    v-model="literary_work.precio_costo"
                    bg-color="grey-1"
                    dense
                    @update:model-value="
                      (v) => {
                        literary_work.precio_costo = v.replace(/[^0-9]/g, '');
                      }
                    "
                    outlined
                    color="grey-14"
                    :rules="[$rules.numeric('Sólo números')]"
                  ></q-input>
                </div>
                <div class="row col-12">
                  <div class="col-3 q-mb-md">
                    <div style="margin-bottom: 8px; color: transparent">-</div>
                    <div style="margin-bottom: 8px; color: transparent">-</div>
                  </div>
                </div>
              </div>
            </div>
          </q-form>
        </q-tab-pane>
        <!-- Pasaporte de Ebook tab -->
        <q-tab-pane
          v-if="
            type_ === 'e' || type_ === 'a' || type_ === 'apk' || digitalFormat()
          "
          name="passport_ebook"
        >
          <q-form ref="digitalForm">
            <div class="row" style="margin-left: 50px; margin-top: 8px">
              <div class="col-12">
                <span class="filters-empty">Los campos marcados con un (</span>
                <span class="require header" v-if="!readonly_show">*</span>
                <span class="filters-empty">) son obligatorios</span>
              </div>
            </div>
            <div class="row">
              <div
                v-if="
                  type_ === 'a' ||
                  type_ === 'e' ||
                  type_ === 'apk' ||
                  digitalFormat()
                "
                class="row col-12 q-px-xl q-py-lg"
              >
                <div class="row col-12">
                  <span class="col-12 section q-mb-md">Datos Genéricos</span>
                  <div class="col-12 q-mb-lg">
                    <div style="margin-bottom: 8px">
                      <span class="require" v-if="!readonly_show">*</span>Título
                    </div>
                    <q-input
                      :readonly="readonly_show"
                      class="col-12"
                      v-model="literary_work.titulo"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.titulo = v.replace(
                            /[^a-zA-Z-0-9ÿÁÉÍÓÚáéíóú\u00f1\u00d1a ]/g,
                            ''
                          );
                        }
                      "
                      outlined
                      color="grey-14"
                      :rules="[$rules.required('Campo requerido')]"
                    ></q-input>
                  </div>
                </div>

                <div class="row col-12">
                  <div class="col-12 q-mb-lg">
                    <div style="margin-bottom: 8px">
                      <span class="require" v-if="!readonly_show">*</span
                      >Subtítulo
                    </div>
                    <q-input
                      :readonly="readonly_show"
                      class="col-12"
                      v-model="literary_work.subtitulo"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.subtitulo = v.replace(
                            /[^a-zA-Z-0-9ÿÁÉÍÓÚáéíóú\u00f1\u00d1a ]/g,
                            ''
                          );
                        }
                      "
                      outlined
                      color="grey-14"
                      :rules="[$rules.required('Campo requerido')]"
                    ></q-input>
                  </div>
                </div>

                <div class="row col-4">
                  <div class="col-12 q-mb-lg">
                    <div style="margin-bottom: 8px">
                      <span class="require" v-if="!readonly_show">*</span
                      >Idiomas
                    </div>
                    <q-select
                      options-dense
                      :readonly="readonly_show"
                      outlined
                      v-model="literary_work.languages_id"
                      use-input
                      multiple
                      use-chips
                      option-label="nombre"
                      option-value="id"
                      emit-value
                      map-options
                      :options="languages"
                      @filter="fitlerLanguages"
                      bg-color="grey-1"
                      color="grey-14"
                      :rules="[$rules.required('Campo requerido')]"
                      dense
                    >
                      <template v-slot:option="scope">
                        <q-item
                          v-close-popup
                          v-bind="scope.itemProps"
                          v-on="scope.itemEvents"
                        >
                          <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                        </q-item>
                      </template>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            Sin resultados
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                </div>

                <div class="row col-12 q-gutter-lg">
                  <div class="col-3 q-mb-lg">
                    <div style="margin-bottom: 8px">Precio CUP</div>
                    <q-input
                      :readonly="readonly_show"
                      class="col-12"
                      v-model="literary_work.precio_cup"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.precio_cup = v.replace(/[^0-9]/g, '');
                        }
                      "
                      outlined
                      color="grey-14"
                    ></q-input>
                  </div>
                  <div class="col-3 q-mb-lg">
                    <div style="margin-bottom: 8px">Precio USD</div>
                    <q-input
                      :readonly="readonly_show"
                      class="col-12"
                      v-model="literary_work.precio_usd"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.precio_usd = v.replace(/[^0-9]/g, '');
                        }
                      "
                      outlined
                      color="grey-14"
                    ></q-input>
                  </div>
                  <div class="col-3 q-mb-lg">
                    <div
                      style="
                        margin-bottom: 8px;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                      "
                    >
                      <span class="require" v-if="!readonly_show">*</span>No.
                      Doc Aprobación
                    </div>
                    <q-input
                      :readonly="readonly_show"
                      class="col-12"
                      v-model="literary_work.no_doc_aprobacion"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.no_doc_aprobacion = v.replace(
                            /[^0-9]/g,
                            ''
                          );
                        }
                      "
                      outlined
                      color="grey-14"
                      :rules="[
                        $rules.required('Campo requerido'),
                        $rules.numeric('Sólo números'),
                      ]"
                    ></q-input>
                  </div>
                </div>

                <div class="row col-3">
                  <div class="col-12 q-mb-lg">
                    <div style="margin-bottom: 8px">
                      <span class="require" v-if="!readonly_show">*</span>Peso
                    </div>
                    <q-input
                      :readonly="readonly_show"
                      class="col-12"
                      v-model="literary_work.peso"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.peso = v.replace(/[^0-9]/g, '');
                        }
                      "
                      outlined
                      color="grey-14"
                      :rules="[
                        $rules.required('Campo requerido'),
                        $rules.numeric('Sólo números'),
                      ]"
                    ></q-input>
                  </div>
                </div>

                <div class="row col-12">
                  <div class="col-12 q-mb-lg">
                    <div style="margin-bottom: 8px">
                      Palabras Claves o Metadatos
                    </div>
                    <q-input
                      :readonly="readonly_show"
                      class="col-12"
                      v-model="literary_work.clav_meta"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.subtitulo = v.replace(
                            /[^a-zA-Z-0-9ÿÁÉÍÓÚáéíóú\u00f1\u00d1a ]/g,
                            ''
                          );
                        }
                      "
                      outlined
                      color="grey-14"
                    ></q-input>
                  </div>
                </div>
                <div
                  v-if="
                    type_ === 'APK' ||
                    literary_work.tipo_trabajo.nombre === 'APK'
                  "
                  class="row col-12"
                >
                  <div class="col-3 q-mb-lg">
                    <div style="margin-bottom: 8px; color: transparent">-</div>
                    <div style="margin-bottom: 8px; color: transparent">-</div>
                  </div>
                </div>
              </div>

              <div
                v-if="
                  type_ === 'a' ||
                  literary_work.tipo_trabajo.nombre === 'Audiolibro'
                "
                class="row col-12 q-px-xl"
              >
                <span class="col-12 section q-mb-md">Audiolibros</span>
                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">
                    <span class="require" v-if="!readonly_show">*</span
                    >Autor(es)
                  </div>
                  <q-select
                    options-dense
                    :readonly="readonly_show"
                    outlined
                    bg-color="grey-1"
                    dense
                    v-model="literary_work.authors_id"
                    option-label="nombre"
                    option-value="id"
                    use-input
                    emit-value
                    map-options
                    color="grey-14"
                    :rules="[$rules.required('Campo requerido')]"
                    multiple
                    use-chips
                    :options="authors_filtered"
                    @filter="filterAuthor"
                    hint="Seleccione o cree el(los) autor(es)"
                  >
                    <template v-slot:option="scope">
                      <q-item
                        v-close-popup
                        v-bind="scope.itemProps"
                        v-on="scope.itemEvents"
                      >
                        <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                      </q-item>
                    </template>
                    <template v-slot:append>
                      <q-spinner-tail v-if="loading" color="grey-14" />
                    </template>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey row justify-center">
                          <q-spinner-tail
                            class="col-12"
                            size="xl"
                            v-if="loading"
                            color="grey-14"
                          />
                          <q-input
                            v-else
                            :readonly="readonly_show"
                            v-model="model_author"
                            dense
                            @update:model-value="
                              (v) => {
                                model_author = v.replace(
                                  /[^a-zA-Z-ÿÁÉÍÓÚáéíóú\u00f1\u00d1a ]/g,
                                  ''
                                );
                              }
                            "
                            :rules="[filterNewAuthor]"
                            @keyup="filterNewAuthor"
                            :error="error"
                            :error-message="error_msg"
                            class="q-mb-sm"
                            label="Crear un nuevo autor"
                            color="grey-14"
                            outlined
                            hint="Introduzca el nombre del autor y añádalo presionando el símbolo de + a su derecha"
                          >
                            <template v-slot:prepend>
                              <q-icon name="person" color="grey-14" />
                            </template>
                            <template v-slot:after>
                              <q-btn
                                flat
                                :ripple="false"
                                dense
                                class="add-b"
                                :disable="model_author === '' || exist_author"
                                icon="add_box"
                                @click="addAuthor"
                                size="xl"
                              />
                            </template>
                          </q-input>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">
                    <span class="require" v-if="!readonly_show">*</span
                    >Narrador(es)
                  </div>
                  <q-input
                    :readonly="readonly_show"
                    class="col-12"
                    v-model="literary_work.narradores"
                    bg-color="grey-1"
                    dense
                    @update:model-value="
                      (v) => {
                        literary_work.narradores = v.replace(
                          /[^a-zA-Z-ÿÁÉÍÓÚáéíóú\u00f1\u00d1a ]/g,
                          ''
                        );
                      }
                    "
                    outlined
                    color="grey-14"
                    :rules="[$rules.required('Campo requerido')]"
                  ></q-input>
                </div>

                <div class="col-3 q-mb-lg">
                  <div style="margin-bottom: 8px">
                    <span class="require" v-if="!readonly_show">*</span>Número
                    de Pistas
                  </div>
                  <q-input
                    :readonly="readonly_show"
                    class="col-12"
                    v-model="literary_work.num_pistas"
                    bg-color="grey-1"
                    dense
                    @update:model-value="
                      (v) => {
                        literary_work.num_pistas = v.replace(/[^0-9]/g, '');
                      }
                    "
                    outlined
                    color="grey-14"
                    :rules="[
                      $rules.required('Campo requerido'),
                      $rules.numeric('Sólo números'),
                    ]"
                  ></q-input>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">Derechos de Autor</div>
                  <q-input
                    :readonly="readonly_show"
                    class="col-12"
                    v-model="literary_work.derechos_autor"
                    bg-color="grey-1"
                    dense
                    @update:model-value="
                      (v) => {
                        literary_work.derechos_autor = v.replace(
                          /[^a-zA-Z-ÿÁÉÍÓÚáéíóú\u00f1\u00d1a ]/g,
                          ''
                        );
                      }
                    "
                    outlined
                    color="grey-14"
                  ></q-input>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">
                    <span class="require" v-if="!readonly_show">*</span
                    >Descripción Comercial
                  </div>
                  <q-input
                    :readonly="readonly_show"
                    class="col-12"
                    style="padding-bottom: 0px"
                    v-model="literary_work.desc_comercial"
                    bg-color="grey-1"
                    dense
                    @update:model-value="
                      (v) => {
                        literary_work.desc_comercial = v.replace(
                          /[^a-zA-Z-0-9ÿÁÉÍÓÚáéíóú\u00f1\u00d1a ]/g,
                          ''
                        );
                      }
                    "
                    type="textarea"
                    outlined
                    counter
                    maxlength="5000"
                    color="grey-14"
                    :rules="[$rules.required('Campo requerido')]"
                  ></q-input>
                  <!-- <q-file
                    borderless
                    dense
                    v-model="fichero"
                    label="Subir fichero"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file> -->
                </div>

                <div class="row col-12">
                  <div class="col-4 q-mb-lg">
                    <div style="margin-bottom: 8px">
                      <span class="require" v-if="!readonly_show">*</span
                      >Público Objetivo
                    </div>
                    <q-select
                      options-dense
                      :readonly="readonly_show"
                      outlined
                      v-model="literary_work.publicos_audiolibro_id"
                      use-input
                      multiple
                      use-chips
                      option-label="nombre"
                      option-value="id"
                      emit-value
                      map-options
                      :options="publicos_audiolibro"
                      @filter="fitlerPublicosAudiolibro"
                      dense
                      bg-color="grey-1"
                      :rules="[$rules.required('Campo requerido')]"
                      color="grey-14"
                    >
                      <template v-slot:option="scope">
                        <q-item
                          v-close-popup
                          v-bind="scope.itemProps"
                          v-on="scope.itemEvents"
                        >
                          <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                        </q-item>
                      </template>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            Sin resultados
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                </div>

                <div class="row col-12">
                  <div class="col-4 q-mb-lg">
                    <div style="margin-bottom: 8px">
                      <span class="require" v-if="!readonly_show">*</span
                      >Versión
                    </div>
                    <q-select
                      options-dense
                      :readonly="readonly_show"
                      bg-color="grey-1"
                      color="grey-14"
                      dense
                      outlined
                      v-model="literary_work.version"
                      :options="['Completa', 'Abreviada']"
                      :rules="[$rules.required('Campo requerido')]"
                    />
                  </div>
                </div>

                <div class="row col-12">
                  <div class="col-4 q-mb-lg">
                    <q-checkbox
                      v-if="!readonly_show || literary_work.cont_muestra"
                      :disable="readonly_show"
                      class="self-center"
                      size="xs"
                      label="Contiene Muestra"
                      v-model="literary_work.cont_muestra"
                    />
                  </div>
                </div>

                <!-- <div class="row col-12">
                  <div class="col-4 q-mb-lg">
                    <div style="margin-bottom: 8px">Muestra</div>
                    <q-select
                      options-dense
                      :readonly="readonly_show"
                      bg-color="grey-1"
                      color="grey-14"
                      dense
                      outlined
                      v-model="literary_work.muestra"
                      :options="muestra"
                    />
                  </div>
                </div> -->
                <div class="row col-12">
                  <div class="col-3 q-mb-lg">
                    <div style="margin-bottom: 8px; color: transparent">-</div>
                    <div style="margin-bottom: 8px; color: transparent">-</div>
                  </div>
                </div>
              </div>

              <div
                v-if="
                  type_ === 'e' ||
                  literary_work.tipo_trabajo.nombre === 'EPUB' ||
                  literary_work.tipo_trabajo.nombre === 'PDF'
                "
                class="row col-12 q-px-xl"
              >
                <span class="col-12 section q-mb-md">Ebook</span>
                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">
                    <span class="require" v-if="!readonly_show">*</span
                    >Autor(es)
                  </div>
                  <q-select
                    options-dense
                    :readonly="readonly_show"
                    outlined
                    bg-color="grey-1"
                    dense
                    v-model="literary_work.authors_id"
                    option-label="nombre"
                    option-value="id"
                    emit-value
                    map-options
                    use-input
                    color="grey-14"
                    :rules="[$rules.required('Campo requerido')]"
                    multiple
                    use-chips
                    :options="authors_filtered"
                    @filter="filterAuthor"
                    hint="Seleccione o cree el(los) autor(es)"
                  >
                    <template v-slot:option="scope">
                      <q-item
                        v-close-popup
                        v-bind="scope.itemProps"
                        v-on="scope.itemEvents"
                      >
                        <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                      </q-item>
                    </template>
                    <template v-slot:append>
                      <q-spinner-tail v-if="loading" color="grey-14" />
                    </template>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey row justify-center">
                          <q-spinner-tail
                            class="col-12"
                            size="xl"
                            v-if="loading"
                            color="grey-14"
                          />
                          <q-input
                            :readonly="readonly_show"
                            v-else
                            v-model="model_author"
                            dense
                            @update:model-value="
                              (v) => {
                                model_author = v.replace(
                                  /[^a-zA-Z-ÿÁÉÍÓÚáéíóú\u00f1\u00d1a ]/g,
                                  ''
                                );
                              }
                            "
                            :rules="[filterNewAuthor]"
                            :error="error"
                            :error-message="error_msg"
                            @keyup="filterNewAuthor"
                            class="q-mb-sm"
                            label="Crear un nuevo autor"
                            color="grey-14"
                            outlined
                            hint="Introduzca el nombre del autor y añádalo presionando el símbolo de + a su derecha"
                          >
                            <template v-slot:prepend>
                              <q-icon name="person" color="grey-14" />
                            </template>
                            <template v-slot:after>
                              <q-btn
                                flat
                                dense
                                class="add-b"
                                :disable="model_author === '' || exist_author"
                                icon="add_box"
                                @click="addAuthor"
                                size="xl"
                              />
                            </template>
                          </q-input>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">Versión del Epub</div>
                  <q-input
                    :readonly="readonly_show"
                    class="col-12"
                    v-model="literary_work.version_epub"
                    bg-color="grey-1"
                    dense
                    @update:model-value="
                      (v) => {
                        literary_work.version_epub = v.replace(
                          /[^a-zA-Z-0-9ÿÁÉÍÓÚáéíóú\u00f1\u00d1a ]/g,
                          ''
                        );
                      }
                    "
                    outlined
                    color="grey-14"
                  ></q-input>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">Sobre derecho del Autor</div>
                  <q-input
                    :readonly="readonly_show"
                    class="col-12"
                    v-model="literary_work.sobre_derec_autor"
                    bg-color="grey-1"
                    dense
                    @update:model-value="
                      (v) => {
                        literary_work.sobre_derec_autor = v.replace(
                          /[^a-zA-Z-0-9ÿÁÉÍÓÚáéíóú\u00f1\u00d1a ]/g,
                          ''
                        );
                      }
                    "
                    outlined
                    color="grey-14"
                  ></q-input>
                </div>

                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">Colaborador(es)</div>
                  <q-input
                    :readonly="readonly_show"
                    class="col-12"
                    v-model="literary_work.colaboradores"
                    bg-color="grey-1"
                    dense
                    @update:model-value="
                      (v) => {
                        literary_work.colaboradores = v.replace(
                          /[^a-zA-Z-ÿÁÉÍÓÚáéíóú\u00f1\u00d1a ]/g,
                          ''
                        );
                      }
                    "
                    outlined
                    color="grey-14"
                  ></q-input>
                </div>

                <div class="row col-12 q-gutter-lg">
                  <div class="col-3 q-mb-lg">
                    <div style="margin-bottom: 8px">
                      <span class="require" v-if="!readonly_show">*</span>Nombre
                      de la Colección
                    </div>
                    <q-input
                      :readonly="readonly_show"
                      class="col-12"
                      v-model="literary_work.nombre_coleccion"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.nombre_coleccion = v.replace(
                            /[^a-zA-Z-ÿÁÉÍÓÚáéíóú\u00f1\u00d1a ]/g,
                            ''
                          );
                        }
                      "
                      outlined
                      color="grey-14"
                      :rules="[$rules.required('Campo requerido')]"
                    ></q-input>
                  </div>
                  <div class="col-3 q-mb-lg">
                    <div style="margin-bottom: 8px">
                      <span class="require" v-if="!readonly_show">*</span>Número
                      de la Colección
                    </div>
                    <q-input
                      :readonly="readonly_show"
                      class="col-12"
                      v-model="literary_work.numero_coleccion"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.numero_coleccion = v.replace(
                            /[^0-9]/g,
                            ''
                          );
                        }
                      "
                      outlined
                      color="grey-14"
                      :rules="[
                        $rules.required('Campo requerido'),
                        $rules.numeric('Sólo números'),
                      ]"
                    ></q-input>
                  </div>
                </div>

                <div class="row col-12">
                  <div class="col-12 q-mb-lg">
                    <div style="margin-bottom: 8px">Descripción Comercial</div>
                    <q-input
                      :readonly="readonly_show"
                      class="col-12"
                      v-model="literary_work.desc_comercial"
                      bg-color="grey-1"
                      dense
                      counter
                      maxlength="5000"
                      type="textarea"
                      outlined
                      color="grey-14"
                    ></q-input>
                  </div>
                </div>

                <div class="row col-12">
                  <div class="col-12 q-mb-lg">
                    <div style="margin-bottom: 8px">
                      Novedades de la Versión
                    </div>
                    <q-input
                      :readonly="readonly_show"
                      class="col-12"
                      v-model="literary_work.nove_version"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.nove_version = v.replace(
                            /[^a-zA-Z0-9-ÿÁÉÍÓÚáéíóú\u00f1\u00d1a ]/g,
                            ''
                          );
                        }
                      "
                      outlined
                      color="grey-14"
                    ></q-input>
                  </div>
                </div>

                <div class="row col-12">
                  <div class="col-12 q-mb-lg">
                    <div style="margin-bottom: 8px">Reseñas Editoriales</div>
                    <q-input
                      :readonly="readonly_show"
                      class="col-12"
                      v-model="literary_work.rese_editoriales"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.rese_editoriales = v.replace(
                            /[^a-zA-Z-ÿÁÉÍÓÚáéíóú\u00f1\u00d1a ]/g,
                            ''
                          );
                        }
                      "
                      outlined
                      color="grey-14"
                    ></q-input>
                  </div>
                </div>

                <div class="row col-12">
                  <div class="col-12 q-mb-lg">
                    <div style="margin-bottom: 8px">
                      Nombre y apellidos de quién escribe la reseña
                    </div>
                    <q-input
                      :readonly="readonly_show"
                      class="col-12"
                      v-model="literary_work.nombre_apellidos"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.nombre_apellidos = v.replace(
                            /[^a-zA-Z-ÿÁÉÍÓÚáéíóú\u00f1\u00d1a ]/g,
                            ''
                          );
                        }
                      "
                      outlined
                      color="grey-14"
                    ></q-input>
                  </div>
                </div>

                <div class="row col-12">
                  <div class="col-12 q-mb-lg">
                    <div style="margin-bottom: 8px">Fuente de la Reseña</div>
                    <q-input
                      :readonly="readonly_show"
                      class="col-12"
                      v-model="literary_work.fuente_resenha"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.fuente_resenha = v.replace(
                            /[^a-zA-Z-ÿÁÉÍÓÚáéíóú\u00f1\u00d1a ]/g,
                            ''
                          );
                        }
                      "
                      outlined
                      color="grey-14"
                    ></q-input>
                  </div>
                </div>

                <div class="row col-12">
                  <div class="col-12 q-mb-lg">
                    <div style="margin-bottom: 8px">
                      Descripción de la Reseña
                    </div>
                    <q-input
                      v-if="
                        literary_work.descripcion_resenha !== null &&
                        !readonly_show
                      "
                      :readonly="readonly_show"
                      class="col-12"
                      v-model="literary_work.descripcion_resenha"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.descripcion_resenha = v.replace(
                            /[^a-zA-Z0-9ÿÁÉÍÓÚáéíóú\u00f1\u00d1a ]/g,
                            ''
                          );
                        }
                      "
                      type="textarea"
                      outlined
                      color="grey-14"
                    ></q-input>
                  </div>
                </div>

                <div class="row col-12">
                  <div class="col-12 q-mb-lg">
                    <div style="margin-bottom: 8px">
                      <span class="require" v-if="!readonly_show">*</span
                      >Clasificación
                    </div>
                    <q-select
                      options-dense
                      :readonly="readonly_show"
                      outlined
                      v-model="literary_work.clasificators_id"
                      use-input
                      multiple
                      use-chips
                      emit-value
                      map-options
                      option-label="nombre"
                      option-value="id"
                      :options="clasificators"
                      @filter="filterClasificators"
                      dense
                      bg-color="grey-1"
                      color="grey-14"
                      :rules="[$rules.required('Campo requerido')]"
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            Sin resultados
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                </div>

                <div class="row col-12">
                  <div class="col-12 q-mb-lg">
                    <div style="margin-bottom: 8px">
                      <span class="require" v-if="!readonly_show">*</span>Género
                    </div>
                    <q-select
                      options-dense
                      :readonly="readonly_show"
                      outlined
                      v-model="literary_work.genders_id"
                      use-input
                      multiple
                      use-chips
                      option-label="nombre"
                      option-value="id"
                      emit-value
                      map-options
                      :options="genders"
                      @filter="fitlerGenders"
                      dense
                      bg-color="grey-1"
                      color="grey-14"
                      :rules="[$rules.required('Campo requerido')]"
                    >
                      <template v-slot:option="scope">
                        <q-item
                          v-close-popup
                          v-bind="scope.itemProps"
                          v-on="scope.itemEvents"
                        >
                          <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                        </q-item>
                      </template>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            Sin resultados
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                </div>

                <div class="row col-12">
                  <div class="col-12 q-mb-lg">
                    <div style="margin-bottom: 8px">
                      <span class="require" v-if="!readonly_show">*</span
                      >Temática
                    </div>
                    <q-select
                      options-dense
                      :readonly="readonly_show"
                      outlined
                      v-model="literary_work.tematics_id"
                      use-input
                      multiple
                      use-chips
                      option-label="nombre"
                      option-value="id"
                      emit-value
                      map-options
                      :options="tematics"
                      @filter="fitlerTematics"
                      dense
                      bg-color="grey-1"
                      color="grey-14"
                      :rules="[$rules.required('Campo requerido')]"
                    >
                      <template v-slot:option="scope">
                        <q-item
                          v-close-popup
                          v-bind="scope.itemProps"
                          v-on="scope.itemEvents"
                        >
                          <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                        </q-item>
                      </template>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            Sin resultados
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                </div>

                <div class="row col-12">
                  <div class="col-12 q-mb-lg">
                    <div style="margin-bottom: 8px">Material Explícito</div>
                    <q-input
                      :readonly="readonly_show"
                      class="col-12"
                      v-model="literary_work.material_expl"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.material_expl = v.replace(
                            /[^a-zA-Z-ÿÁÉÍÓÚáéíóú\u00f1\u00d1a ]/g,
                            ''
                          );
                        }
                      "
                      outlined
                      color="grey-14"
                    ></q-input>
                  </div>
                </div>

                <div class="row col-12">
                  <div class="col-4 q-mb-lg">
                    <div style="margin-bottom: 8px">
                      <span class="require" v-if="!readonly_show">*</span>Tipo
                      de Libro
                    </div>
                    <q-select
                      options-dense
                      :readonly="readonly_show"
                      outlined
                      v-model="literary_work.types_book_id"
                      use-input
                      multiple
                      use-chips
                      option-label="nombre"
                      option-value="id"
                      emit-value
                      map-options
                      :options="types_book"
                      @filter="fitlerTypesBook"
                      dense
                      bg-color="grey-1"
                      :rules="[$rules.required('Campo requerido')]"
                      color="grey-14"
                    >
                      <template v-slot:option="scope">
                        <q-item
                          v-close-popup
                          v-bind="scope.itemProps"
                          v-on="scope.itemEvents"
                        >
                          <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                        </q-item>
                      </template>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            Sin resultados
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                </div>

                <div class="row col-12">
                  <div class="col-4 q-mb-lg">
                    <div style="margin-bottom: 8px">
                      <span class="require" v-if="!readonly_show">*</span
                      >Público Objetivo
                    </div>
                    <q-select
                      options-dense
                      :readonly="readonly_show"
                      outlined
                      v-model="literary_work.publicos_ebook_id"
                      use-input
                      multiple
                      use-chips
                      option-label="nombre"
                      option-value="id"
                      emit-value
                      map-options
                      :options="publicos_ebook"
                      @filter="fitlerPublicosEbook"
                      dense
                      bg-color="grey-1"
                      :rules="[$rules.required('Campo requerido')]"
                      color="grey-14"
                    >
                      <template v-slot:option="scope">
                        <q-item
                          v-close-popup
                          v-bind="scope.itemProps"
                          v-on="scope.itemEvents"
                        >
                          <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                        </q-item>
                      </template>
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            Sin resultados
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                </div>

                <div class="row col-12">
                  <div class="col-12 q-mb-lg">
                    <div style="margin-bottom: 8px">Edición</div>
                    <q-input
                      :readonly="readonly_show"
                      class="col-12"
                      v-model="literary_work.edicion"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.edicion = v.replace(
                            /[^a-zA-Z-ÿÁÉÍÓÚáéíóú\u00f1\u00d1a ]/g,
                            ''
                          );
                        }
                      "
                      outlined
                      color="grey-14"
                    ></q-input>
                  </div>
                </div>

                <div class="row col-12">
                  <div class="col-4 q-mb-lg">
                    <q-checkbox
                      v-if="!readonly_show || literary_work.cont_muestra"
                      :disable="readonly_show"
                      class="self-center"
                      size="xs"
                      label="Contiene Cubierta Mejorada"
                      v-model="literary_work.cont_muestra"
                    />
                  </div>
                </div>

                <div class="row col-12">
                  <div class="col-3 q-mb-lg">
                    <div style="margin-bottom: 8px">Imágenes Interiores</div>
                    <q-input
                      :readonly="readonly_show"
                      class="col-12"
                      v-model="literary_work.imag_interiores"
                      bg-color="grey-1"
                      dense
                      @update:model-value="
                        (v) => {
                          literary_work.imag_interiores = v.replace(
                            /[^0-9]/g,
                            ''
                          );
                        }
                      "
                      outlined
                      color="grey-14"
                      :rules="[$rules.numeric('Sólo números')]"
                    ></q-input>
                  </div>
                </div>
                <div class="row col-12">
                  <div class="col-3 q-mb-lg">
                    <div style="margin-bottom: 8px; color: transparent">-</div>
                    <div style="margin-bottom: 8px; color: transparent">-</div>
                  </div>
                </div>
              </div>
            </div>
          </q-form>
        </q-tab-pane>

        <!-- Información Adicional tab -->
        <q-tab-pane name="adicional_info">
          <q-form ref="adicionalForm">
            <div class="row" style="margin-left: 50px; margin-top: 8px">
              <div class="col-12">
                <span class="filters-empty">Los campos marcados con un (</span>
                <span class="require header" v-if="!readonly_show">*</span>
                <span class="filters-empty">) son obligatorios</span>
              </div>
            </div>
            <div class="row">
              <div class="row col-12 q-px-xl q-py-lg">
                <div
                  class="row col-12 q-gutter-lg"
                  style="height: 220px"
                  :style="$q.screen.lt.md ? 'height: 170px;' : ''"
                >
                  <div class="col q-mb-lg">
                    <div style="margin-bottom: 8px">Portada</div>
                    <input
                      v-if="!readonly_show"
                      accept="image/*"
                      type="file"
                      id="file"
                      @change="onFileChangePortada"
                      style="display: none"
                    />
                    <label
                      class="file"
                      :style="
                        $q.screen.lt.md ? 'width: 6.5em; height: 6.5em;' : ''
                      "
                      for="file"
                    >
                      <q-icon
                        v-if="url_portada === null && !readonly_show"
                        size="40px"
                        name="add_photo_alternate"
                        style="color: white"
                      />

                      <img
                        v-if="url_portada !== null"
                        class="img-perfil"
                        :src="url_portada"
                        :style="
                          $q.screen.lt.md ? 'width: 6.4em; height: 6.4em;' : ''
                        "
                      />
                      <div
                        class="hover"
                        :style="
                          $q.screen.lt.md ? 'width: 6.4em; height: 6.4em;' : ''
                        "
                      >
                        <q-icon
                          @click.prevent="deletePortada"
                          v-if="url_portada !== null && !readonly_show"
                          size="30px"
                          class="icon-file-delete"
                          name="delete"
                        />
                      </div>
                    </label>
                  </div>
                  <div class="col q-mb-lg">
                    <div style="margin-bottom: 8px">Ilustraciones</div>
                    <input
                      v-if="!readonly_show"
                      accept="image/*"
                      id="filei1"
                      type="file"
                      @change="onFileChangeIlust1"
                      style="display: none"
                    />
                    <label
                      class="file"
                      for="filei1"
                      :style="
                        $q.screen.lt.md ? 'width: 6.5em; height: 6.5em;' : ''
                      "
                    >
                      <q-icon
                        v-if="url_ilust1 === null && !readonly_show"
                        size="40px"
                        name="add_photo_alternate"
                        style="color: white"
                      />

                      <img
                        v-if="url_ilust1 !== null"
                        class="img-perfil"
                        :src="url_ilust1"
                        :style="
                          $q.screen.lt.md ? 'width: 6.4em; height: 6.4em;' : ''
                        "
                      />
                      <div
                        class="hover"
                        :style="
                          $q.screen.lt.md ? 'width: 6.4em; height: 6.4em;' : ''
                        "
                      >
                        <q-icon
                          @click.prevent="deleteIlust1"
                          v-if="url_ilust1 !== null && !readonly_show"
                          size="30px"
                          class="icon-file-delete"
                          name="delete"
                        />
                      </div>
                    </label>
                  </div>
                  <div class="col q-mb-lg" style="margin-top: 54px">
                    <input
                      v-if="!readonly_show"
                      accept="image/*"
                      id="filei2"
                      type="file"
                      @change="onFileChangeIlust2"
                      style="display: none"
                    />
                    <label
                      class="file"
                      for="filei2"
                      :style="
                        $q.screen.lt.md ? 'width: 6.5em; height: 6.5em;' : ''
                      "
                    >
                      <q-icon
                        v-if="url_ilust2 === null && !readonly_show"
                        size="40px"
                        name="add_photo_alternate"
                        style="color: white"
                      />

                      <img
                        v-if="url_ilust2 !== null"
                        class="img-perfil"
                        :src="url_ilust2"
                        :style="
                          $q.screen.lt.md ? 'width: 6.4em; height: 6.4em;' : ''
                        "
                      />
                      <div
                        class="hover"
                        :style="
                          $q.screen.lt.md ? 'width: 6.4em; height: 6.4em;' : ''
                        "
                      >
                        <q-icon
                          @click.prevent="deleteIlust2"
                          v-if="url_ilust2 !== null && !readonly_show"
                          size="30px"
                          class="icon-file-delete"
                          name="delete"
                        />
                      </div>
                    </label>
                  </div>
                  <div class="col q-mb-lg" style="margin-top: 54px">
                    <input
                      v-if="!readonly_show"
                      accept="image/*"
                      id="filei3"
                      type="file"
                      @change="onFileChangeIlust3"
                      style="display: none"
                    />
                    <label
                      class="file"
                      for="filei3"
                      :style="
                        $q.screen.lt.md ? 'width: 6.5em; height: 6.5em;' : ''
                      "
                    >
                      <q-icon
                        v-if="url_ilust3 === null && !readonly_show"
                        size="40px"
                        name="add_photo_alternate"
                        style="color: white"
                      />

                      <img
                        v-if="url_ilust3 !== null"
                        class="img-perfil"
                        :src="url_ilust3"
                        :style="
                          $q.screen.lt.md ? 'width: 6.4em; height: 6.4em;' : ''
                        "
                      />
                      <div
                        class="hover"
                        :style="
                          $q.screen.lt.md ? 'width: 6.4em; height: 6.4em;' : ''
                        "
                      >
                        <q-icon
                          @click.prevent="deleteIlust3"
                          v-if="url_ilust3 !== null && !readonly_show"
                          size="30px"
                          class="icon-file-delete"
                          name="delete"
                        />
                      </div>
                    </label>
                  </div>
                  <div class="col q-mb-lg" style="margin-top: 54px">
                    <input
                      v-if="!readonly_show"
                      accept="image/*"
                      id="filei4"
                      type="file"
                      @change="onFileChangeIlust4"
                      style="display: none"
                    />
                    <label
                      class="file"
                      for="filei4"
                      :style="
                        $q.screen.lt.md ? 'width: 6.5em; height: 6.5em;' : ''
                      "
                    >
                      <q-icon
                        v-if="url_ilust4 === null && !readonly_show"
                        size="40px"
                        name="add_photo_alternate"
                        style="color: white"
                      />

                      <img
                        v-if="url_ilust4 !== null"
                        class="img-perfil"
                        :src="url_ilust4"
                        :style="
                          $q.screen.lt.md ? 'width: 6.4em; height: 6.4em;' : ''
                        "
                      />
                      <div
                        class="hover"
                        :style="
                          $q.screen.lt.md ? 'width: 6.4em; height: 6.4em;' : ''
                        "
                      >
                        <q-icon
                          @click.prevent="deleteIlust4"
                          v-if="url_ilust4 !== null && !readonly_show"
                          size="30px"
                          class="icon-file-delete"
                          name="delete"
                        />
                      </div>
                    </label>
                  </div>
                  <div class="col q-mb-lg" style="margin-top: 54px">
                    <input
                      v-if="!readonly_show"
                      accept="image/*"
                      id="filei5"
                      type="file"
                      @change="onFileChangeIlust5"
                      style="display: none"
                    />
                    <label
                      class="file"
                      for="filei5"
                      :style="
                        $q.screen.lt.md ? 'width: 6.5em; height: 6.5em;' : ''
                      "
                    >
                      <q-icon
                        v-if="url_ilust5 === null && !readonly_show"
                        size="40px"
                        name="add_photo_alternate"
                        style="color: white"
                      />

                      <img
                        v-if="url_ilust5 !== null"
                        class="img-perfil"
                        :src="url_ilust5"
                        :style="
                          $q.screen.lt.md ? 'width: 6.4em; height: 6.4em;' : ''
                        "
                      />
                      <div
                        class="hover"
                        :style="
                          $q.screen.lt.md ? 'width: 6.4em; height: 6.4em;' : ''
                        "
                      >
                        <q-icon
                          @click.prevent="deleteIlust5"
                          v-if="url_ilust5 !== null && !readonly_show"
                          size="30px"
                          class="icon-file-delete"
                          name="delete"
                        />
                      </div>
                    </label>
                  </div>
                </div>

                <span class="col-12 section q-mb-lg"
                  >Trabajadores por Departamento</span
                >
                <div style="margin-bottom: 8px">Edición</div>
                <!-- <div
                  class="row col-12"
                  style="height: 50px"
                  v-for="(item, index) in edit_list_worker"
                  :key="index"
                > -->
                <div class="col-12 q-mb-md">
                  <q-select
                    options-dense
                    :readonly="readonly_show"
                    bg-color="grey-1"
                    dense
                    outlined
                    color="grey-14"
                    map-options
                    use-chips
                    @filter="filterEmployeeEdition"
                    use-input
                    multiple
                    emit-value
                    option-label="name"
                    option-value="id"
                    v-model="edit_list_worker"
                    :options="employees_edition"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          Sin resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <!-- <div
                    v-if="edit_list_worker.length > 1 && !readonly_show"
                    class="col-1 q-ml-md x"
                  >
                    <q-btn
                      style="border-radius: 10px"
                      size="11px"
                      outline
                      padding="10px"
                      icon="close"
                      color="grey-4"
                      @click="remove(index, 'edit_worker')"
                    />
                  </div>
                </div> -->
                <!-- <div class="col-12 q-mb-lg">
                  <q-btn
                    v-if="!readonly_show"
                    outline
                    color="grey-4"
                    style="border-radius: 10px"
                    icon="add"
                    label="Añadir"
                    @click="add('edit_worker')"
                    class="col-1"
                  />
                </div> -->

                <div style="margin-bottom: 8px">Diseño de Cubierta</div>
                <!-- <div
                  class="row col-12"
                  style="height: 50px"
                  v-for="(item, index) in design_cub_list"
                  :key="index"
                > -->
                <div class="col-12 q-mb-md">
                  <q-select
                    options-dense
                    :readonly="readonly_show"
                    bg-color="grey-1"
                    dense
                    outlined
                    color="grey-14"
                    map-options
                    emit-value
                    use-chips
                    multiple
                    option-label="name"
                    option-value="id"
                    @filter="filterEmployeeDesignCub"
                    use-input
                    v-model="design_cub_list"
                    :options="employees_design_cub"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          Sin resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <!-- <div
                    v-if="design_cub_list.length > 1 && !readonly_show"
                    class="col-1 q-ml-md x"
                  >
                    <q-btn
                      style="border-radius: 10px"
                      size="11px"
                      padding="10px"
                      outline
                      icon="close"
                      color="grey-4"
                      @click="remove(index, 'design_cub')"
                    />
                  </div>
                </div> -->
                <!-- <div class="col-12 q-mb-lg">
                  <q-btn
                    v-if="!readonly_show"
                    outline
                    color="grey-4"
                    style="border-radius: 10px"
                    icon="add"
                    label="Añadir"
                    @click="add('design_cub')"
                    class="col-1"
                  />
                </div> -->
                <div style="margin-bottom: 8px">Diseño Interior</div>
                <!-- <div
                  class="row col-12"
                  style="height: 50px"
                  v-for="(item, index) in design_int_list"
                  :key="index"
                > -->
                <div class="col-12 q-mb-md">
                  <q-select
                    options-dense
                    :readonly="readonly_show"
                    bg-color="grey-1"
                    dense
                    outlined
                    color="grey-14"
                    map-options
                    emit-value
                    use-chips
                    option-label="name"
                    option-value="id"
                    multiple
                    @filter="filterEmployeeDesignInt"
                    use-input
                    v-model="design_int_list"
                    :options="employees_design_int"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          Sin resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <!-- <div
                    v-if="design_int_list.length > 1 && !readonly_show"
                    class="col-1 q-ml-md x"
                  >
                    <q-btn
                      style="border-radius: 10px"
                      size="11px"
                      outline
                      padding="10px"
                      icon="close"
                      color="grey-4"
                      @click="remove(index, 'design_int')"
                    />
                  </div>
                </div> -->
                <!-- <div class="col-12 q-mb-lg">
                  <q-btn
                    outline
                    v-if="!readonly_show"
                    color="grey-4"
                    style="border-radius: 10px"
                    icon="add"
                    label="Añadir"
                    @click="add('design_int')"
                    class="col-1"
                  />
                </div> -->
                <div style="margin-bottom: 8px">Emplane</div>
                <!-- <div
                  class="row col-12"
                  style="height: 50px"
                  v-for="(item, index) in emplane_list"
                  :key="index"
                > -->
                <div class="col-12 q-mb-md">
                  <q-select
                    options-dense
                    :readonly="readonly_show"
                    bg-color="grey-1"
                    dense
                    outlined
                    color="grey-14"
                    use-chips
                    map-options
                    emit-value
                    option-label="name"
                    option-value="id"
                    multiple
                    @filter="filterEmployeeEmplane"
                    use-input
                    v-model="emplane_list"
                    :options="employees_emplane"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          Sin resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <!-- <div
                    v-if="emplane_list.length > 1 && !readonly_show"
                    class="col-1 q-ml-md x"
                  >
                    <q-btn
                      style="border-radius: 10px"
                      size="11px"
                      outline
                      padding="10px"
                      icon="close"
                      color="grey-4"
                      @click="remove(index, 'emplane')"
                    />
                  </div>
                </div> -->
                <!-- <div class="col-12 q-mb-lg">
                  <q-btn
                    outline
                    v-if="!readonly_show"
                    color="grey-4"
                    style="border-radius: 10px"
                    icon="add"
                    label="Añadir"
                    @click="add('emplane')"
                    class="col-1"
                  />
                </div> -->

                <span class="col-12 section q-mb-lg">Reseña</span>
                <div class="col-12 q-mb-lg">
                  <div style="margin-bottom: 8px">
                    <span class="require" v-if="!readonly_show">*</span> Pequeña
                    Reseña de la Obra
                  </div>

                  <q-input
                    :readonly="readonly_show"
                    class="col-12"
                    style="padding-bottom: 0px"
                    v-model="literary_work.peq_resenha_obra"
                    bg-color="grey-1"
                    dense
                    type="textarea"
                    maxlength="1750"
                    counter
                    outlined
                    color="grey-14"
                    :rules="[
                      $rules.required('Campo requerido'),
                      /*  $rules.minLength(750, 'Mínimo 750 caracteres'), */
                    ]"
                  ></q-input>
                </div>
                <span class="col-12 section q-mb-lg">Sitios de Venta</span>
                <div class="col-4" style="margin-bottom: 8px">Nombre</div>
                <!-- <div
                  class="row col-12"
                  style="height: 50px"
                  v-for="(item, index) in places_list"
                  :key="index"
                > -->
                <div class="col-12 q-mb-md">
                  <q-select
                    options-dense
                    :readonly="readonly_show"
                    bg-color="grey-1"
                    dense
                    outlined
                    color="grey-14"
                    map-options
                    emit-value
                    option-label="nombre"
                    option-value="id"
                    multiple
                    use-chips
                    @filter="filterPlaces"
                    use-input
                    v-model="places_list"
                    :options="places"
                  >
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          Sin resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <!-- <div class="col q-mb-md q-ml-md">
                    <q-input
                      bg-color="grey-1"
                      dense
                      readonly
                      outlined
                      color="grey-14"
                      v-model="places_list[index].direccion"
                    />
                  </div> -->
                <!-- <div
                    v-if="places_list.length > 1 && !readonly_show"
                    class="col-1 q-ml-md x"
                  >
                    <q-btn
                      style="border-radius: 10px"
                      size="11px"
                      outline
                      padding="10px"
                      icon="close"
                      color="grey-4"
                      @click="remove(index, 'places')"
                    />
                  </div>
                </div> -->
                <!-- <div class="col-12 q-mb-xl">
                  <q-btn
                    outline
                    color="grey-4"
                    style="border-radius: 10px"
                    icon="add"
                    v-if="!readonly_show"
                    label="Añadir"
                    @click="add('places')"
                    class="col-1"
                  />
                </div> -->
                <div class="row col-12">
                  <div class="col-3 q-mb-sm">
                    <div style="margin-bottom: 8px; color: transparent">-</div>
                    <div style="margin-bottom: 8px; color: transparent">-</div>
                  </div>
                </div>
              </div>
            </div>
          </q-form>
        </q-tab-pane>
      </q-tab-panels>
    </q-card>

    <div class="actions-btns admin-style">
      <div style="padding-left: 60px" class="row items-center">
        <q-btn
          class="q-mr-md"
          style="border-radius: 10px"
          v-if="
            tab !== 'adicional_info' &&
            tab !== 'passport_ebook' &&
            (type_ === 'e' ||
              type_ === 'a' ||
              type_ === 'apk' ||
              digitalFormat())
          "
          color="light-green-14"
          @click="nextTab('continuar', 'passport_ebook')"
          label="Continuar"
        />
        <q-btn
          class="q-mr-md"
          style="border-radius: 10px"
          v-if="
            tab !== 'adicional_info' &&
            type_ !== 'e' &&
            type_ !== 'a' &&
            type_ !== 'apk' &&
            !digitalFormat()
          "
          color="light-green-14"
          @click="nextTab('continuar', 'adicional_info')"
          label="Continuar"
        />
        <q-btn
          class="q-mr-md"
          style="border-radius: 10px"
          v-if="tab !== 'adicional_info' && tab !== 'passport_fis'"
          color="light-green-14"
          @click="nextTab('continuar', 'adicional_info')"
          label="Continuar"
        />
        <q-btn
          class="q-mr-md"
          v-if="
            tab !== 'passport_fis' &&
            tab !== 'passport_ebook' &&
            (type_ === 'e' ||
              type_ === 'a' ||
              type_ === 'apk' ||
              digitalFormat())
          "
          style="border-radius: 10px"
          color="light-green-14"
          @click="nextTab('atras', 'passport_ebook')"
          label="Atrás"
        />
        <q-btn
          class="q-mr-md"
          v-if="tab !== 'passport_fis' && tab !== 'adicional_info'"
          style="border-radius: 10px"
          color="light-green-14"
          @click="nextTab('atras', 'passport_fis')"
          label="Atrás"
        />
        <q-btn
          class="q-mr-md"
          v-if="
            tab !== 'passport_fis' &&
            type_ !== 'e' &&
            type_ !== 'a' &&
            type_ !== 'apk' &&
            !digitalFormat()
          "
          style="border-radius: 10px"
          color="light-green-14"
          @click="nextTab('atras', 'passport_fis')"
          label="Atrás"
        />
        <q-btn
          class="q-mr-md"
          style="border-radius: 10px"
          color="light-green-14"
          @click="confirmChanges"
          label="Cancelar"
        />
        <q-btn
          class="q-mr-md"
          v-if="!readonly_show && tab === 'adicional_info'"
          :loading="loading_btn_submit"
          style="border-radius: 10px"
          color="light-green-14"
          @click="
            literary_work.id !== null ? action('editar') : action('crear')
          "
          :label="literary_work.id !== null ? 'Guardar Cambios' : 'Crear'"
        >
          <template v-slot:loading>
            <q-spinner-dots color="white" size="2rem" />
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

  <q-dialog persistent v-model="expedient_info">
    <q-card style="width: 300px">
      <q-card-section>
        <div class="text-h6">
          Acerca del Expediente

          <q-icon name="info" size="35px" style="color: #2277aa" />
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        La obra que desea crear no tiene un expediente asociado. Se creará el
        expediente <b>{{ literary_work.titulo }}</b> ?
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn
          @click="createExpedient"
          style="color: #2277aa"
          flat
          label="Aceptar"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="show_confirm" persistent>
    <q-card style="width: 330px">
      <q-card-section class="row items-center">
        <q-avatar icon="info" style="color: #2277aa" />
        <span class="q-ml-sm"
          >Hay
          <b>cambios</b>
          en los datos de la
          <b>obra</b>
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
import { Notify } from "quasar";
import { useQuasar, QSpinnerTail } from "quasar";

const old_isbn = ref(null);
const old_isbn_obra = ref(null);
const old_cpcu = ref(null);
const show_confirm = ref(false);
const show = ref(false);
const form = ref({ authors_id: [] });
const model = ref([]);
const type_ = ref("");
const edit_list_worker = ref([]);
const edit_list_worker_copy = ref([]);
const design_cub_list = ref([]);
const design_cub_list_copy = ref([]);
const design_int_list = ref([]);
const design_int_list_copy = ref([]);
const emplane_list = ref([]);
const emplane_list_copy = ref([]);
const places_list = ref([]);
const places_list_copy = ref([]);
const places_address_list = ref([]);
const places_address_list_copy = ref([]);
const model_author = ref("");
const new_authors = ref({ names: [] });
const new_authors_to_add = ref({ names: [] });
const error_isbn = ref(false);
const error_message_isbn = ref("");
const error_isbn_obra = ref(false);
const error_message_isbn_obra = ref("");
const error_cpcu = ref(false);
const error_message_cpcu = ref("");
const url_portada = ref(null);
const url_ilust1 = ref(null);
const url_ilust2 = ref(null);
const url_ilust3 = ref(null);
const url_ilust4 = ref(null);
const readonly_show = ref(false);
const url_ilust5 = ref(null);
const literary_work = ref({
  titulo: ref(null),
  new_expedient: ref(false),
  id: ref(null),
  expediente_id: ref(null),
  tipo_trabajo_id: ref(null),
  tipo_trabajo: ref(""),
  clasificacion_id: ref(null),
  codigo: ref(null),
  isbn: ref(null),
  derechos_autor_talento_artistico: ref(null),
  isbn_obra: ref(null),
  servicios_cuc: ref(null),
  servicios_mn: ref(null),
  cpcu: ref(null),
  usuario: ref(null),
  acetato: ref(null),
  pelicula_positiva: ref(null),
  original_impreso: ref(null),
  cdrom: ref(null),
  tripa: ref(null),
  cubierta: ref(null),
  cubierta_retiro: ref(null),
  flexiback: ref(false),
  hilo: ref(false),
  rustica: ref(false),
  caballete: ref(false),
  poligrafico: ref(null),
  entrega_ueb_editorial: ref(null),
  plan_terminado_ueb_editorial: ref(null),
  ancho: ref(null),
  alto: ref(null),
  sello: ref(false),
  riso: ref(false),
  edicion_editorial: ref(null),
  compl_general: ref(null),
  compl_general_valor: ref(null),
  compl_redaccion: ref(null),
  compl_mecanografia: ref(null),
  compl_correccion: ref(null),
  compl_ilustracion: ref(null),
  compl_prensa: ref(null),
  compl_prensa_valor: ref(null),
  ilust_cant: ref(null),
  ilust_linea: ref(null),
  ilust_color: ref(null),
  ilust_fotos: ref(null),
  peliculas_recibidas: ref(null),
  no_suplemento: ref(null),
  etapa: ref(null),
  plan: ref(null),
  comentarios: ref(null),
  obsv_pasaporte: ref(null),
  coeficiente: ref(null),
  paginas: ref(null),
  antecedentes: ref(null),
  tirada_plan: ref(null),
  cant_ename: ref(null),
  cant_ueb_ventas: ref(null),
  cant_otros: ref(null),
  cant_muestras: ref(null),
  precio_obra: ref(null),
  precio_costo: ref(null),
  entrada: ref(null),
  a_edicion: ref(null),
  devuelto: ref(null),
  cancelado: ref(null),
  registro: ref(null),
  term_editorial: ref(null),
  entr_sev_poligrafico: ref(null),
  entr_industria: ref(null),
  terminado: ref(null),
  pr: ref(null),
  art: ref(null),
  lh: ref(null),
  may: ref(null),
  m: ref(null),
  vc: ref(null),
  cf: ref(null),
  ss: ref(null),
  ca: ref(null),
  c: ref(null),
  lt: ref(null),
  h: ref(null),
  g: ref(null),
  sc: ref(null),
  gmo: ref(null),
  ename: ref(null),
  mined: ref(null),
  muestra: ref(null),
  otros: ref(null),
  total: ref(null),
  suma: ref(null),
  subtitulo: ref(null),
  peso: ref(null),
  precio_cup: ref(null),
  precio_usd: ref(null),
  no_doc_aprobacion: ref(null),
  clav_meta: ref(null),
  narradores: ref(null),
  num_pistas: ref(null),
  derechos_autor: ref(null),
  desc_comercial: ref(null),
  version: ref(null),
  portada: ref(null),
  ilustracion1: ref(null),
  ilustracion2: ref(null),
  ilustracion3: ref(null),
  ilustracion4: ref(null),
  ilustracion5: ref(null),
  cont_muestra: ref(false),
  muestra: ref(null),
  version_epub: ref(null),
  sobre_derec_autor: ref(null),
  colaboradores: ref(null),
  nombre_coleccion: ref(null),
  numero_coleccion: ref(null),
  nove_version: ref(null),
  rese_editoriales: ref(null),
  nombre_apellidos: ref(null),
  fuente_resenha: ref(null),
  descripcion_resenha: ref(null),
  material_expl: ref(null),
  edicion: ref(null),
  imag_interiores: ref(null),
  detalles_obra: ref(null),
  personal_edicion: ref(null),
  personal_disenho_cub: ref(null),
  personal_disenho_int: ref(null),
  personal_emplane: ref(null),
  peq_resenha_obra: ref(null),
  authors_id: ref([]),
  places_list: ref([]),
  groups_id: ref([]),
  languages_id: ref([]),
  papers_id: ref([]),
  types_book_id: ref([]),
  cardboards_id: ref([]),
  genders_id: ref([]),
  clasificators_id: ref([]),
  tematics_id: ref([]),
  publicos_audiolibro_id: ref([]),
  publicos_ebook_id: ref([]),
  usuarios_obra_id: ref([]),
});

export default {
  name: "FormDialog",
  props: {
    show_dialog: Boolean,
    item: Object,
    type_to_create: String,
    readonly: Boolean,
  },
  watch: {
    show_dialog() {
      show.value = this.show_dialog;
    },
    type_to_create() {
      type_.value = this.type_to_create;
      console.log(type_.value);
    },
    readonly() {
      readonly_show.value = this.readonly;
    },
    item() {
      if (this.item && this.item.id) {
        old_isbn.value = this.item.isbn;
        old_isbn_obra.value = this.item.isbn_obra;
        old_cpcu.value = this.item.cpcu;
        literary_work.value.expediente_id = this.item.expediente;
        literary_work.value.id = this.item.id;
        literary_work.value.titulo = this.item.titulo;
        literary_work.value.clasificacion_id = this.item.clasificacion_id;
        literary_work.value.tipo_trabajo_id = this.item.tipo_trabajo_id;
        literary_work.value.tipo_trabajo = this.item.tipo_trabajo;
        literary_work.value.codigo = this.item.codigo;
        literary_work.value.isbn = this.item.isbn;
        literary_work.value.derechos_autor_talento_artistico =
          this.item.derechos_autor_talento_artistico;
        literary_work.value.isbn_obra = this.item.isbn_obra;
        literary_work.value.servicios_cuc = this.item.servicios_cuc;
        literary_work.value.servicios_mn = this.item.servicios_mn;
        literary_work.value.cpcu = this.item.cpcu;
        literary_work.value.acetato = this.item.acetato;
        literary_work.value.pelicula_positiva = this.item.pelicula_positiva;
        literary_work.value.original_impreso = this.item.original_impreso;
        literary_work.value.cdrom = this.item.cdrom;
        literary_work.value.tripa = this.item.tripa;
        literary_work.value.cubierta = this.item.cubierta;
        literary_work.value.cubierta_retiro = this.item.cubierta_retiro;
        literary_work.value.flexiback =
          this.item.flexiback === 0 ? false : true;
        literary_work.value.hilo = this.item.hilo === 0 ? false : true;
        literary_work.value.rustica = this.item.rustica === 0 ? false : true;
        literary_work.value.caballete =
          this.item.caballete === 0 ? false : true;
        literary_work.value.poligrafico = this.item.poligrafico;
        literary_work.value.entrega_ueb_editorial =
          this.item.entrega_ueb_editorial;
        literary_work.value.plan_terminado_ueb_editorial =
          this.item.plan_terminado_ueb_editorial;
        literary_work.value.ancho = this.item.ancho;
        literary_work.value.alto = this.item.alto;
        literary_work.value.sello = this.item.sello === 0 ? false : true;
        literary_work.value.riso = this.item.riso === 0 ? false : true;
        literary_work.value.edicion_editorial = this.item.edicion_editorial;
        literary_work.value.compl_general = this.item.compl_general;
        literary_work.value.compl_general_valor = this.item.compl_general_valor;
        literary_work.value.compl_redaccion = this.item.compl_redaccion;
        literary_work.value.compl_mecanografia = this.item.compl_mecanografia;
        literary_work.value.compl_correccion = this.item.compl_correccion;
        literary_work.value.compl_ilustracion = this.item.compl_ilustracion;
        literary_work.value.compl_prensa = this.item.compl_prensa;
        literary_work.value.compl_prensa_valor = this.item.compl_prensa_valor;
        literary_work.value.ilust_cant = this.item.ilust_cant;
        literary_work.value.ilust_linea = this.item.ilust_linea;
        literary_work.value.ilust_color = this.item.ilust_color;
        literary_work.value.ilust_fotos = this.item.ilust_fotos;
        literary_work.value.peliculas_recibidas = this.item.peliculas_recibidas;
        literary_work.value.no_suplemento = this.item.no_suplemento;
        literary_work.value.etapa = this.item.etapa;
        literary_work.value.plan = this.item.plan;
        literary_work.value.comentarios = this.item.comentarios;
        literary_work.value.obsv_pasaporte = this.item.obsv_pasaporte;
        literary_work.value.coeficiente = this.item.coeficiente;
        literary_work.value.paginas = this.item.paginas;
        literary_work.value.antecedentes = this.item.antecedentes;
        literary_work.value.tirada_plan = this.item.tirada_plan;
        literary_work.value.cant_ename = this.item.cant_ename;
        literary_work.value.cant_ueb_ventas = this.item.cant_ueb_ventas;
        literary_work.value.cant_otros = this.item.cant_otros;
        literary_work.value.cant_muestras = this.item.cant_muestras;
        literary_work.value.precio_obra = this.item.precio_obra;
        literary_work.value.precio_costo = this.item.precio_costo;
        literary_work.value.entrada = this.item.entrada;
        literary_work.value.a_edicion = this.item.a_edicion;
        literary_work.value.devuelto = this.item.devuelto;
        literary_work.value.cancelado = this.item.cancelado;
        literary_work.value.registro = this.item.registro;
        literary_work.value.term_editorial = this.item.term_editorial;
        literary_work.value.entr_sev_poligrafico =
          this.item.entr_sev_poligrafico;
        literary_work.value.entr_industria = this.item.entr_industria;
        literary_work.value.terminado = this.item.terminado;
        literary_work.value.pr = this.item.pr;
        literary_work.value.art = this.item.art;
        literary_work.value.lh = this.item.lh;
        literary_work.value.may = this.item.may;
        literary_work.value.m = this.item.m;
        literary_work.value.vc = this.item.vc;
        literary_work.value.cf = this.item.cf;
        literary_work.value.ss = this.item.ss;
        literary_work.value.ca = this.item.ca;
        literary_work.value.c = this.item.c;
        literary_work.value.lt = this.item.lt;
        literary_work.value.h = this.item.h;
        literary_work.value.g = this.item.g;
        literary_work.value.sc = this.item.sc;
        literary_work.value.gmo = this.item.gmo;
        literary_work.value.ename = this.item.ename;
        literary_work.value.mined = this.item.mined;
        literary_work.value.muestra = this.item.muestra;
        literary_work.value.otros = this.item.otros;
        literary_work.value.total = this.item.total;
        literary_work.value.suma = this.item.suma;
        literary_work.value.subtitulo = this.item.subtitulo;
        literary_work.value.peso = this.item.peso;
        literary_work.value.precio_cup = this.item.precio_cup;
        literary_work.value.precio_usd = this.item.precio_usd;
        literary_work.value.no_doc_aprobacion = this.item.no_doc_aprobacion;
        literary_work.value.clav_meta = this.item.clav_meta;
        literary_work.value.narradores = this.item.narradores;
        literary_work.value.num_pistas = this.item.num_pistas;
        literary_work.value.derechos_autor = this.item.derechos_autor;
        literary_work.value.desc_comercial = this.item.desc_comercial;
        literary_work.value.version = this.item.version;
        literary_work.value.portada = this.item.portada;
        url_portada.value =
          this.item.portada !== null
            ? `${process.env.API}/storage/${this.item.portada}`
            : null;
        literary_work.value.ilustracion1 = this.item.ilustracion1;
        url_ilust1.value =
          this.item.ilustracion1 !== null
            ? `${process.env.API}/storage/${this.item.ilustracion1}`
            : null;
        literary_work.value.ilustracion2 = this.item.ilustracion2;
        url_ilust2.value =
          this.item.ilustracion2 !== null
            ? `${process.env.API}/storage/${this.item.ilustracion2}`
            : null;
        literary_work.value.ilustracion3 = this.item.ilustracion3;
        url_ilust3.value =
          this.item.ilustracion3 !== null
            ? `${process.env.API}/storage/${this.item.ilustracion3}`
            : null;
        literary_work.value.ilustracion4 = this.item.ilustracion4;
        url_ilust4.value =
          this.item.ilustracion4 !== null
            ? `${process.env.API}/storage/${this.item.ilustracion4}`
            : null;
        literary_work.value.ilustracion5 = this.item.ilustracion5;
        url_ilust5.value =
          this.item.ilustracion5 !== null
            ? `${process.env.API}/storage/${this.item.ilustracion5}`
            : null;
        literary_work.value.cont_muestra =
          this.item.cont_muestra === 0 ? false : true;
        literary_work.value.muestra = this.item.muestra;
        literary_work.value.version_epub = this.item.version_epub;
        literary_work.value.sobre_derec_autor = this.item.sobre_derec_autor;
        literary_work.value.colaboradores = this.item.colaboradores;
        literary_work.value.nombre_coleccion = this.item.nombre_coleccion;
        literary_work.value.numero_coleccion = this.item.numero_coleccion;
        literary_work.value.nove_version = this.item.nove_version;
        literary_work.value.rese_editoriales = this.item.rese_editoriales;
        literary_work.value.nombre_apellidos = this.item.nombre_apellidos;
        literary_work.value.fuente_resenha = this.item.fuente_resenha;
        literary_work.value.descripcion_resenha = this.item.descripcion_resenha;
        literary_work.value.material_expl = this.item.material_expl;
        literary_work.value.edicion = this.item.edicion;
        literary_work.value.imag_interiores = this.item.imag_interiores;
        literary_work.value.detalles_obra = this.item.detalles_obra;
        literary_work.value.personal_edicion = this.item.personal_edicion;
        literary_work.value.personal_disenho_cub =
          this.item.personal_disenho_cub;
        literary_work.value.personal_disenho_int =
          this.item.personal_disenho_int;
        literary_work.value.personal_emplane = this.item.personal_emplane;
        literary_work.value.peq_resenha_obra = this.item.peq_resenha_obra;
        literary_work.value.groups_id = this.item.grupos;
        literary_work.value.papers_id = this.item.papeles;
        literary_work.value.cardboards_id = this.item.cartulinas;
        literary_work.value.clasificators_id = this.item.clasificadores;
        literary_work.value.languages_id = this.item.idiomas;
        literary_work.value.genders_id = this.item.generos;
        literary_work.value.types_book_id = this.item.tipos_libro;
        literary_work.value.tematics_id = this.item.tematicas;
        literary_work.value.publicos_audiolibro_id =
          this.item.publicos_audiolibro;
        literary_work.value.publicos_ebook_id = this.item.publicos_ebook;
        literary_work.value.usuarios_obra_id = this.item.usuarios_editorial;
        literary_work.value.authors_id = this.item.autores;
        places_list.value = this.item.ventas;
        if (this.item.users.length === 0) {
          edit_list_worker.value = [];
          design_cub_list.value = [];
          design_int_list.value = [];
          emplane_list.value = [];
        } else {
          let edicion = 0;
          let disenho_cub = 0;
          let disenho_int = 0;
          let emplane = 0;
          this.item.users.forEach((user) => {
            if (user.pivot.relacion === "edicion") {
              edicion++;
              edit_list_worker.value =
                edicion === 1 ? [] : edit_list_worker.value;
              edit_list_worker.value.push(user);
            } else if (user.pivot.relacion === "disenho_cubierta") {
              disenho_cub++;
              design_cub_list.value =
                disenho_cub === 1 ? [] : design_cub_list.value;
              design_cub_list.value.push(user);
            } else if (user.pivot.relacion === "disenho_interior") {
              disenho_int++;
              design_int_list.value =
                disenho_int === 1 ? [] : design_int_list.value;
              design_int_list.value.push(user);
            } else if (user.pivot.relacion === "emplane") {
              emplane++;
              emplane_list.value = emplane === 1 ? [] : emplane_list.value;
              emplane_list.value.push(user);
            }
          });
          edit_list_worker.value = edicion > 0 ? edit_list_worker.value : [];
          design_cub_list.value = disenho_cub > 0 ? design_cub_list.value : [];
          design_int_list.value = disenho_int > 0 ? design_int_list.value : [];
          emplane_list.value = emplane > 0 ? emplane_list.value : [];
        }

        new_authors.value = { names: [] };
        new_authors_to_add.value = { names: [] };
      } else {
        literary_work.value.id = null;
        literary_work.value.expediente_id = null;
        literary_work.value.clasificacion_id = null;
        literary_work.value.titulo = null;
        if (type_.value === "a") {
          literary_work.value.tipo_trabajo = types_work_list.value.data.filter(
            (type_work) => {
              return type_work.nombre === "Audiolibro";
            }
          );
          literary_work.value.tipo_trabajo =
            literary_work.value.tipo_trabajo.length > 0
              ? literary_work.value.tipo_trabajo[0]
              : "";
        }
        if (type_.value === "apk") {
          literary_work.value.tipo_trabajo = types_work_list.value.data.filter(
            (type_work) => {
              return type_work.nombre === "APK";
            }
          );
          literary_work.value.tipo_trabajo =
            literary_work.value.tipo_trabajo.length > 0
              ? literary_work.value.tipo_trabajo[0]
              : "";
        }
        literary_work.value.tipo_trabajo_id = null;
        literary_work.value.codigo = null;
        literary_work.value.isbn = null;
        literary_work.value.derechos_autor_talento_artistico = null;
        literary_work.value.isbn_obra = null;
        literary_work.value.servicios_cuc = null;
        literary_work.value.servicios_mn = null;
        literary_work.value.cpcu = null;
        literary_work.value.usuario = null;
        literary_work.value.acetato = null;
        literary_work.value.pelicula_positiva = null;
        literary_work.value.original_impreso = null;
        literary_work.value.cdrom = null;
        literary_work.value.tripa = null;
        literary_work.value.cubierta = null;
        literary_work.value.cubierta_retiro = null;
        literary_work.value.flexiback = false;
        literary_work.value.hilo = false;
        literary_work.value.rustica = false;
        literary_work.value.caballete = false;
        literary_work.value.poligrafico = null;
        literary_work.value.entrega_ueb_editorial = null;
        literary_work.value.plan_terminado_ueb_editorial = null;
        literary_work.value.ancho = null;
        literary_work.value.alto = null;
        literary_work.value.sello = false;
        literary_work.value.riso = false;
        literary_work.value.edicion_editorial = null;
        literary_work.value.compl_general = null;
        literary_work.value.compl_general_valor = null;
        literary_work.value.compl_redaccion = null;
        literary_work.value.compl_mecanografia = null;
        literary_work.value.compl_correccion = null;
        literary_work.value.compl_ilustracion = null;
        literary_work.value.compl_prensa = null;
        literary_work.value.compl_prensa_valor = null;
        literary_work.value.ilust_cant = null;
        literary_work.value.ilust_linea = null;
        literary_work.value.ilust_color = null;
        literary_work.value.ilust_fotos = null;
        literary_work.value.peliculas_recibidas = null;
        literary_work.value.no_suplemento = null;
        literary_work.value.etapa = null;
        literary_work.value.plan = null;
        literary_work.value.comentarios = null;
        literary_work.value.obsv_pasaporte = null;
        literary_work.value.coeficiente = null;
        literary_work.value.paginas = null;
        literary_work.value.antecedentes = null;
        literary_work.value.tirada_plan = null;
        literary_work.value.cant_ename = null;
        literary_work.value.cant_ueb_ventas = null;
        literary_work.value.cant_otros = null;
        literary_work.value.cant_muestras = null;
        literary_work.value.precio_obra = null;
        literary_work.value.precio_costo = null;
        literary_work.value.entrada = null;
        literary_work.value.a_edicion = null;
        literary_work.value.devuelto = null;
        literary_work.value.cancelado = null;
        literary_work.value.registro = null;
        literary_work.value.term_editorial = null;
        literary_work.value.entr_sev_poligrafico = null;
        literary_work.value.entr_industria = null;
        literary_work.value.terminado = null;
        literary_work.value.pr = null;
        literary_work.value.art = null;
        literary_work.value.lh = null;
        literary_work.value.may = null;
        literary_work.value.m = null;
        literary_work.value.vc = null;
        literary_work.value.cf = null;
        literary_work.value.ss = null;
        literary_work.value.ca = null;
        literary_work.value.c = null;
        literary_work.value.lt = null;
        literary_work.value.h = null;
        literary_work.value.g = null;
        literary_work.value.sc = null;
        literary_work.value.gmo = null;
        literary_work.value.ename = null;
        literary_work.value.mined = null;
        literary_work.value.muestra = null;
        literary_work.value.otros = null;
        literary_work.value.total = null;
        literary_work.value.suma = null;
        literary_work.value.subtitulo = null;
        literary_work.value.peso = null;
        literary_work.value.precio_cup = null;
        literary_work.value.precio_usd = null;
        literary_work.value.no_doc_aprobacion = null;
        literary_work.value.clav_meta = null;
        literary_work.value.narradores = null;
        literary_work.value.num_pistas = null;
        literary_work.value.derechos_autor = null;
        literary_work.value.desc_comercial = null;
        literary_work.value.version = null;
        literary_work.value.portada = null;
        literary_work.value.ilustracion1 = null;
        literary_work.value.ilustracion2 = null;
        literary_work.value.ilustracion3 = null;
        literary_work.value.ilustracion4 = null;
        literary_work.value.ilustracion5 = null;
        literary_work.value.cont_muestra = false;
        literary_work.value.muestra = null;
        literary_work.value.version_epub = null;
        literary_work.value.sobre_derec_autor = null;
        literary_work.value.colaboradores = null;
        literary_work.value.nombre_coleccion = null;
        literary_work.value.numero_coleccion = null;
        literary_work.value.nove_version = null;
        literary_work.value.rese_editoriales = null;
        literary_work.value.nombre_apellidos = null;
        literary_work.value.fuente_resenha = null;
        literary_work.value.descripcion_resenha = null;
        literary_work.value.material_expl = null;
        literary_work.value.edicion = null;
        literary_work.value.imag_interiores = null;
        literary_work.value.detalles_obra = null;
        literary_work.value.personal_edicion = null;
        literary_work.value.personal_disenho_cub = null;
        literary_work.value.personal_disenho_int = null;
        literary_work.value.personal_emplane = null;
        literary_work.value.peq_resenha_obra = null;
        literary_work.value.authors_id = [];
        literary_work.value.groups_id = [];
        literary_work.value.languages_id = [];
        literary_work.value.publicos_audiolibro_id = [];
        literary_work.value.publicos_ebook_id = [];
        literary_work.value.usuarios_obra_id = [];
        literary_work.value.papers_id = [];
        literary_work.value.types_book_id = [];
        literary_work.value.cardboards_id = [];
        literary_work.value.genders_id = [];
        literary_work.value.clasificators_id = [];
        edit_list_worker.value = [];
        design_cub_list.value = [];
        design_int_list.value = [];
        emplane_list.value = [];
        places_list.value = [];
        new_authors.value = { names: [] };
        new_authors_to_add.value = { names: [] };
      }
    },
  },

  setup(props, { emit }) {
    const expedient_info = ref(false);
    const item_ref = toRef(props, "item");
    const physicalForm = ref();
    const digitalForm = ref();
    const adicionalForm = ref();
    const exist_author = ref(false);
    const all_expedients = ref([]);
    const expedients = ref([]);
    const tab = ref("passport_fis");
    const tematics_list = ref([]);
    const $q = useQuasar();
    $q.screen.setSizes({ md: 1330 });
    const usuarios_obra_list = ref([]);
    const publicos_audiolibro_list = ref([]);
    const publicos_ebook_list = ref([]);
    const employees_edition = ref([]);
    const employees_design_cub = ref([]);
    const employees_design_int = ref([]);
    const employees_emplane = ref([]);
    const tematics = ref([]);
    const usuarios_obra = ref([]);
    const publicos_audiolibro = ref([]);
    const publicos_ebook = ref([]);
    const genders_list = ref([]);
    const genders = ref([]);
    const languages_list = ref([]);
    const languages = ref([]);
    const clasificators_list = ref([]);
    const clasificators = ref([]);
    const clasifications_list = ref([]);
    const clasifications = ref([]);
    const groups_list = ref([]);
    const groups = ref([]);
    const types_work_list = ref([]);
    const types_work = ref([]);
    const types_book_list = ref([]);
    const types_book = ref([]);
    const types_paper_list = ref([]);
    const types_paper = ref([]);
    const types_cardboard_list = ref([]);
    const types_cardboard = ref([]);
    const authors = ref([]);
    const error = ref(false);
    const error_msg = ref("");
    const employees_e = ref([]);
    const employees_dc = ref([]);
    const employees_di = ref([]);
    const employees_ep = ref([]);
    const places = ref([]);
    const p = ref([]);
    const authors_filtered = ref([]);
    const loading = ref(false);
    const ilustraciones = ref([]);
    const loading_btn_submit = ref(false);
    const obras = ref([]);
    const formatos = ref([]);
    const new_expedient = ref(false);
    const all_authors = ref([]);

    watch(type_, () => {
      let types = [];
      if (type_.value === "f") {
        types_work_list.value.data = formatos.value;
        types_work_list.value.data.forEach((element) => {
          if (
            element.nombre !== "APK" &&
            element.nombre !== "Audiolibro" &&
            element.nombre !== "EPUB" &&
            element.nombre !== "PDF"
          ) {
            types.push(element);
          }
        });
        types_work_list.value.data = types;
      } else if (type_.value === "e") {
        types_work_list.value.data = formatos.value;
        types_work_list.value.data.forEach((element) => {
          if (element.nombre === "EPUB" || element.nombre === "PDF") {
            types.push(element);
          }
        });
        types_work_list.value.data = types;
      } else if (type_.value === "a") {
        types_work_list.value.data = formatos.value;
        literary_work.value.tipo_trabajo = formatos.value.filter(
          (type_work) => {
            return type_work.nombre === "Audiolibro";
          }
        );
        literary_work.value.tipo_trabajo =
          literary_work.value.tipo_trabajo.length > 0
            ? literary_work.value.tipo_trabajo[0]
            : "";
        types.push(literary_work.value.tipo_trabajo);
        types_work_list.value.data = types;
      } else if (type_.value === "apk") {
        types_work_list.value.data = formatos.value;
        literary_work.value.tipo_trabajo = formatos.value.filter(
          (type_work) => {
            return type_work.nombre === "APK";
          }
        );
        literary_work.value.tipo_trabajo =
          literary_work.value.tipo_trabajo.length > 0
            ? literary_work.value.tipo_trabajo[0]
            : "";
        types.push(literary_work.value.tipo_trabajo);
        types_work_list.value.data = types;
      }
    });

    onBeforeMount(async () => {
      show.value = toRef(props, "show_dialog");
      const json = {
        limit: null,
        page: 1,
        order: "ASC",
        filter: "",
      };
      try {
        types_work_list.value = await api.post("/tiposTrabajo", json);
        types_work.value = types_work_list.value.data;
        formatos.value = types_work_list.value.data;
      } catch (error) {
        console.log(error);
      }

      try {
        const response = await api.post("/obras", json);
        obras.value = response.data;
      } catch (error) {
      } finally {
      }
      try {
        const response = await api.post("/autores", json);
        all_authors.value = response.data;
      } catch (error) {
      } finally {
      }
      try {
        all_expedients.value = await api.post("/expedientes", json);
        expedients.value = all_expedients.value.data;
      } catch (error) {
      } finally {
      }
      try {
        const response = await api.post("/users", json);
        employees_e.value = JSON.parse(JSON.stringify(response.data));
        employees_dc.value = JSON.parse(JSON.stringify(response.data));
        employees_di.value = JSON.parse(JSON.stringify(response.data));
        employees_ep.value = JSON.parse(JSON.stringify(response.data));
        employees_edition.value = JSON.parse(JSON.stringify(response.data));
        employees_design_cub.value = JSON.parse(JSON.stringify(response.data));
        employees_design_int.value = JSON.parse(JSON.stringify(response.data));
        employees_emplane.value = JSON.parse(JSON.stringify(response.data));
      } catch (error) {
        console.log(error);
      }
      try {
        tematics_list.value = await api.post("/tematicas", json);
        tematics.value = tematics_list.value.data;
      } catch (error) {
        console.log(error);
      }
      try {
        usuarios_obra_list.value = await api.post("/usuariosObra", json);
        usuarios_obra.value = usuarios_obra_list.value.data;
      } catch (error) {
        console.log(error);
      }
      try {
        publicos_audiolibro_list.value = await api.post(
          "/publicosAudiolibro",
          json
        );
        publicos_audiolibro.value = publicos_audiolibro_list.value.data;
      } catch (error) {
        console.log(error);
      }
      try {
        publicos_ebook_list.value = await api.post("/publicosEbook", json);
        publicos_ebook.value = publicos_ebook_list.value.data;
      } catch (error) {
        console.log(error);
      }
      try {
        const response = await api.post("/ventas", json);
        places.value = JSON.parse(JSON.stringify(response.data));
        p.value = JSON.parse(JSON.stringify(response.data));
      } catch (error) {
        console.log(error);
      }
      try {
        groups_list.value = await api.post("/grupos", json);
        groups.value = groups_list.value.data;
      } catch (error) {
        console.log(error);
      }

      try {
        types_book_list.value = await api.post("/tiposLibro", json);
        types_book.value = types_book_list.value.data;
      } catch (error) {
        console.log(error);
      }
      try {
        types_cardboard_list.value = await api.post("/cartulinas", json);
        types_cardboard.value = types_cardboard_list.value.data;
      } catch (error) {
        console.log(error);
      }
      try {
        types_paper_list.value = await api.post("/papeles", json);
        types_paper.value = types_paper_list.value.data;
      } catch (error) {
        console.log(error);
      }
      try {
        genders_list.value = await api.post("/generos", json);
        genders.value = genders_list.value.data;
      } catch (error) {
        console.log(error);
      }
      try {
        languages_list.value = await api.post("/idiomas", json);
        languages.value = languages_list.value.data;
      } catch (error) {
        console.log(error);
      }
      try {
        clasificators_list.value = await api.post("/clasificadores", json);
        clasificators.value = clasificators_list.value.data;
      } catch (error) {
        console.log(error);
      }
      try {
        clasifications_list.value = await api.post("/clasificaciones", json);
        clasifications.value = clasifications_list.value.data;
      } catch (error) {
        console.log(error);
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
        const response = await api.post(`/obras`, json);
        obras.value = response.data;
      } catch (error) {
        console.log(error);
      } finally {
      }
      try {
        all_expedients.value = await api.post("/expedientes", json);
        expedients.value = all_expedients.value.data;
      } catch (error) {
      } finally {
      }
    });
    async function action(act) {
      const success = await adicionalForm.value.validate();
      if (success) {
        const auth = [];
        const paper = [];
        const cardboard = [];
        const language = [];
        const clasificator = [];
        const gender = [];
        const group = [];
        const type_book = [];
        const tematic = [];
        const publ_audiolibro = [];
        const publ_ebook = [];
        const usuarios_edit = [];
        const edicion_list = [];
        const p_list = [];
        const designcub_list = [];
        const designint_list = [];
        const empla_list = [];
        edit_list_worker.value.forEach((el) => {
          if (el.id) {
            edicion_list.push(el.id);
          } else if (el !== "") edicion_list.push(el);
        });
        literary_work.value.edit_list_worker = edicion_list;
        places_list.value.forEach((el) => {
          if (el.id) {
            p_list.push(el.id);
          } else if (el !== "") p_list.push(el);
        });
        literary_work.value.places_list = p_list;
        design_cub_list.value.forEach((el) => {
          if (el.id) {
            designcub_list.push(el.id);
          } else if (el !== "") designcub_list.push(el);
        });
        literary_work.value.design_cub_list = designcub_list;
        design_int_list.value.forEach((el) => {
          if (el.id) {
            designint_list.push(el.id);
          } else if (el !== "") designint_list.push(el);
        });
        literary_work.value.design_int_list = designint_list;
        emplane_list.value.forEach((el) => {
          if (el.id) {
            empla_list.push(el.id);
          } else if (el !== "") empla_list.push(el);
        });
        literary_work.value.emplane_list = empla_list;
        literary_work.value.authors_id.forEach((el) => {
          if (typeof el !== "string") {
            if (el.id) {
              auth.push(el.id);
            } else auth.push(el);
          } else {
            auth.push(el);
          }
        });
        literary_work.value.authors_id = auth;
        literary_work.value.papers_id.forEach((el) => {
          if (el.id) {
            paper.push(el.id);
          } else paper.push(el);
        });
        literary_work.value.papers_id = paper;
        literary_work.value.cardboards_id.forEach((el) => {
          if (el.id) {
            cardboard.push(el.id);
          } else cardboard.push(el);
        });
        literary_work.value.cardboards_id = cardboard;
        literary_work.value.languages_id.forEach((el) => {
          if (el.id) {
            language.push(el.id);
          } else language.push(el);
        });
        literary_work.value.languages_id = language;
        literary_work.value.clasificators_id.forEach((el) => {
          if (el.id) {
            clasificator.push(el.id);
          } else clasificator.push(el);
        });
        literary_work.value.clasificators_id = clasificator;
        literary_work.value.genders_id.forEach((el) => {
          if (el.id) {
            gender.push(el.id);
          } else gender.push(el);
        });
        literary_work.value.genders_id = gender;
        literary_work.value.tematics_id.forEach((el) => {
          if (el.id) {
            tematic.push(el.id);
          } else tematic.push(el);
        });
        literary_work.value.tematics_id = tematic;
        literary_work.value.groups_id.forEach((el) => {
          if (el.id) {
            group.push(el.id);
          } else group.push(el);
        });
        literary_work.value.groups_id = group;
        literary_work.value.types_book_id.forEach((el) => {
          if (el.id) {
            type_book.push(el.id);
          } else type_book.push(el);
        });
        literary_work.value.types_book_id = type_book;

        literary_work.value.publicos_audiolibro_id.forEach((el) => {
          if (el.id) {
            publ_audiolibro.push(el.id);
          } else publ_audiolibro.push(el);
        });
        literary_work.value.publicos_audiolibro_id = publ_audiolibro;

        literary_work.value.publicos_ebook_id.forEach((el) => {
          if (el.id) {
            publ_ebook.push(el.id);
          } else publ_ebook.push(el);
        });
        literary_work.value.publicos_ebook_id = publ_ebook;

        literary_work.value.usuarios_obra_id.forEach((el) => {
          if (el.id) {
            usuarios_edit.push(el.id);
          } else usuarios_edit.push(el);
        });
        literary_work.value.usuarios_obra_id = usuarios_edit;

        loading_btn_submit.value = true;
        new_authors.value.names.forEach((el) => {
          let i = 0;
          let found = false;
          while (!found && i < literary_work.value.authors_id.length) {
            if (typeof literary_work.value.authors_id[i] === "string") {
              if (
                literary_work.value.authors_id[i].toLowerCase() ===
                el.toLowerCase()
              ) {
                new_authors_to_add.value.names.push(el);
                found = true;
              }
            }
            i++;
          }
        });
        try {
          const response = await api.post(
            "/obras/crearAutores",
            new_authors_to_add.value
          );
          response.data.forEach((element) => {
            literary_work.value.authors_id.push(element.id);
          });
          if (typeof literary_work.value.expediente_id === "string") {
            const param = { nombre: literary_work.value.expediente_id };
            try {
              const response = await api.post(`/expedientes/crear`, param);
              literary_work.value.expediente_id = response.data.id;
              if (act === "editar") {
                const data = new FormData();
                data.append("portada", literary_work.value.portada);
                data.append("ilustracion1", literary_work.value.ilustracion1);
                data.append("ilustracion2", literary_work.value.ilustracion2);
                data.append("ilustracion3", literary_work.value.ilustracion3);
                data.append("ilustracion4", literary_work.value.ilustracion4);
                data.append("ilustracion5", literary_work.value.ilustracion5);
                data.append("id", literary_work.value.id);
                try {
                  const response = await api.post(
                    `/obras/${act}`,
                    literary_work.value
                  );
                  await api.post(`/obras/editarPortada`, data);
                  if (typeof response.data === "string") {
                    emit("action", "editar", "error");
                  } else {
                    emit("action", "editar", "success");
                  }
                } catch (error) {
                  console.log(error);
                }
              } else {
                try {
                  const response = await api.post(
                    `/obras/${act}`,
                    literary_work.value
                  );
                  const data = new FormData();
                  data.append("portada", literary_work.value.portada);
                  data.append("ilustracion1", literary_work.value.ilustracion1);
                  data.append("ilustracion2", literary_work.value.ilustracion2);
                  data.append("ilustracion3", literary_work.value.ilustracion3);
                  data.append("ilustracion4", literary_work.value.ilustracion4);
                  data.append("ilustracion5", literary_work.value.ilustracion5);
                  data.append("id", response.data.id);
                  await api.post(`/obras/editarPortada`, data);
                  if (typeof response.data === "string") {
                    emit("action", "crear", "error");
                  } else {
                    emit("action", "crear", "success");
                  }
                } catch (error) {
                  emit("action", "crear", "error");
                }
              }
            } catch (error) {}
          } else {
            literary_work.value.expediente_id =
              literary_work.value.expediente_id.id;
            if (act === "editar") {
              const data = new FormData();
              data.append("portada", literary_work.value.portada);
              data.append("ilustracion1", literary_work.value.ilustracion1);
              data.append("ilustracion2", literary_work.value.ilustracion2);
              data.append("ilustracion3", literary_work.value.ilustracion3);
              data.append("ilustracion4", literary_work.value.ilustracion4);
              data.append("ilustracion5", literary_work.value.ilustracion5);
              data.append("id", literary_work.value.id);
              try {
                const response = await api.post(
                  `/obras/${act}`,
                  literary_work.value
                );
                await api.post(`/obras/editarPortada`, data);
                if (typeof response.data === "string") {
                  emit("action", "editar", "error");
                } else {
                  emit("action", "editar", "success");
                }
              } catch (error) {
                emit("action", "editar", "error");
              }
            } else {
              try {
                const response = await api.post(
                  `/obras/${act}`,
                  literary_work.value
                );
                const data = new FormData();
                data.append("portada", literary_work.value.portada);
                data.append("ilustracion1", literary_work.value.ilustracion1);
                data.append("ilustracion2", literary_work.value.ilustracion2);
                data.append("ilustracion3", literary_work.value.ilustracion3);
                data.append("ilustracion4", literary_work.value.ilustracion4);
                data.append("ilustracion5", literary_work.value.ilustracion5);
                data.append("id", response.data.id);
                await api.post(`/obras/editarPortada`, data);
                if (typeof response.data === "string") {
                  emit("action", "crear", "error");
                } else {
                  emit("action", "crear", "success");
                }
              } catch (error) {
                emit("action", "crear", "error");
              }
            }
          }
        } catch (error) {
          console.log(error);
        } finally {
          clearForm("");
          loading_btn_submit.value = false;
        }
      } else {
        Notify.create({
          color: "negative",
          position: "bottom",
          iconColor: "negative",
          icon: "feedback",
          message: `Mensaje de Alerta`,
          caption: `Hay errores en el formulario, por favor revise`,
          timeout: 2000,
        });
      }
    }
    function clearForm(mode) {
      show_confirm.value = false;
      new_expedient.value = false;
      literary_work.value.ilustracion1 = null;
      literary_work.value.ilustracion2 = null;
      literary_work.value.ilustracion3 = null;
      literary_work.value.ilustracion4 = null;
      literary_work.value.ilustracion5 = null;
      url_portada.value = null;
      url_ilust1.value = null;
      url_ilust2.value = null;
      url_ilust3.value = null;
      url_ilust4.value = null;
      url_ilust5.value = null;
      literary_work.value.expediente_id = null;
      literary_work.value.titulo = null;
      literary_work.value.tipo_trabajo_id = null;
      literary_work.value.tipo_trabajo = "";
      literary_work.value.codigo = null;
      literary_work.value.isbn = null;
      literary_work.value.derechos_autor_talento_artistico = null;
      literary_work.value.isbn_obra = null;
      literary_work.value.servicios_cuc = null;
      literary_work.value.servicios_mn = null;
      literary_work.value.cpcu = null;
      literary_work.value.usuario = null;
      literary_work.value.acetato = null;
      literary_work.value.pelicula_positiva = null;
      literary_work.value.original_impreso = null;
      literary_work.value.cdrom = null;
      literary_work.value.tripa = null;
      literary_work.value.cubierta = null;
      literary_work.value.cubierta_retiro = null;
      literary_work.value.flexiback = false;
      literary_work.value.hilo = false;
      literary_work.value.rustica = false;
      literary_work.value.caballete = false;
      literary_work.value.poligrafico = null;
      literary_work.value.entrega_ueb_editorial = null;
      literary_work.value.plan_terminado_ueb_editorial = null;
      literary_work.value.ancho = null;
      literary_work.value.alto = null;
      literary_work.value.sello = false;
      literary_work.value.riso = false;
      literary_work.value.edicion_editorial = null;
      literary_work.value.compl_general = null;
      literary_work.value.compl_general_valor = null;
      literary_work.value.compl_redaccion = null;
      literary_work.value.compl_mecanografia = null;
      literary_work.value.compl_correccion = null;
      literary_work.value.compl_ilustracion = null;
      literary_work.value.compl_prensa = null;
      literary_work.value.compl_prensa_valor = null;
      literary_work.value.ilust_cant = null;
      literary_work.value.ilust_linea = null;
      literary_work.value.ilust_color = null;
      literary_work.value.ilust_fotos = null;
      literary_work.value.peliculas_recibidas = null;
      literary_work.value.no_suplemento = null;
      literary_work.value.etapa = null;
      literary_work.value.plan = null;
      literary_work.value.comentarios = null;
      literary_work.value.obsv_pasaporte = null;
      literary_work.value.coeficiente = null;
      literary_work.value.paginas = null;
      literary_work.value.antecedentes = null;
      literary_work.value.tirada_plan = null;
      literary_work.value.cant_ename = null;
      literary_work.value.cant_ueb_ventas = null;
      literary_work.value.cant_otros = null;
      literary_work.value.cant_muestras = null;
      literary_work.value.precio_obra = null;
      literary_work.value.precio_costo = null;
      literary_work.value.entrada = null;
      literary_work.value.a_edicion = null;
      literary_work.value.devuelto = null;
      literary_work.value.cancelado = null;
      literary_work.value.registro = null;
      literary_work.value.term_editorial = null;
      literary_work.value.entr_sev_poligrafico = null;
      literary_work.value.entr_industria = null;
      literary_work.value.terminado = null;
      literary_work.value.pr = null;
      literary_work.value.art = null;
      literary_work.value.lh = null;
      literary_work.value.may = null;
      literary_work.value.m = null;
      literary_work.value.vc = null;
      literary_work.value.cf = null;
      literary_work.value.ss = null;
      literary_work.value.ca = null;
      literary_work.value.c = null;
      literary_work.value.lt = null;
      literary_work.value.h = null;
      literary_work.value.g = null;
      literary_work.value.sc = null;
      literary_work.value.gmo = null;
      literary_work.value.ename = null;
      literary_work.value.mined = null;
      literary_work.value.muestra = null;
      literary_work.value.otros = null;
      literary_work.value.total = null;
      literary_work.value.suma = null;
      literary_work.value.subtitulo = null;
      literary_work.value.peso = null;
      literary_work.value.precio_cup = null;
      literary_work.value.precio_usd = null;
      literary_work.value.no_doc_aprobacion = null;
      literary_work.value.clav_meta = null;
      literary_work.value.narradores = null;
      literary_work.value.num_pistas = null;
      literary_work.value.derechos_autor = null;
      literary_work.value.desc_comercial = null;
      literary_work.value.version = null;
      literary_work.value.portada = null;
      literary_work.value.ilustracion1 = null;
      literary_work.value.ilustracion2 = null;
      literary_work.value.ilustracion3 = null;
      literary_work.value.ilustracion4 = null;
      literary_work.value.ilustracion5 = null;
      literary_work.value.cont_muestra = false;
      literary_work.value.muestra = null;
      literary_work.value.version_epub = null;
      literary_work.value.sobre_derec_autor = null;
      literary_work.value.colaboradores = null;
      literary_work.value.nombre_coleccion = null;
      literary_work.value.numero_coleccion = null;
      literary_work.value.nove_version = null;
      literary_work.value.rese_editoriales = null;
      literary_work.value.nombre_apellidos = null;
      literary_work.value.fuente_resenha = null;
      literary_work.value.descripcion_resenha = null;
      literary_work.value.material_expl = null;
      literary_work.value.edicion = null;
      literary_work.value.imag_interiores = null;
      literary_work.value.detalles_obra = null;
      literary_work.value.personal_edicion = null;
      literary_work.value.personal_disenho_cub = null;
      literary_work.value.personal_disenho_int = null;
      literary_work.value.personal_emplane = null;
      literary_work.value.peq_resenha_obra = null;
      literary_work.value.authors_id = [];
      literary_work.value.groups_id = [];
      literary_work.value;
      literary_work.value.papers_id = [];
      literary_work.value.types_book_id = [];
      literary_work.value.publicos_audiolibro_id = [];
      literary_work.value.publicos_ebook_id = [];
      literary_work.value.usuarios_obra_id = [];
      literary_work.value.cardboards_id = [];
      literary_work.value.genders_id = [];
      literary_work.value.clasificators_id = [];
      literary_work.value.clasificacion_id = null;
      literary_work.value.languages_id = [];
      edit_list_worker.value = [];
      design_cub_list.value = [];
      design_int_list.value = [];
      emplane_list.value = [];
      places_list.value = [];
      places.value.forEach((element) => {
        element.disable = false;
      });
      employees_edition.value.forEach((element) => {
        element.disable = false;
      });
      employees_design_cub.value.forEach((element) => {
        element.disable = false;
      });
      employees_design_int.value.forEach((element) => {
        element.disable = false;
      });
      employees_emplane.value.forEach((element) => {
        element.disable = false;
      });
      literary_work.value.tematics_id = [];
      new_authors.value = { names: [] };
      new_authors_to_add.value = { names: [] };
      tab.value = "passport_fis";
      type_.value = "";
      emit("closeForm", mode);
    }
    function filterNewAuthor() {
      let found = false;
      let err = "";
      error.value = false;
      error_msg.value = "";
      let second_validation = true;
      exist_author.value = false;
      let i = 0;
      while (!found && i < all_authors.value.length) {
        if (
          all_authors.value[i].nombre.toLowerCase() ==
          model_author.value.toLowerCase()
        ) {
          found = true;
          exist_author.value = true;
          err = "Ya existe este autor";
          second_validation = false;
        }
        i++;
      }
      if (second_validation) {
        i = 0;
        while (!found && i < literary_work.value.authors_id.length) {
          if (typeof literary_work.value.authors_id[i] === "string") {
            if (
              literary_work.value.authors_id[i].toLowerCase() ==
              model_author.value.toLowerCase()
            ) {
              found = true;
              exist_author.value = true;
              error.value = true;
              error_msg.value = "Este autor ya fue agregado";
              err = "Este autor ya fue agregado";
            }
          }
          i++;
        }
      }

      return !found || err;
    }
    watch(loading, () => {
      filterNewAuthor();
    });
    function filterAuthor(val, update) {
      loading.value = true;
      let found = false;
      exist_author.value = false;
      authors_filtered.value = [];
      authors.value = [];
      const json = {
        limit: null,
        page: 1,
        order: "ASC",
        filter: "",
      };
      update(async () => {
        try {
          const response = await api.post("/autores", json);
          authors.value = response.data;
          authors_filtered.value = authors.value;
          const needle = val.toLowerCase();
          authors_filtered.value = authors.value.filter(
            (v) => v.nombre.toLowerCase().indexOf(needle) > -1
          );
        } catch (error) {
          console.log(error);
        } finally {
          if (authors_filtered.value.length === 0) {
            model_author.value = val;
          }
          loading.value = false;
        }
      });
    }
    function addAuthor() {
      let au = [];
      new_authors.value.names.push(model_author.value);
      au = literary_work.value.authors_id;
      model_author.value = "";
      au.push(new_authors.value.names[new_authors.value.names.length - 1]);
      literary_work.value.authors_id = au;
      console.log(literary_work.value.authors_id);
    }
    function fitlerGroups(val, update) {
      if (val === "") {
        update(() => {
          groups.value = groups_list.value.data;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        groups.value = groups_list.value.data.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        );
      });
    }

    function fitlerPublicosAudiolibro(val, update) {
      if (val === "") {
        update(() => {
          publicos_audiolibro.value = publicos_audiolibro_list.value.data;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        publicos_audiolibro.value = publicos_audiolibro_list.value.data.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        );
      });
    }
    //filtrar
    function fitlerPublicosEbook(val, update) {
      if (val === "") {
        update(() => {
          publicos_ebook.value = publicos_ebook_list.value.data;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        publicos_ebook.value = publicos_ebook_list.value.data.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        );
      });
    }
    function fitlerUsuariosObra(val, update) {
      if (val === "") {
        update(() => {
          usuarios_obra.value = usuarios_obra_list.value.data;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        usuarios_obra.value = usuarios_obra_list.value.data.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        );
      });
    }
    function fitlerGenders(val, update) {
      if (val === "") {
        update(() => {
          genders.value = genders_list.value.data;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        genders.value = genders_list.value.data.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        );
      });
    }
    function fitlerLanguages(val, update) {
      if (val === "") {
        update(() => {
          languages.value = languages_list.value.data;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        languages.value = languages_list.value.data.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        );
      });
    }
    function fitlerTematics(val, update) {
      if (val === "") {
        update(() => {
          tematics.value = tematics_list.value.data;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        tematics.value = tematics_list.value.data.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        );
      });
    }
    function filterPaper(val, update) {
      if (val === "") {
        update(() => {
          types_paper.value = types_paper_list.value.data;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        types_paper.value = types_paper_list.value.data.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        );
      });
    }
    function fitlerTypesWork(val, update) {
      if (val === "") {
        update(() => {
          types_work.value = types_work_list.value.data;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        types_work.value = types_work_list.value.data.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        );
      });
    }
    function fitlerTypesBook(val, update) {
      if (val === "") {
        update(() => {
          types_book.value = types_book_list.value.data;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        types_book.value = types_book_list.value.data.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        );
      });
    }
    function filterClasificators(val, update) {
      if (val === "") {
        update(() => {
          clasificators.value = clasificators_list.value.data;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        clasificators.value = clasificators_list.value.data.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        );
      });
    }
    function filterClasifications(val, update) {
      if (val === "") {
        update(() => {
          clasifications.value = clasifications_list.value.data;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        clasifications.value = clasifications_list.value.data.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        );
      });
    }
    function filterCardBoard(val, update) {
      if (val === "") {
        update(() => {
          types_cardboard.value = types_cardboard_list.value.data;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        types_cardboard.value = types_cardboard_list.value.data.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        );
      });
    }
    function setComplexity(complexity, type) {
      if (type === "general") {
        switch (complexity) {
          case "simple":
            literary_work.value.compl_general_semi_complejo = 0;
            literary_work.value.compl_general_complejo = 0;
            literary_work.value.compl_general_muy_complejo = 0;
            break;
          case "semi_complejo":
            literary_work.value.compl_general_simple = 0;
            literary_work.value.compl_general_complejo = 0;
            literary_work.value.compl_general_muy_complejo = 0;
            break;
          case "complejo":
            literary_work.value.compl_general_semi_complejo = 0;
            literary_work.value.compl_general_simple = 0;
            literary_work.value.compl_general_muy_complejo = 0;
            break;
          case "muy_complejo":
            literary_work.value.compl_general_semi_complejo = 0;
            literary_work.value.compl_general_complejo = 0;
            literary_work.value.compl_general_simple = 0;
            break;

          default:
            break;
        }
      } else if (type === "pre_prensa") {
        switch (complexity) {
          case "simple":
            literary_work.value.compl_prensa_semi_complejo = 0;
            literary_work.value.compl_prensa_complejo = 0;
            literary_work.value.compl_prensa_muy_complejo = 0;
            break;
          case "semi_complejo":
            literary_work.value.compl_prensa_simple = 0;
            literary_work.value.compl_prensa_complejo = 0;
            literary_work.value.compl_prensa_muy_complejo = 0;
            break;
          case "complejo":
            literary_work.value.compl_prensa_semi_complejo = 0;
            literary_work.value.compl_prensa_simple = 0;
            literary_work.value.compl_prensa_muy_complejo = 0;
            break;
          case "muy_complejo":
            literary_work.value.compl_prensa_semi_complejo = 0;
            literary_work.value.compl_prensa_complejo = 0;
            literary_work.value.compl_prensa_simple = 0;
            break;

          default:
            break;
        }
      }
    }
    async function nextTab(type_btn, to) {
      let success = false;
      if (to === "passport_ebook") {
        if (type_btn === "atras") {
          tab.value = type_.value === "f" ? "passport_fis" : "passport_ebook";
        } else {
          success = await physicalForm.value.validate();
          if (success) {
            tab.value =
              type_.value === "f" ? "adicional_info" : "passport_ebook";
          } else {
            Notify.create({
              color: "negative",
              position: "bottom",
              iconColor: "negative",
              icon: "feedback",
              message: `Mensaje de Alerta`,
              caption: `Hay errores en el formulario, por favor revise`,
              timeout: 2000,
            });
          }
        }
      } else if (to === "adicional_info") {
        if (
          type_.value === "e" ||
          type_.value === "a" ||
          type_.value === "apk" ||
          digitalFormat()
        ) {
          success = await digitalForm.value.validate();
        } else {
          success = await physicalForm.value.validate();
        }
        if (success) {
          tab.value = "adicional_info";
        } else {
          Notify.create({
            color: "negative",
            position: "bottom",
            iconColor: "negative",
            icon: "feedback",
            message: `Mensaje de Alerta`,
            caption: `Hay errores en el formulario, por favor revise`,
            timeout: 2000,
          });
        }
      } else if (to === "passport_fis") {
        tab.value = "passport_fis";
      }
    }

    function filterEmployeeEdition(val, update) {
      if (val === "") {
        update(() => {
          employees_edition.value = employees_e.value;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        employees_edition.value = employees_e.value.filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1
        );
      });
    }
    function filterEmployeeDesignCub(val, update) {
      if (val === "") {
        update(() => {
          employees_design_cub.value = employees_dc.value;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        employees_design_cub.value = employees_dc.value.filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1
        );
      });
    }
    function filterEmployeeDesignInt(val, update) {
      if (val === "") {
        update(() => {
          employees_design_int.value = employees_di.value;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        employees_design_int.value = employees_di.value.filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1
        );
      });
    }
    function filterEmployeeEmplane(val, update) {
      if (val === "") {
        update(() => {
          employees_emplane.value = employees_ep.value;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        employees_emplane.value = employees_ep.value.filter(
          (v) => v.name.toLowerCase().indexOf(needle) > -1
        );
      });
    }
    function filterPlaces(val, update) {
      if (val === "") {
        update(() => {
          places.value = p.value;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        places.value = p.value.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        );
      });
    }
    function existExpedient() {
      if (literary_work.value.titulo !== "") {
        let i = 0;
        let found = false;
        while (!found && i < all_expedients.value.data.length) {
          if (
            all_expedients.value.data[i].nombre.toLowerCase() ===
            literary_work.value.titulo.toLowerCase()
          ) {
            found = true;
            literary_work.value.expediente_id = all_expedients.value.data[i];
            if (all_expedients.value.data[i].obras.length !== 0) {
              literary_work.value.titulo =
                all_expedients.value.data[i].obras[0].titulo;
              literary_work.value.clasificacion_id =
                all_expedients.value.data[i].obras[0].clasificacion_id;
              //falta el formato
              literary_work.value.tipo_trabajo =
                all_expedients.value.data[i].obras[0].tipo_trabajo;
              literary_work.value.codigo =
                all_expedients.value.data[i].obras[0].codigo;
              literary_work.value.derechos_autor_talento_artistico =
                all_expedients.value.data[
                  i
                ].obras[0].derechos_autor_talento_artistico;
              literary_work.value.servicios_cuc =
                all_expedients.value.data[i].obras[0].servicios_cuc;
              literary_work.value.servicios_mn =
                all_expedients.value.data[i].obras[0].servicios_mn;
              literary_work.value.usuario =
                all_expedients.value.data[i].obras[0].usuario;
              literary_work.value.acetato =
                all_expedients.value.data[i].obras[0].acetato;
              literary_work.value.pelicula_positiva =
                all_expedients.value.data[i].obras[0].pelicula_positiva;
              literary_work.value.original_impreso =
                all_expedients.value.data[i].obras[0].original_impreso;
              literary_work.value.cdrom =
                all_expedients.value.data[i].obras[0].cdrom;
              literary_work.value.tripa =
                all_expedients.value.data[i].obras[0].tripa;
              literary_work.value.cubierta =
                all_expedients.value.data[i].obras[0].cubierta;
              literary_work.value.cubierta_retiro =
                all_expedients.value.data[i].obras[0].cubierta_retiro;
              literary_work.value.flexiback =
                all_expedients.value.data[i].obras[0].flexiback === 0
                  ? false
                  : true;
              literary_work.value.hilo =
                all_expedients.value.data[i].obras[0].hilo === 0 ? false : true;
              literary_work.value.rustica =
                all_expedients.value.data[i].obras[0].rustica === 0
                  ? false
                  : true;
              literary_work.value.caballete =
                all_expedients.value.data[i].obras[0].caballete === 0
                  ? false
                  : true;
              literary_work.value.poligrafico =
                all_expedients.value.data[i].obras[0].poligrafico;
              literary_work.value.entrega_ueb_editorial =
                all_expedients.value.data[i].obras[0].entrega_ueb_editorial;
              literary_work.value.plan_terminado_ueb_editorial =
                all_expedients.value.data[
                  i
                ].obras[0].plan_terminado_ueb_editorial;
              literary_work.value.ancho =
                all_expedients.value.data[i].obras[0].ancho;
              literary_work.value.alto =
                all_expedients.value.data[i].obras[0].alto;
              literary_work.value.sello =
                all_expedients.value.data[i].obras[0].sello === 0
                  ? false
                  : true;
              literary_work.value.riso =
                all_expedients.value.data[i].obras[0].riso === 0 ? false : true;
              literary_work.value.edicion_editorial =
                all_expedients.value.data[i].obras[0].edicion_editorial;
              literary_work.value.compl_general =
                all_expedients.value.data[i].obras[0].compl_general;
              literary_work.value.compl_general_valor =
                all_expedients.value.data[i].obras[0].compl_general_valor;
              literary_work.value.compl_redaccion =
                all_expedients.value.data[i].obras[0].compl_redaccion;
              literary_work.value.compl_mecanografia =
                all_expedients.value.data[i].obras[0].compl_mecanografia;
              literary_work.value.compl_correccion =
                all_expedients.value.data[i].obras[0].compl_correccion;
              literary_work.value.compl_ilustracion =
                all_expedients.value.data[i].obras[0].compl_ilustracion;
              literary_work.value.compl_prensa =
                all_expedients.value.data[i].obras[0].compl_prensa;
              literary_work.value.compl_prensa_valor =
                all_expedients.value.data[i].obras[0].compl_prensa_valor;
              literary_work.value.ilust_cant =
                all_expedients.value.data[i].obras[0].ilust_cant;
              literary_work.value.ilust_linea =
                all_expedients.value.data[i].obras[0].ilust_linea;
              literary_work.value.ilust_color =
                all_expedients.value.data[i].obras[0].ilust_color;
              literary_work.value.ilust_fotos =
                all_expedients.value.data[i].obras[0].ilust_fotos;
              literary_work.value.peliculas_recibidas =
                all_expedients.value.data[i].obras[0].peliculas_recibidas;
              literary_work.value.no_suplemento =
                all_expedients.value.data[i].obras[0].no_suplemento;
              literary_work.value.etapa =
                all_expedients.value.data[i].obras[0].etapa;
              literary_work.value.plan =
                all_expedients.value.data[i].obras[0].plan;
              literary_work.value.comentarios =
                all_expedients.value.data[i].obras[0].comentarios;
              literary_work.value.obsv_pasaporte =
                all_expedients.value.data[i].obras[0].obsv_pasaporte;
              literary_work.value.coeficiente =
                all_expedients.value.data[i].obras[0].coeficiente;
              literary_work.value.paginas =
                all_expedients.value.data[i].obras[0].paginas;
              literary_work.value.antecedentes =
                all_expedients.value.data[i].obras[0].antecedentes;
              literary_work.value.tirada_plan =
                all_expedients.value.data[i].obras[0].tirada_plan;
              literary_work.value.cant_ename =
                all_expedients.value.data[i].obras[0].cant_ename;
              literary_work.value.cant_ueb_ventas =
                all_expedients.value.data[i].obras[0].cant_ueb_ventas;
              literary_work.value.cant_otros =
                all_expedients.value.data[i].obras[0].cant_otros;
              literary_work.value.cant_muestras =
                all_expedients.value.data[i].obras[0].cant_muestras;
              literary_work.value.precio_obra =
                all_expedients.value.data[i].obras[0].precio_obra;
              literary_work.value.precio_costo =
                all_expedients.value.data[i].obras[0].precio_costo;
              literary_work.value.entrada =
                all_expedients.value.data[i].obras[0].entrada;
              literary_work.value.a_edicion =
                all_expedients.value.data[i].obras[0].a_edicion;
              literary_work.value.devuelto =
                all_expedients.value.data[i].obras[0].devuelto;
              literary_work.value.cancelado =
                all_expedients.value.data[i].obras[0].cancelado;
              literary_work.value.registro =
                all_expedients.value.data[i].obras[0].registro;
              literary_work.value.term_editorial =
                all_expedients.value.data[i].obras[0].term_editorial;
              literary_work.value.entr_sev_poligrafico =
                all_expedients.value.data[i].obras[0].entr_sev_poligrafico;
              literary_work.value.entr_industria =
                all_expedients.value.data[i].obras[0].entr_industria;
              literary_work.value.terminado =
                all_expedients.value.data[i].obras[0].terminado;
              literary_work.value.pr = all_expedients.value.data[i].obras[0].pr;
              literary_work.value.art =
                all_expedients.value.data[i].obras[0].art;
              literary_work.value.lh = all_expedients.value.data[i].obras[0].lh;
              literary_work.value.may =
                all_expedients.value.data[i].obras[0].may;
              literary_work.value.m = all_expedients.value.data[i].obras[0].m;
              literary_work.value.vc = all_expedients.value.data[i].obras[0].vc;
              literary_work.value.cf = all_expedients.value.data[i].obras[0].cf;
              literary_work.value.ss = all_expedients.value.data[i].obras[0].ss;
              literary_work.value.ca = all_expedients.value.data[i].obras[0].ca;
              literary_work.value.c = all_expedients.value.data[i].obras[0].c;
              literary_work.value.lt = all_expedients.value.data[i].obras[0].lt;
              literary_work.value.h = all_expedients.value.data[i].obras[0].h;
              literary_work.value.g = all_expedients.value.data[i].obras[0].g;
              literary_work.value.sc = all_expedients.value.data[i].obras[0].sc;
              literary_work.value.gmo =
                all_expedients.value.data[i].obras[0].gmo;
              literary_work.value.ename =
                all_expedients.value.data[i].obras[0].ename;
              literary_work.value.mined =
                all_expedients.value.data[i].obras[0].mined;
              literary_work.value.muestra =
                all_expedients.value.data[i].obras[0].muestra;
              literary_work.value.otros =
                all_expedients.value.data[i].obras[0].otros;
              literary_work.value.total =
                all_expedients.value.data[i].obras[0].total;
              literary_work.value.suma =
                all_expedients.value.data[i].obras[0].suma;
              literary_work.value.subtitulo =
                all_expedients.value.data[i].obras[0].subtitulo;
              literary_work.value.peso =
                all_expedients.value.data[i].obras[0].peso;
              literary_work.value.precio_cup =
                all_expedients.value.data[i].obras[0].precio_cup;
              literary_work.value.precio_usd =
                all_expedients.value.data[i].obras[0].precio_usd;
              literary_work.value.no_doc_aprobacion =
                all_expedients.value.data[i].obras[0].no_doc_aprobacion;
              literary_work.value.clav_meta =
                all_expedients.value.data[i].obras[0].clav_meta;
              literary_work.value.narradores =
                all_expedients.value.data[i].obras[0].narradores;
              literary_work.value.num_pistas =
                all_expedients.value.data[i].obras[0].num_pistas;
              literary_work.value.derechos_autor =
                all_expedients.value.data[i].obras[0].derechos_autor;
              literary_work.value.desc_comercial =
                all_expedients.value.data[i].obras[0].desc_comercial;
              literary_work.value.version =
                all_expedients.value.data[i].obras[0].version;
              literary_work.value.portada =
                all_expedients.value.data[i].obras[0].portada;
              literary_work.value.ilustracion1 =
                all_expedients.value.data[i].obras[0].ilustracion1;
              literary_work.value.ilustracion2 =
                all_expedients.value.data[i].obras[0].ilustracion2;
              literary_work.value.ilustracion3 =
                all_expedients.value.data[i].obras[0].ilustracion3;
              literary_work.value.ilustracion4 =
                all_expedients.value.data[i].obras[0].ilustracion4;
              literary_work.value.ilustracion5 =
                all_expedients.value.data[i].obras[0].ilustracion5;
              literary_work.value.cont_muestra =
                all_expedients.value.data[i].obras[0].cont_muestra === 0
                  ? false
                  : true;
              literary_work.value.muestra =
                all_expedients.value.data[i].obras[0].muestra;
              literary_work.value.version_epub =
                all_expedients.value.data[i].obras[0].version_epub;
              literary_work.value.sobre_derec_autor =
                all_expedients.value.data[i].obras[0].sobre_derec_autor;
              literary_work.value.colaboradores =
                all_expedients.value.data[i].obras[0].colaboradores;
              literary_work.value.nombre_coleccion =
                all_expedients.value.data[i].obras[0].nombre_coleccion;
              literary_work.value.numero_coleccion =
                all_expedients.value.data[i].obras[0].numero_coleccion;
              literary_work.value.nove_version =
                all_expedients.value.data[i].obras[0].nove_version;
              literary_work.value.rese_editoriales =
                all_expedients.value.data[i].obras[0].rese_editoriales;
              literary_work.value.nombre_apellidos =
                all_expedients.value.data[i].obras[0].nombre_apellidos;
              literary_work.value.fuente_resenha =
                all_expedients.value.data[i].obras[0].fuente_resenha;
              literary_work.value.descripcion_resenha =
                all_expedients.value.data[i].obras[0].descripcion_resenha;
              literary_work.value.material_expl =
                all_expedients.value.data[i].obras[0].material_expl;
              literary_work.value.edicion =
                all_expedients.value.data[i].obras[0].edicion;
              literary_work.value.imag_interiores =
                all_expedients.value.data[i].obras[0].imag_interiores;
              literary_work.value.detalles_obra =
                all_expedients.value.data[i].obras[0].detalles_obra;
              literary_work.value.personal_edicion =
                all_expedients.value.data[i].obras[0].personal_edicion;
              literary_work.value.personal_disenho_cub =
                all_expedients.value.data[i].obras[0].personal_disenho_cub;
              literary_work.value.personal_disenho_int =
                all_expedients.value.data[i].obras[0].personal_disenho_int;
              literary_work.value.personal_emplane =
                all_expedients.value.data[i].obras[0].personal_emplane;
              literary_work.value.peq_resenha_obra =
                all_expedients.value.data[i].obras[0].peq_resenha_obra;
              literary_work.value.groups_id =
                all_expedients.value.data[i].obras[0].grupos;
              literary_work.value.papers_id =
                all_expedients.value.data[i].obras[0].papeles;
              literary_work.value.cardboards_id =
                all_expedients.value.data[i].obras[0].cartulinas;
              literary_work.value.clasificators_id =
                all_expedients.value.data[i].obras[0].clasificadores;
              literary_work.value.languages_id =
                all_expedients.value.data[i].obras[0].idiomas;
              literary_work.value.usuarios_obra_id =
                all_expedients.value.data[i].obras[0].usuarios_editorial;
              literary_work.value.publicos_audiolibro_id =
                all_expedients.value.data[i].obras[0].publicos_audiolibro;
              literary_work.value.publicos_ebook_id =
                all_expedients.value.data[i].obras[0].publicos_ebook;
              literary_work.value.genders_id =
                all_expedients.value.data[i].obras[0].generos;
              literary_work.value.types_book_id =
                all_expedients.value.data[i].obras[0].tipos_libro;
              literary_work.value.tematics_id =
                all_expedients.value.data[i].obras[0].tematicas;
              literary_work.value.authors_id =
                all_expedients.value.data[i].obras[0].autores;
              places_list.value =
                all_expedients.value.data[i].obras[0].ventas.length !== 0
                  ? all_expedients.value.data[i].obras[0].ventas
                  : [];
              if (all_expedients.value.data[i].obras[0].users.length === 0) {
                edit_list_worker.value = [];
                design_cub_list.value = [];
                design_int_list.value = [];
                emplane_list.value = [];
              } else {
                let edicion = 0;
                let disenho_cub = 0;
                let disenho_int = 0;
                let emplane = 0;
                all_expedients.value.data[i].obras[0].users.forEach((user) => {
                  if (user.pivot.relacion === "edicion") {
                    edicion++;
                    edit_list_worker.value =
                      edicion === 1 ? [] : edit_list_worker.value;
                    edit_list_worker.value.push(user);
                  } else if (user.pivot.relacion === "disenho_cubierta") {
                    disenho_cub++;
                    design_cub_list.value =
                      disenho_cub === 1 ? [] : design_cub_list.value;
                    design_cub_list.value.push(user);
                  } else if (user.pivot.relacion === "disenho_interior") {
                    disenho_int++;
                    design_int_list.value =
                      disenho_int === 1 ? [] : design_int_list.value;
                    design_int_list.value.push(user);
                  } else if (user.pivot.relacion === "emplane") {
                    emplane++;
                    emplane_list.value =
                      emplane === 1 ? [] : emplane_list.value;
                    emplane_list.value.push(user);
                  }
                });
                edit_list_worker.value =
                  edicion > 0 ? edit_list_worker.value : [];
                design_cub_list.value =
                  disenho_cub > 0 ? design_cub_list.value : [];
                design_int_list.value =
                  disenho_int > 0 ? design_int_list.value : [];
                emplane_list.value = emplane > 0 ? emplane_list.value : [];
              }

              new_authors.value = { names: [] };
              new_authors_to_add.value = { names: [] };
            }
          }
          i++;
        }
        expedient_info.value = !found ? true : false;
      }
    }
    function createExpedient() {
      literary_work.value.expediente_id = literary_work.value.titulo;
      new_expedient.value = true;
    }
    function filterExpedients(val, update) {
      if (val === "") {
        update(() => {
          expedients.value = all_expedients.value.data;
        });
        return;
      }
      update(() => {
        const needle = val.toLowerCase();
        expedients.value = all_expedients.value.data.filter(
          (v) => v.nombre.toLowerCase().indexOf(needle) > -1
        );
      });
    }
    function digitalFormat() {
      if (literary_work.value.tipo_trabajo !== "") {
        return literary_work.value.tipo_trabajo.nombre === "Audiolibro" ||
          literary_work.value.tipo_trabajo.nombre === "EPUB" ||
          literary_work.value.tipo_trabajo.nombre === "PDF" ||
          literary_work.value.tipo_trabajo.nombre === "APK"
          ? true
          : false;
      } else return false;
    }
    function expObra() {
      if (literary_work.value.expediente_id !== null) {
        literary_work.value.titulo = literary_work.value.expediente_id.nombre;
        if (literary_work.value.expediente_id.obras.length !== 0) {
          literary_work.value.clasificacion_id =
            literary_work.value.expediente_id.obras[0].clasificacion_id;
          /* literary_work.value.tipo_trabajo =
            literary_work.value.expediente_id.obras[0].tipo_trabajo; */
          literary_work.value.codigo =
            literary_work.value.expediente_id.obras[0].codigo;
          literary_work.value.derechos_autor_talento_artistico =
            literary_work.value.expediente_id.obras[0].derechos_autor_talento_artistico;
          literary_work.value.servicios_cuc =
            literary_work.value.expediente_id.obras[0].servicios_cuc;
          literary_work.value.servicios_mn =
            literary_work.value.expediente_id.obras[0].servicios_mn;
          literary_work.value.usuario =
            literary_work.value.expediente_id.obras[0].usuario;
          literary_work.value.acetato =
            literary_work.value.expediente_id.obras[0].acetato;
          literary_work.value.pelicula_positiva =
            literary_work.value.expediente_id.obras[0].pelicula_positiva;
          literary_work.value.original_impreso =
            literary_work.value.expediente_id.obras[0].original_impreso;
          literary_work.value.cdrom =
            literary_work.value.expediente_id.obras[0].cdrom;
          literary_work.value.tripa =
            literary_work.value.expediente_id.obras[0].tripa;
          literary_work.value.cubierta =
            literary_work.value.expediente_id.obras[0].cubierta;
          literary_work.value.cubierta_retiro =
            literary_work.value.expediente_id.obras[0].cubierta_retiro;
          literary_work.value.flexiback =
            literary_work.value.expediente_id.obras[0].flexiback === 0
              ? false
              : true;
          literary_work.value.hilo =
            literary_work.value.expediente_id.obras[0].hilo === 0
              ? false
              : true;
          literary_work.value.rustica =
            literary_work.value.expediente_id.obras[0].rustica === 0
              ? false
              : true;
          literary_work.value.caballete =
            literary_work.value.expediente_id.obras[0].caballete === 0
              ? false
              : true;
          literary_work.value.poligrafico =
            literary_work.value.expediente_id.obras[0].poligrafico;
          literary_work.value.entrega_ueb_editorial =
            literary_work.value.expediente_id.obras[0].entrega_ueb_editorial;
          literary_work.value.plan_terminado_ueb_editorial =
            literary_work.value.expediente_id.obras[0].plan_terminado_ueb_editorial;
          literary_work.value.ancho =
            literary_work.value.expediente_id.obras[0].ancho;
          literary_work.value.alto =
            literary_work.value.expediente_id.obras[0].alto;
          literary_work.value.sello =
            literary_work.value.expediente_id.obras[0].sello === 0
              ? false
              : true;
          literary_work.value.riso =
            literary_work.value.expediente_id.obras[0].riso === 0
              ? false
              : true;
          literary_work.value.edicion_editorial =
            literary_work.value.expediente_id.obras[0].edicion_editorial;
          literary_work.value.compl_general =
            literary_work.value.expediente_id.obras[0].compl_general;
          literary_work.value.compl_general_valor =
            literary_work.value.expediente_id.obras[0].compl_general_valor;
          literary_work.value.compl_redaccion =
            literary_work.value.expediente_id.obras[0].compl_redaccion;
          literary_work.value.compl_mecanografia =
            literary_work.value.expediente_id.obras[0].compl_mecanografia;
          literary_work.value.compl_correccion =
            literary_work.value.expediente_id.obras[0].compl_correccion;
          literary_work.value.compl_ilustracion =
            literary_work.value.expediente_id.obras[0].compl_ilustracion;
          literary_work.value.compl_prensa =
            literary_work.value.expediente_id.obras[0].compl_prensa;
          literary_work.value.compl_prensa_valor =
            literary_work.value.expediente_id.obras[0].compl_prensa_valor;
          literary_work.value.ilust_cant =
            literary_work.value.expediente_id.obras[0].ilust_cant;
          literary_work.value.ilust_linea =
            literary_work.value.expediente_id.obras[0].ilust_linea;
          literary_work.value.ilust_color =
            literary_work.value.expediente_id.obras[0].ilust_color;
          literary_work.value.ilust_fotos =
            literary_work.value.expediente_id.obras[0].ilust_fotos;
          literary_work.value.peliculas_recibidas =
            literary_work.value.expediente_id.obras[0].peliculas_recibidas;
          literary_work.value.no_suplemento =
            literary_work.value.expediente_id.obras[0].no_suplemento;
          literary_work.value.etapa =
            literary_work.value.expediente_id.obras[0].etapa;
          literary_work.value.plan =
            literary_work.value.expediente_id.obras[0].plan;
          literary_work.value.comentarios =
            literary_work.value.expediente_id.obras[0].comentarios;
          literary_work.value.obsv_pasaporte =
            literary_work.value.expediente_id.obras[0].obsv_pasaporte;
          literary_work.value.coeficiente =
            literary_work.value.expediente_id.obras[0].coeficiente;
          literary_work.value.paginas =
            literary_work.value.expediente_id.obras[0].paginas;
          literary_work.value.antecedentes =
            literary_work.value.expediente_id.obras[0].antecedentes;
          literary_work.value.tirada_plan =
            literary_work.value.expediente_id.obras[0].tirada_plan;
          literary_work.value.cant_ename =
            literary_work.value.expediente_id.obras[0].cant_ename;
          literary_work.value.cant_ueb_ventas =
            literary_work.value.expediente_id.obras[0].cant_ueb_ventas;
          literary_work.value.cant_otros =
            literary_work.value.expediente_id.obras[0].cant_otros;
          literary_work.value.cant_muestras =
            literary_work.value.expediente_id.obras[0].cant_muestras;
          literary_work.value.precio_obra =
            literary_work.value.expediente_id.obras[0].precio_obra;
          literary_work.value.precio_costo =
            literary_work.value.expediente_id.obras[0].precio_costo;
          literary_work.value.entrada =
            literary_work.value.expediente_id.obras[0].entrada;
          literary_work.value.a_edicion =
            literary_work.value.expediente_id.obras[0].a_edicion;
          literary_work.value.devuelto =
            literary_work.value.expediente_id.obras[0].devuelto;
          literary_work.value.cancelado =
            literary_work.value.expediente_id.obras[0].cancelado;
          literary_work.value.registro =
            literary_work.value.expediente_id.obras[0].registro;
          literary_work.value.term_editorial =
            literary_work.value.expediente_id.obras[0].term_editorial;
          literary_work.value.entr_sev_poligrafico =
            literary_work.value.expediente_id.obras[0].entr_sev_poligrafico;
          literary_work.value.entr_industria =
            literary_work.value.expediente_id.obras[0].entr_industria;
          literary_work.value.terminado =
            literary_work.value.expediente_id.obras[0].terminado;
          literary_work.value.pr =
            literary_work.value.expediente_id.obras[0].pr;
          literary_work.value.art =
            literary_work.value.expediente_id.obras[0].art;
          literary_work.value.lh =
            literary_work.value.expediente_id.obras[0].lh;
          literary_work.value.may =
            literary_work.value.expediente_id.obras[0].may;
          literary_work.value.m = literary_work.value.expediente_id.obras[0].m;
          literary_work.value.vc =
            literary_work.value.expediente_id.obras[0].vc;
          literary_work.value.cf =
            literary_work.value.expediente_id.obras[0].cf;
          literary_work.value.ss =
            literary_work.value.expediente_id.obras[0].ss;
          literary_work.value.ca =
            literary_work.value.expediente_id.obras[0].ca;
          literary_work.value.c = literary_work.value.expediente_id.obras[0].c;
          literary_work.value.lt =
            literary_work.value.expediente_id.obras[0].lt;
          literary_work.value.h = literary_work.value.expediente_id.obras[0].h;
          literary_work.value.g = literary_work.value.expediente_id.obras[0].g;
          literary_work.value.sc =
            literary_work.value.expediente_id.obras[0].sc;
          literary_work.value.gmo =
            literary_work.value.expediente_id.obras[0].gmo;
          literary_work.value.ename =
            literary_work.value.expediente_id.obras[0].ename;
          literary_work.value.mined =
            literary_work.value.expediente_id.obras[0].mined;
          literary_work.value.muestra =
            literary_work.value.expediente_id.obras[0].muestra;
          literary_work.value.otros =
            literary_work.value.expediente_id.obras[0].otros;
          literary_work.value.total =
            literary_work.value.expediente_id.obras[0].total;
          literary_work.value.suma =
            literary_work.value.expediente_id.obras[0].suma;
          literary_work.value.subtitulo =
            literary_work.value.expediente_id.obras[0].subtitulo;
          literary_work.value.peso =
            literary_work.value.expediente_id.obras[0].peso;
          literary_work.value.precio_cup =
            literary_work.value.expediente_id.obras[0].precio_cup;
          literary_work.value.precio_usd =
            literary_work.value.expediente_id.obras[0].precio_usd;
          literary_work.value.no_doc_aprobacion =
            literary_work.value.expediente_id.obras[0].no_doc_aprobacion;
          literary_work.value.clav_meta =
            literary_work.value.expediente_id.obras[0].clav_meta;
          literary_work.value.narradores =
            literary_work.value.expediente_id.obras[0].narradores;
          literary_work.value.num_pistas =
            literary_work.value.expediente_id.obras[0].num_pistas;
          literary_work.value.derechos_autor =
            literary_work.value.expediente_id.obras[0].derechos_autor;
          literary_work.value.desc_comercial =
            literary_work.value.expediente_id.obras[0].desc_comercial;
          literary_work.value.version =
            literary_work.value.expediente_id.obras[0].version;
          literary_work.value.portada =
            literary_work.value.expediente_id.obras[0].portada;
          literary_work.value.ilustracion1 =
            literary_work.value.expediente_id.obras[0].ilustracion1;
          literary_work.value.ilustracion2 =
            literary_work.value.expediente_id.obras[0].ilustracion2;
          literary_work.value.ilustracion3 =
            literary_work.value.expediente_id.obras[0].ilustracion3;
          literary_work.value.ilustracion4 =
            literary_work.value.expediente_id.obras[0].ilustracion4;
          literary_work.value.ilustracion5 =
            literary_work.value.expediente_id.obras[0].ilustracion5;
          literary_work.value.cont_muestra =
            literary_work.value.expediente_id.obras[0].cont_muestra === 0
              ? false
              : true;
          literary_work.value.muestra =
            literary_work.value.expediente_id.obras[0].muestra;
          literary_work.value.version_epub =
            literary_work.value.expediente_id.obras[0].version_epub;
          literary_work.value.sobre_derec_autor =
            literary_work.value.expediente_id.obras[0].sobre_derec_autor;
          literary_work.value.colaboradores =
            literary_work.value.expediente_id.obras[0].colaboradores;
          literary_work.value.nombre_coleccion =
            literary_work.value.expediente_id.obras[0].nombre_coleccion;
          literary_work.value.numero_coleccion =
            literary_work.value.expediente_id.obras[0].numero_coleccion;
          literary_work.value.nove_version =
            literary_work.value.expediente_id.obras[0].nove_version;
          literary_work.value.rese_editoriales =
            literary_work.value.expediente_id.obras[0].rese_editoriales;
          literary_work.value.nombre_apellidos =
            literary_work.value.expediente_id.obras[0].nombre_apellidos;
          literary_work.value.fuente_resenha =
            literary_work.value.expediente_id.obras[0].fuente_resenha;
          literary_work.value.descripcion_resenha =
            literary_work.value.expediente_id.obras[0].descripcion_resenha;
          literary_work.value.material_expl =
            literary_work.value.expediente_id.obras[0].material_expl;
          literary_work.value.edicion =
            literary_work.value.expediente_id.obras[0].edicion;
          literary_work.value.imag_interiores =
            literary_work.value.expediente_id.obras[0].imag_interiores;
          literary_work.value.detalles_obra =
            literary_work.value.expediente_id.obras[0].detalles_obra;
          literary_work.value.personal_edicion =
            literary_work.value.expediente_id.obras[0].personal_edicion;
          literary_work.value.personal_disenho_cub =
            literary_work.value.expediente_id.obras[0].personal_disenho_cub;
          literary_work.value.personal_disenho_int =
            literary_work.value.expediente_id.obras[0].personal_disenho_int;
          literary_work.value.personal_emplane =
            literary_work.value.expediente_id.obras[0].personal_emplane;
          literary_work.value.peq_resenha_obra =
            literary_work.value.expediente_id.obras[0].peq_resenha_obra;
          literary_work.value.groups_id =
            literary_work.value.expediente_id.obras[0].grupos;
          literary_work.value.papers_id =
            literary_work.value.expediente_id.obras[0].papeles;
          literary_work.value.cardboards_id =
            literary_work.value.expediente_id.obras[0].cartulinas;
          literary_work.value.clasificators_id =
            literary_work.value.expediente_id.obras[0].clasificadores;
          literary_work.value.languages_id =
            literary_work.value.expediente_id.obras[0].idiomas;
          literary_work.value.usuarios_obra_id =
            literary_work.value.expediente_id.obras[0].usuarios_editorial;
          literary_work.value.publicos_audiolibro_id =
            literary_work.value.expediente_id.obras[0].publicos_audiolibro;
          literary_work.value.publicos_ebook_id =
            literary_work.value.expediente_id.obras[0].publicos_ebook;
          literary_work.value.genders_id =
            literary_work.value.expediente_id.obras[0].generos;
          literary_work.value.types_book_id =
            literary_work.value.expediente_id.obras[0].tipos_libro;
          literary_work.value.tematics_id =
            literary_work.value.expediente_id.obras[0].tematicas;
          literary_work.value.authors_id =
            literary_work.value.expediente_id.obras[0].autores;
          places_list.value =
            literary_work.value.expediente_id.obras[0].ventas.length !== 0
              ? literary_work.value.expediente_id.obras[0].ventas
              : [];
          if (literary_work.value.expediente_id.obras[0].users.length === 0) {
            edit_list_worker.value = [];
            design_cub_list.value = [];
            design_int_list.value = [];
            emplane_list.value = [];
          } else {
            let edicion = 0;
            let disenho_cub = 0;
            let disenho_int = 0;
            let emplane = 0;
            literary_work.value.expediente_id.obras[0].users.forEach((user) => {
              if (user.pivot.relacion === "edicion") {
                edicion++;
                edit_list_worker.value =
                  edicion === 1 ? [] : edit_list_worker.value;
                edit_list_worker.value.push(user);
              } else if (user.pivot.relacion === "disenho_cubierta") {
                disenho_cub++;
                design_cub_list.value =
                  disenho_cub === 1 ? [] : design_cub_list.value;
                design_cub_list.value.push(user);
              } else if (user.pivot.relacion === "disenho_interior") {
                disenho_int++;
                design_int_list.value =
                  disenho_int === 1 ? [] : design_int_list.value;
                design_int_list.value.push(user);
              } else if (user.pivot.relacion === "emplane") {
                emplane++;
                emplane_list.value = emplane === 1 ? [] : emplane_list.value;
                emplane_list.value.push(user);
              }
            });
            edit_list_worker.value = edicion > 0 ? edit_list_worker.value : [];
            design_cub_list.value =
              disenho_cub > 0 ? design_cub_list.value : [];
            design_int_list.value =
              disenho_int > 0 ? design_int_list.value : [];
            emplane_list.value = emplane > 0 ? emplane_list.value : [];
          }

          new_authors.value = { names: [] };
          new_authors_to_add.value = { names: [] };
        }
      }
    }
    function existIsbn() {
      if (old_isbn.value !== literary_work.value.isbn) {
        let i = 0;
        let found = false;
        while (!found && i < obras.value.length) {
          if (obras.value[i].isbn === literary_work.value.isbn) {
            found = true;
          }
          i++;
        }
        error_isbn.value = found ? true : false;
        error_message_isbn.value = error_isbn.value
          ? "Este ISBN está en uso"
          : "";
      }
    }
    function existIsbnObra() {
      if (old_isbn_obra.value !== literary_work.value.isbn_obra) {
        let i = 0;
        let found = false;
        while (!found && i < obras.value.length) {
          if (obras.value[i].isbn_obra === literary_work.value.isbn_obra) {
            found = true;
          }
          i++;
        }
        error_isbn_obra.value = found ? true : false;
        error_message_isbn_obra.value = error_isbn_obra.value
          ? "Este ISBN Obra está en uso"
          : "";
      }
    }
    function onFileChangePortada(event) {
      literary_work.value.portada = event.target.files[0];
      if (literary_work.value.portada !== undefined) {
        url_portada.value = URL.createObjectURL(literary_work.value.portada);
        return;
      } else {
        return;
      }
    }
    function onFileChangeIlust1(event) {
      literary_work.value.ilustracion1 = event.target.files[0];
      if (literary_work.value.ilustracion1 !== undefined) {
        url_ilust1.value = URL.createObjectURL(
          literary_work.value.ilustracion1
        );
        return;
      } else {
        return;
      }
    }
    function onFileChangeIlust2(event) {
      literary_work.value.ilustracion2 = event.target.files[0];
      if (literary_work.value.ilustracion1 !== undefined) {
        url_ilust2.value = URL.createObjectURL(
          literary_work.value.ilustracion2
        );
        return;
      } else {
        return;
      }
    }
    function onFileChangeIlust3(event) {
      literary_work.value.ilustracion3 = event.target.files[0];
      if (literary_work.value.ilustracion3 !== undefined) {
        url_ilust3.value = URL.createObjectURL(
          literary_work.value.ilustracion3
        );
        return;
      } else {
        return;
      }
    }
    function onFileChangeIlust4(event) {
      literary_work.value.ilustracion4 = event.target.files[0];
      if (literary_work.value.ilustracion4 !== undefined) {
        url_ilust4.value = URL.createObjectURL(
          literary_work.value.ilustracion4
        );
        return;
      } else {
        return;
      }
    }
    function onFileChangeIlust5(event) {
      literary_work.value.ilustracion5 = event.target.files[0];
      if (literary_work.value.ilustracion5 !== undefined) {
        url_ilust5.value = URL.createObjectURL(
          literary_work.value.ilustracion5
        );
        return;
      } else {
        return;
      }
    }
    function deletePortada() {
      literary_work.value.portada = "";
      url_portada.value = null;
    }
    function deleteIlust1() {
      literary_work.value.ilustracion1 = "";
      url_ilust1.value = null;
    }
    function deleteIlust2() {
      literary_work.value.ilustracion2 = "";
      url_ilust2.value = null;
    }
    function deleteIlust3() {
      literary_work.value.ilustracion3 = "";
      url_ilust3.value = null;
    }
    function deleteIlust4() {
      literary_work.value.ilustracion4 = "";
      url_ilust4.value = null;
    }
    function deleteIlust5() {
      literary_work.value.ilustracion5 = "";
      url_ilust5.value = null;
    }
    function openEdit() {
      emit("openEdit");
    }
    function existCpcu() {
      if (old_cpcu.value !== literary_work.value.cpcu) {
        let i = 0;
        let found = false;
        while (!found && i < obras.value.length) {
          if (obras.value[i].cpcu === literary_work.value.cpcu) {
            found = true;
          }
          i++;
        }
        error_cpcu.value = found ? true : false;
        error_message_cpcu.value = error_cpcu.value
          ? "Este CPCU está en uso"
          : "";
      }
    }

    function confirmChanges() {
      if (literary_work.value.id) {
        if (literary_work.value.titulo !== item_ref.value.titulo) {
          show_confirm.value = true;
        } else clearForm("cancelar");
      } else if (
        literary_work.value.titulo
        // literary_work.value.a_edicion ||
        // literary_work.value.acetato ||
        // literary_work.value.alto ||
        // literary_work.value.ancho ||
        // literary_work.value.antecedentes ||
        // literary_work.value.authors_id !== []
        // literary_work.value.c ||
        // literary_work.value.ca ||
        // literary_work.value.caballete ||
        // literary_work.value.cancelado ||
        // literary_work.value.cant_ename ||
        // literary_work.value.cant_muestras ||
        // literary_work.value.cant_otros ||
        // literary_work.value.cant_ueb_ventas ||
        // literary_work.value.cardboards_id ||
        // literary_work.value.cdrom ||
        // literary_work.value.cf
        // literary_work.value.clasificacion_id ||
        // literary_work.value.clasificators_id ||
        // literary_work.value.clav_meta ||
        // literary_work.value.codigo ||
        // literary_work.value.coeficiente ||
        // literary_work.value.colaboradores ||
        // literary_work.value.comentarios ||
        // literary_work.value.compl_correccion ||
        // literary_work.value.compl_general ||
        // literary_work.value.compl_general_valor ||
        // literary_work.value.compl_ilustracion ||
        // literary_work.value.compl_mecanografia ||
        // literary_work.value.compl_prensa ||
        // literary_work.value.compl_prensa_valor ||
        // literary_work.value.compl_redaccion ||
        // literary_work.value.cont_muestra ||
        // literary_work.value.cpcu ||
        // literary_work.value.cubierta ||
        // literary_work.value.cubierta_retiro ||
        // literary_work.value.derechos_autor ||
        // literary_work.value.derechos_autor_talento_artistico ||
        // literary_work.value.desc_comercial ||
        // literary_work.value.descripcion_resenha ||
        // literary_work.value.detalles_obra ||
        // literary_work.value.devuelto ||
        // literary_work.value.edicion ||
        // literary_work.value.edicion_editorial ||
        // literary_work.value.ename ||
        // literary_work.value.entr_industria ||
        // literary_work.value.entr_sev_poligrafico ||
        // literary_work.value.entrada ||
        // literary_work.value.entrega_ueb_editorial ||
        // literary_work.value.etapa ||
        // literary_work.value.expediente_id ||
        // literary_work.value.flexiback ||
        // literary_work.value.fuente_resenha ||
        // literary_work.value.g ||
        // literary_work.value.genders_id ||
        // literary_work.value.gmo ||
        // literary_work.value.groups_id ||
        // literary_work.value.h ||
        // literary_work.value.hilo ||
        // literary_work.value.ilust_cant ||
        // literary_work.value.ilust_color ||
        // literary_work.value.ilust_fotos ||
        // literary_work.value.ilust_linea ||
        // literary_work.value.ilustracion1 ||
        // literary_work.value.ilustracion2 ||
        // literary_work.value.ilustracion3 ||
        // literary_work.value.ilustracion4 ||
        // literary_work.value.ilustracion5 ||
        // literary_work.value.imag_interiores ||
        // literary_work.value.isbn ||
        // literary_work.value.isbn_obra ||
        // literary_work.value.languages_id ||
        // literary_work.value.lh ||
        // literary_work.value.lt ||
        // literary_work.value.m ||
        // literary_work.value.material_expl ||
        // literary_work.value.may ||
        // literary_work.value.mined ||
        // literary_work.value.muestra ||
        // literary_work.value.narradores ||
        // literary_work.value.no_doc_aprobacion ||
        // literary_work.value.no_suplemento ||
        // literary_work.value.nombre_apellidos ||
        // literary_work.value.nombre_coleccion ||
        // literary_work.value.nove_version ||
        // literary_work.value.num_pistas ||
        // literary_work.value.numero_coleccion ||
        // literary_work.value.obsv_pasaporte ||
        // literary_work.value.original_impreso ||
        // literary_work.value.otros ||
        // literary_work.value.paginas ||
        // literary_work.value.papers_id ||
        // literary_work.value.pelicula_positiva ||
        // literary_work.value.peliculas_recibidas ||
        // literary_work.value.peq_resenha_obra ||
        // literary_work.value.personal_disenho_cub ||
        // literary_work.value.personal_disenho_int ||
        // literary_work.value.personal_edicion ||
        // literary_work.value.personal_emplane ||
        // literary_work.value.peso ||
        // literary_work.value.places_list ||
        // literary_work.value.plan ||
        // literary_work.value.plan_terminado_ueb_editorial ||
        // literary_work.value.poligrafico ||
        // literary_work.value.portada ||
        // literary_work.value.pr ||
        // literary_work.value.precio_costo ||
        // literary_work.value.precio_cup ||
        // literary_work.value.precio_obra ||
        // literary_work.value.precio_usd ||
        // literary_work.value.publicos_audiolibro_id ||
        // literary_work.value.publicos_ebook_id ||
        // literary_work.value.registro ||
        // literary_work.value.rese_editoriales ||
        // literary_work.value.riso ||
        // literary_work.value.rustica ||
        // literary_work.value.sc ||
        // literary_work.value.sello ||
        // literary_work.value.servicios_cuc ||
        // literary_work.value.servicios_mn ||
        // literary_work.value.sobre_derec_autor ||
        // literary_work.value.ss ||
        // literary_work.value.subtitulo ||
        // literary_work.value.suma ||
        // literary_work.value.tematics_id ||
        // literary_work.value.term_editorial ||
        // literary_work.value.terminado ||
        // literary_work.value.tipo_trabajo_id ||
        // literary_work.value.tirada_plan ||
        // literary_work.value.total ||
        // literary_work.value.tripa ||
        // literary_work.value.types_book_id ||
        // literary_work.value.usuario ||
        // literary_work.value.usuarios_obra_id ||
        // literary_work.value.vc ||
        // literary_work.value.version ||
        // literary_work.value.version_epub
      ) {
        show_confirm.value = true;
      } else clearForm("cancelar");
    }

    return {
      confirmChanges,
      show_confirm,
      existIsbn,
      openEdit,
      exist_author,
      onFileChangePortada,
      onFileChangeIlust1,
      onFileChangeIlust2,
      onFileChangeIlust3,
      onFileChangeIlust4,
      onFileChangeIlust5,
      deletePortada,
      deleteIlust1,
      deleteIlust2,
      deleteIlust3,
      deleteIlust4,
      deleteIlust5,
      ilustraciones,
      error_isbn,
      error_message_isbn,
      existIsbnObra,
      error_isbn_obra,
      error_message_isbn_obra,
      existCpcu,
      error_cpcu,
      error_message_cpcu,
      expObra,
      physicalForm,
      digitalForm,
      adicionalForm,
      digitalFormat,
      filterAuthor,
      filterEmployeeEdition,
      fitlerUsuariosObra,
      fitlerPublicosEbook,
      fitlerPublicosAudiolibro,
      filterEmployeeDesignCub,
      filterEmployeeDesignInt,
      filterEmployeeEmplane,
      filterPlaces,
      expedient_info,
      filterExpedients,
      expedients,
      all_expedients,
      existExpedient,
      createExpedient,
      employees_edition,
      employees_design_cub,
      employees_design_int,
      employees_emplane,
      places,
      type_,
      url_portada,
      url_ilust1,
      url_ilust2,
      url_ilust3,
      url_ilust4,
      filterNewAuthor,
      url_ilust5,
      edit_list_worker,
      edit_list_worker_copy,
      design_cub_list,
      design_cub_list_copy,
      design_int_list,
      design_int_list_copy,
      emplane_list,
      emplane_list_copy,
      places_list,
      places_list_copy,
      places_address_list,
      places_address_list_copy,
      groups,
      tematics,
      error,
      error_msg,
      usuarios_obra,
      publicos_audiolibro,
      publicos_ebook,
      types_cardboard,
      types_paper,
      types_work,
      types_book,
      clasificators,
      clasifications,
      readonly_show,
      languages,
      genders,
      loading_btn_submit,
      addAuthor,
      tab,
      model_author,
      loading,
      authors_filtered,
      model,
      show,
      nextTab,
      action,
      clearForm,
      form,
      literary_work,
      filterPaper,
      filterCardBoard,
      fitlerTematics,
      fitlerTypesWork,
      fitlerTypesBook,
      fitlerGroups,
      fitlerGenders,
      new_expedient,
      fitlerLanguages,
      filterClasificators,
      filterClasifications,
      setComplexity,
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
}
.dialog-form {
  height: 90vh;
}
.btn-add-author {
  max-width: 230px;
  align-self: center;
}
.cell-col2 {
  height: 67.65px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
}
.cell-col10 {
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
}
.text-center {
  text-align: center;
}
.b {
  border: 1px solid black;
}
</style>
