"""your_message

Revision ID: 57a446c7b098
Revises: ce4b344c2399
Create Date: 2025-07-06 09:33:35.079111

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "57a446c7b098"
down_revision: Union[str, Sequence[str], None] = "ce4b344c2399"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f("ix_termvotes_term_id"), table_name="termvotes")
    op.drop_index(op.f("ix_termvotes_user_id"), table_name="termvotes")
    op.drop_table("termvotes")
    op.drop_table("term_translations")
    op.drop_table("linguistapplications")
    op.drop_index(op.f("ix_terms_domain"), table_name="terms")
    op.drop_index(op.f("ix_terms_language"), table_name="terms")
    op.drop_index(op.f("ix_terms_term"), table_name="terms")
    op.drop_table("terms")
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_index(op.f("ix_users_id"), table_name="users")
    op.drop_index(op.f("ix_users_password_reset_token"), table_name="users")
    op.drop_index(op.f("ix_users_verification_token"), table_name="users")
    op.drop_table("users")
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "users",
        sa.Column("id", sa.UUID(), autoincrement=False, nullable=False),
        sa.Column(
            "first_name", sa.VARCHAR(length=50), autoincrement=False, nullable=False
        ),
        sa.Column(
            "last_name", sa.VARCHAR(length=50), autoincrement=False, nullable=False
        ),
        sa.Column("email", sa.VARCHAR(length=100), autoincrement=False, nullable=False),
        sa.Column(
            "password_hash", sa.VARCHAR(length=255), autoincrement=False, nullable=False
        ),
        sa.Column(
            "role",
            postgresql.ENUM(
                "linguist", "contributor", "admin", name="user_role_enum_type_sqla"
            ),
            autoincrement=False,
            nullable=True,
        ),
        sa.Column(
            "created_at",
            postgresql.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "last_login",
            postgresql.TIMESTAMP(timezone=True),
            autoincrement=False,
            nullable=True,
        ),
        sa.Column("is_verified", sa.BOOLEAN(), autoincrement=False, nullable=False),
        sa.Column("profile_pic_url", sa.VARCHAR(), autoincrement=False, nullable=True),
        sa.Column(
            "password_reset_token",
            sa.VARCHAR(length=255),
            autoincrement=False,
            nullable=True,
        ),
        sa.Column(
            "verification_token",
            sa.VARCHAR(length=255),
            autoincrement=False,
            nullable=True,
        ),
        sa.Column("account_locked", sa.BOOLEAN(), autoincrement=False, nullable=False),
        sa.Column("is_active", sa.BOOLEAN(), autoincrement=False, nullable=False),
        sa.Column(
            "failed_login_attempts", sa.INTEGER(), autoincrement=False, nullable=False
        ),
        sa.Column(
            "deleted_at",
            postgresql.TIMESTAMP(timezone=True),
            autoincrement=False,
            nullable=True,
        ),
        sa.PrimaryKeyConstraint("id", name="users_pkey"),
        postgresql_ignore_search_path=False,
    )
    op.create_index(
        op.f("ix_users_verification_token"),
        "users",
        ["verification_token"],
        unique=False,
    )
    op.create_index(
        op.f("ix_users_password_reset_token"),
        "users",
        ["password_reset_token"],
        unique=False,
    )
    op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)
    op.create_table(
        "terms",
        sa.Column("id", sa.UUID(), autoincrement=False, nullable=False),
        sa.Column("term", sa.VARCHAR(length=255), autoincrement=False, nullable=False),
        sa.Column("definition", sa.TEXT(), autoincrement=False, nullable=False),
        sa.Column(
            "language", sa.VARCHAR(length=50), autoincrement=False, nullable=False
        ),
        sa.Column(
            "domain", sa.VARCHAR(length=100), autoincrement=False, nullable=False
        ),
        sa.Column("example", sa.TEXT(), autoincrement=False, nullable=True),
        sa.PrimaryKeyConstraint("id", name="terms_pkey"),
        postgresql_ignore_search_path=False,
    )
    op.create_index(op.f("ix_terms_term"), "terms", ["term"], unique=False)
    op.create_index(op.f("ix_terms_language"), "terms", ["language"], unique=False)
    op.create_index(op.f("ix_terms_domain"), "terms", ["domain"], unique=False)
    op.create_table(
        "linguistapplications",
        sa.Column("id", sa.UUID(), autoincrement=False, nullable=False),
        sa.Column("user_id", sa.UUID(), autoincrement=False, nullable=False),
        sa.Column(
            "status",
            postgresql.ENUM(
                "pending", "approved", "rejected", name="application_status_enum"
            ),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column("id_document_url", sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column("cv_document_url", sa.VARCHAR(), autoincrement=False, nullable=False),
        sa.Column(
            "certifications_document_url",
            sa.VARCHAR(),
            autoincrement=False,
            nullable=True,
        ),
        sa.Column(
            "research_papers_document_url",
            sa.VARCHAR(),
            autoincrement=False,
            nullable=True,
        ),
        sa.Column(
            "submitted_at",
            postgresql.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            autoincrement=False,
            nullable=False,
        ),
        sa.Column(
            "reviewed_at",
            postgresql.TIMESTAMP(timezone=True),
            autoincrement=False,
            nullable=True,
        ),
        sa.ForeignKeyConstraint(
            ["user_id"], ["users.id"], name=op.f("linguistapplications_user_id_fkey")
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("linguistapplications_pkey")),
        sa.UniqueConstraint(
            "user_id",
            name=op.f("linguistapplications_user_id_key"),
            postgresql_include=[],
            postgresql_nulls_not_distinct=False,
        ),
    )
    op.create_table(
        "term_translations",
        sa.Column("term_id", sa.UUID(), autoincrement=False, nullable=False),
        sa.Column("translation_id", sa.UUID(), autoincrement=False, nullable=False),
        sa.ForeignKeyConstraint(
            ["term_id"], ["terms.id"], name=op.f("term_translations_term_id_fkey")
        ),
        sa.ForeignKeyConstraint(
            ["translation_id"],
            ["terms.id"],
            name=op.f("term_translations_translation_id_fkey"),
        ),
        sa.PrimaryKeyConstraint(
            "term_id", "translation_id", name=op.f("term_translations_pkey")
        ),
    )
    op.create_table(
        "termvotes",
        sa.Column("id", sa.UUID(), autoincrement=False, nullable=False),
        sa.Column("term_id", sa.UUID(), autoincrement=False, nullable=False),
        sa.Column("user_id", sa.UUID(), autoincrement=False, nullable=False),
        sa.Column(
            "vote",
            postgresql.ENUM("upvote", "downvote", name="vote_type_enum"),
            autoincrement=False,
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["term_id"], ["terms.id"], name=op.f("termvotes_term_id_fkey")
        ),
        sa.ForeignKeyConstraint(
            ["user_id"], ["users.id"], name=op.f("termvotes_user_id_fkey")
        ),
        sa.PrimaryKeyConstraint("id", name=op.f("termvotes_pkey")),
    )
    op.create_index(
        op.f("ix_termvotes_user_id"), "termvotes", ["user_id"], unique=False
    )
    op.create_index(
        op.f("ix_termvotes_term_id"), "termvotes", ["term_id"], unique=False
    )
    # ### end Alembic commands ###
