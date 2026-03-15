from passlib.context import CryptContext

# Tell passlib to use bcrypt for hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """
    Takes a plain text password and returns a hashed version.
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Checks if the plain password matches the hash in the database.
    """
    return pwd_context.verify(plain_password, hashed_password)