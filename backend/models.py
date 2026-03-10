import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, UniqueConstraint
from database import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    company_name = Column(Text, nullable=False)
    hr_email = Column(Text, nullable=False)
    role = Column(Text, nullable=True)
    date_applied = Column(DateTime, nullable=True)
    status = Column(Text, default="Applied")  # Applied, Interviewing, Offer, Rejected, etc.
    source = Column(Text, default="Direct")   # Direct, Portal
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    email_subject = Column(Text, nullable=True)
    email_body = Column(Text, nullable=True)

    # Prevent duplicate entries by company_name + hr_email
    __table_args__ = (
        UniqueConstraint('company_name', 'hr_email', name='uq_company_hr_email'),
    )

    def to_dict(self):
        return {
            "id": str(self.id),
            "company": self.company_name,
            "hr_email": self.hr_email,
            "role": self.role,
            "status": self.status,
            "source": self.source,
            "date": self.date_applied.strftime("%Y-%m-%d") if self.date_applied else None,
            "last_updated": self.last_updated.strftime("%Y-%m-%d %H:%M:%S") if self.last_updated else None,
            "email_subject": self.email_subject,
            "email_body": self.email_body,
        }
