import unicodedata

ALLOWED_EXTRA = set(" .'-")

def is_valid_name(name: str) -> bool:
    for ch in name:
        if ch in ALLOWED_EXTRA:
            continue

        cat = unicodedata.category(ch)
        # L = Letter
        if cat.startswith("L"):
            continue

        return False

    return True
