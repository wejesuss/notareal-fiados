<template>
  <div class="q-pb-md">
    <q-select
      filled
      v-model="selectedClient"
      clearable
      use-input
      hide-selected
      fill-input
      bottom-slots
      :error="!!loadingError"
      input-debounce="0"
      :options="options"
      label="Selecionar o cliente..."
      hint="Escolha o cliente a quem pertence a compra"
      @filter="filterFn"
    >
      <template #no-option>
        <q-item>
          <q-item-section class="text-grey">Sem cliente</q-item-section>
        </q-item>
      </template>

      <template #error v-if="loadingError">
        <q-item>
          <q-item-section class="text-grey-7 q-mr-sm"
            >Erro ao buscar clientes:
            {{ loadingError.message }}
          </q-item-section>
          <q-btn @click="searchClients">Recarregar</q-btn>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from "vue";
import { type QSelect, type QSelectProps } from "quasar";
import { getClients } from "src/services";
import { normalizeText } from "src/utils/normalizers/text";
import { mapAPIError } from "src/utils/mappers/errors";
import { type UIError } from "src/types/errors";

type ClientLookupOption = {
  label: string;
  value: number;
  active: boolean;
  disable: boolean;
};

onMounted(async () => await searchClients());

const emit = defineEmits<{ searchError: [error: unknown] }>();
const loadingError = ref<UIError | null>(null);
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
  loadingError.value = null;

  try {
    const { clients } = await getClients({ onlyActive: false });
    clientOptions.value = clients.map((client) => ({
      label: client.nickname
        ? `${client.name} (${client.nickname})`
        : client.name,
      value: client.id,
      active: client.isActive,
      disable: !client.isActive,
    }));

    options.value = clientOptions.value;
  } catch (err) {
    loadingError.value = mapAPIError(err);

    emit("searchError", err);
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
