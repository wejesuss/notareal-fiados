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
import { computed, onMounted, shallowRef } from "vue";
import { type QSelect, type QSelectProps } from "quasar";
import { getClients } from "src/services";
import { normalizeText } from "src/utils/normalizers/text";

type ClientLookupOption = {
  label: string;
  value: number;
  nickname?: string;
  active: boolean;
  disable: boolean;
};

onMounted(async () => await searchClients());

const clientId = defineModel<number | null>();
const clientOptions = shallowRef<ClientLookupOption[]>([]);
const options = shallowRef<ClientLookupOption[]>([]);
const selectedClient = computed({
  get() {
    return clientOptions.value.find(
      (client) => client.value === clientId.value,
    );
  },

  set(client) {
    clientId.value = client?.value ?? null;
  },
});

async function searchClients() {
  try {
    const { clients } = await getClients({ onlyActive: false });
    clientOptions.value = clients.map((client) => ({
      label: client.name,
      value: client.id,
      active: client.isActive,
      disable: !client.isActive,
      ...(client.nickname && { nickname: client.nickname }),
    }));

    options.value = clientOptions.value;
  } catch (err) {
    console.error(err);
  }
}

const filterFn: QSelectProps["onFilter"] = (
  val: string,
  update: (cb: () => void, afterCb: (compRef: QSelect) => void) => void,
) => {
  update(
    () => {
      if (val === "") {
        options.value = clientOptions.value;
      } else {
        const needle = normalizeText(val);
        options.value = clientOptions.value.filter((v) =>
          normalizeText(v.label).includes(needle),
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
};
</script>
