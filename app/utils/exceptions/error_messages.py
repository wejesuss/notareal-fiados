# === Clients ===
CLIENT_NOT_FOUND = "Cliente não encontrado."
CLIENT_ALREADY_EXISTS = "Um cliente com esse apelido já existe."
CLIENT_INVALID_NAME = "Nome inválido. Evite números e símbolos."
CLIENT_DELETE_FAILED = "Não foi possível desativar o cliente."

# === Purchases ===
PURCHASE_NOT_FOUND = "Compra não encontrada."
PURCHASE_ALREADY_EXISTS = "Uma compra com esse número de nota já existe."
PURCHASE_INVALID_TOTAL = "O valor total da compra deve ser maior que zero."
PURCHASE_INVALID_STATUS = "Status inválido. Use 'pending', 'partial' ou 'paid'."
PURCHASE_CLIENT_NOT_FOUND = "Um cliente com esse id não existe."
PURCHASE_INVALID_ACTIVATION_ROUTE = "Chamada inválida. Utilize a rota correta para a ativação ou desativação da compra."
PURCHASE_ALREADY_ENABLED = "Compra já está ativa."
PURCHASE_ALREADY_DISABLED = "Compra já está desativada."

# === Payments ===
PAYMENT_NOT_FOUND = "Pagamento não encontrado."
PAYMENT_ALREADY_EXISTS = "Um pagamento com esse número de recibo já existe."
PAYMENT_INVALID_AMOUNT = "O valor do pagamento deve ser maior que zero."
PAYMENT_PURCHASE_NOT_FOUND = "Uma compra com esse id não existe."
PAYMENT_NOT_LINKED = "Pagamento não pertence à compra especificada."
PAYMENT_ALREADY_DISABLED = "Pagamento já desativado."
PAYMENT_CREATION_FAILED = "Não é possível adicionar pagamento a uma compra desativada."
PAYMENT_PURCHASE_CREATION_FAILED = "Não foi possível criar o pagamento junto com a compra."
PAYMENT_INVALID_ACTIVATION_ROUTE = "Chamada inválida. Utilize a rota correta para a ativação ou desativação do pagamento."

# === Database / Generic ===
DATABASE_ERROR = "Erro inesperado no banco de dados."
FOREIGN_KEY_ERROR = "Uma referência estrangeira não existe. Utilize um ID correto."
DATA_FIELDS_EMPTY = "Nenhum campo válido fornecido para a atualização do recurso."
RESOURCE_CREATION_VALUE_ERROR = "Campos fornecidos para a criação ou atualização possuem valores inválidos ou do tipo incorreto."
