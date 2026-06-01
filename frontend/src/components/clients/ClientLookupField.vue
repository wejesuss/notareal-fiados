<template>
  <div class="q-pb-md">
    <q-select
      filled
      v-model="selectedClient"
      clearable
      use-input
      hide-selected
      fill-input
      input-debounce="0"
      :options="options"
      label="Selecionar o cliente..."
      hint="Escolha o cliente a quem pertence a compra"
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
import { ref, shallowRef, watch } from "vue";
import { type QSelect, type QSelectProps } from "quasar";
import { getClients } from "src/services";

type ClientLookupOption = {
  label: string;
  value: number;
  nickname?: string;
  active: boolean;
  disable: boolean;
};

const props = defineProps<{ clientId: number | undefined }>();

const clientOptions = shallowRef<ClientLookupOption[]>([]);
const options = shallowRef<ClientLookupOption[]>([]);
const selectedClient = ref<ClientLookupOption>();

watch(
  () => props.clientId,
  async (id) => {
    if (clientOptions.value.length === 0) {
      await searchClients();
    }

    if (id) {
      selectedClient.value = clientOptions.value.find(
        (client) => client.value === id,
      );
    }
  },
  { immediate: true },
);

const filterFn: QSelectProps["onFilter"] = (
  val: string,
  update: (cb: () => void, afterCb: (compRef: QSelect) => void) => void,
) => {
  // call abort() at any time if you can't retrieve data somehow

  setTimeout(() => {
    update(
      () => {
        if (val === "") {
          options.value = clientOptions.value;
        } else {
          const needle = val.toLowerCase();
          options.value = clientOptions.value.filter(
            (v) => v.label.toLowerCase().indexOf(needle) > -1,
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

async function searchClients() {
  try {
    const { clients } = await getClients({ onlyActive: false });
    clientOptions.value = clients.reduce((acc, client) => {
      acc.push({
        label: client.name,
        value: client.id,
        active: client.isActive,
        disable: !client.isActive,
        ...(client.nickname && { nickname: client.nickname }),
      });

      return acc;
    }, [] as Array<ClientLookupOption>);
  } catch (err) {
    console.error(err);
  }
}
</script>
