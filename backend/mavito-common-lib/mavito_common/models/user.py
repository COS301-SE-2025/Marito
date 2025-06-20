# app/models/user.py
from sqlalchemy import (
    Column,  # noqa: F401
    Integer,
    String,
    Boolean,
    DateTime,
    Enum as SaEnum,
)  # noqa: F401
from sqlalchemy.dialects.postgresql import UUID  # For PostgreSQL UUID type
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,  # noqa: F401
)  # noqa: F401 (relationship for future use)
from sqlalchemy.sql import func  # For server-side default timestamps
from mavito_common.db.base_class import Base
import enum  # For Python Enum for roles
import uuid  # For generating UUIDs
from typing import Optional  # For optional fields
from datetime import datetime  # For datetime type hint


# Define an Enum for the user roles if you want to use it in Python code as well
class UserRole(str, enum.Enum):
    linguist = "linguist"
    researcher = "researcher"
    contributor = "contributor"
    # admin = "admin" # You might add more roles


class User(Base):
    # __tablename__ will be 'users' due to Base class logic

    # Using UUID as the primary key
    # default=uuid.uuid4 means the UUID will be generated by the Python application
    # before being sent to the database.
    # server_default=func.gen_random_uuid() could be used for DB-side generation if preferred,
    # but client-side generation is often simpler for application logic.
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )

    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(
        String(100), unique=True, index=True, nullable=False
    )
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)

    # Using SQLAlchemy's Enum type for the role
    # Ensure the 'name' for SaEnum is unique if you use other Enums in other tables,
    # especially if your DB creates a distinct type for it (like PostgreSQL).
    role: Mapped[Optional[UserRole]] = mapped_column(
        SaEnum(UserRole, name="user_role_enum_type_sqla"), nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    last_login: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    profile_pic_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    # Security features
    password_reset_token: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True, index=True
    )
    verification_token: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True, index=True
    )
    account_locked: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    failed_login_attempts: Mapped[int] = mapped_column(Integer, default=0)
    deleted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # Relationships (placeholders for future implementation)
    # proficient_languages: Mapped[List["UserLanguage"]] = relationship(back_populates="user")
    # preferences: Mapped[Optional["UserPreference"]] = relationship(uselist=False, back_populates="user")
    # search_history: Mapped[List["UserSearchHistory"]] = relationship(back_populates="user")
