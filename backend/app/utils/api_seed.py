import requests
from datetime import datetime

API_BASE = "http://127.0.0.1:8000"


def to_cents(number: int | float) -> int:
    return int(number * 100)


def create_client(name, nickname, phone, email):
    data = {
        "name": name,
        "nickname": nickname,
        "phone": phone,
        "email": email,
    }

    r = requests.post(f"{API_BASE}/clients", json=data)

    if r.status_code == 200:
        client = r.json()["client"]
        print(f"✅ Client created: {client['name']} (id={client['id']})")
        return client

    print(f"⚠️ Failed to create client {name}: {r.text}")
    return None


def create_purchase(
    client_id,
    description,
    total_cents,
    amount_cents,
    note_number,
    payment_description=None,
    method=None,
):
    data = {
        "description": description,
        "total_cents": total_cents,
        "note_number": note_number,
        # payment
        "amount_cents": amount_cents,
        "payment_description": payment_description,
        "method": method,
        "payment_date": int(datetime.now().timestamp()),
        "receipt_number": f"REC-{note_number.split('-')[1]}",
    }

    r = requests.post(f"{API_BASE}/purchases/{client_id}", json=data)

    if r.status_code == 200:
        purchase = r.json()["purchase"]
        print(f"✅ Purchase created: {purchase['noteNumber']} (id={purchase['id']})")
        return purchase

    print(f"⚠️ Failed to create purchase: {r.text}")
    return None


def create_payment(purchase_id, amount_cents, method, description, receipt_number):
    data = {
        "amount_cents": amount_cents,
        "method": method,
        "description": description,
        "receipt_number": receipt_number,
        "payment_date": int(datetime.now().timestamp()),
    }

    r = requests.post(f"{API_BASE}/purchases/{purchase_id}/payments", json=data)

    if r.status_code == 200:
        payment = r.json()["payment"]
        print(
            f"💰 Payment created: {payment['receiptNumber']} (amount_cents={payment['amountCents']})"
        )
        return payment

    print(f"⚠️ Failed to create payment: {r.text}")
    return None


def run_seed():
    print("🚀 Starting API seed script...\n")

    # 1️⃣ Create clients
    clients = [
        create_client("João Silva", "joao", "11999999999", "joao@email.com"),
        create_client("Maria Souza", "maria", "11988888888", "maria@email.com"),
        create_client("Carlos Lima", "carlos", None, "carlos@email.com"),
        create_client("João Santos", None, "21977777777", "joaosantos@email.com"),
    ]

    # 2️⃣ Create purchases
    purchases = []

    if clients[0]:
        purchases.append(
            create_purchase(
                clients[0]["id"],
                "Compra de sementes",
                to_cents(100),
                to_cents(30),
                "NF-0001",
                "Pagamento adiantado",
                "Pix",
            )
        )

        purchases.append(
            create_purchase(
                clients[0]["id"],
                "Compra de ferramentas",
                to_cents(300),
                to_cents(300),
                "NF-0002",
                None,
                "Cartão",
            )
        )

    if clients[1]:
        purchases.append(
            create_purchase(
                clients[1]["id"],
                "Compra de adubo",
                20000,
                None,
                "NF-0003",
                None,
                "Dinheiro",
            )
        )

    # 3️⃣ Extra payments
    if purchases and purchases[0]:
        create_payment(
            purchases[0]["id"],
            to_cents(50),
            "Pix",
            "Segunda parcela",
            "REC-0004",
        )

    print("\n✅ Seed complete!")
    print("👉 http://127.0.0.1:8000/docs")
    print("👉 http://127.0.0.1:8000/clients\n")


if __name__ == "__main__":
    run_seed()
