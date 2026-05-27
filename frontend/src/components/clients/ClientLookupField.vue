<template>
  <div class="q-pb-md">
    <q-select
      filled
      v-model="model"
      clearable
      use-input
      hide-selected
      fill-input
      input-debounce="0"
      label="Selecionar o cliente..."
      hint="Escolha o cliente a quem pertence a compra"
      :options="options"
      @filter="filterFn"
      @filter-abort="abortFilterFn"
    >
      <template #no-option>
        <q-item>
          <q-item-section class="text-grey">Sem clientes</q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { QSelect, QSelectProps } from "quasar";

const stringOptions = ["Carlos", "josé", "maria"].reduce((acc, opt) => {
  for (let i = 1; i <= 5; i++) {
    acc.push(opt + " " + i);
  }
  return acc;
}, [] as string[]);

const options = ref(stringOptions);
const model = ref();

const filterFn: QSelectProps["onFilter"] = (
  val: string,
  update: (cb: () => void, afterCb: (compRef: QSelect) => void) => void,
  abort: any,
) => {
  // call abort() at any time if you can't retrieve data somehow

  setTimeout(() => {
    update(
      () => {
        if (val === "") {
          options.value = stringOptions;
        } else {
          const needle = val.toLowerCase();
          options.value = stringOptions.filter(
            (v) => v.toLowerCase().indexOf(needle) > -1,
          );
        }
      },

      (compRef) => {
        if (val !== "" && compRef.options && compRef.options.length > 0) {
          compRef.setOptionIndex(-1); // reset optionIndex in case there is something selected
          compRef.moveOptionSelection(1, true); // focus the first selectable option and do not update the input-value
        }
      },
    );
  }, 0);
};

function abortFilterFn() {
  console.log("delayed filter aborted");
}
</script>
