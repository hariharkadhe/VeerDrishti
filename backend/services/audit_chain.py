import hashlib
import json
from datetime import datetime
from sqlalchemy.orm import Session
from models import schemas
import crud

class AuditChainService:
    def __init__(self):
        self.secret_salt = "SSB_SENTINEL_2026_CLASSIFIED"

    def _generate_hash(self, event_id, action_type, operator_id, prev_hash, timestamp):
        payload = f"{event_id}|{action_type}|{operator_id}|{prev_hash}|{timestamp.isoformat()}|{self.secret_salt}"
        return hashlib.sha256(payload.encode('utf-8')).hexdigest()

    def log_action(self, db: Session, event_id: int, action_type: str, operator_id: str):
        # Fetch the latest audit log to get the previous hash
        latest_log = db.query(crud.models.AuditChain).order_by(crud.models.AuditChain.id.desc()).first()
        prev_hash = latest_log.hash_value if latest_log else "0" * 64
        
        timestamp = datetime.utcnow()
        new_hash = self._generate_hash(event_id, action_type, operator_id, prev_hash, timestamp)

        audit_create = schemas.AuditChainCreate(
            event_id=event_id,
            action_type=action_type,
            operator_id=operator_id,
            hash_value=new_hash,
            previous_hash=prev_hash
        )

        return crud.create_audit_chain(db, audit_create)

    def verify_chain(self, db: Session):
        logs = db.query(crud.models.AuditChain).order_by(crud.models.AuditChain.id.asc()).all()
        if not logs:
            return True, "Chain is empty"
            
        for i in range(1, len(logs)):
            current = logs[i]
            prev = logs[i-1]
            
            if current.previous_hash != prev.hash_value:
                return False, f"Broken link detected at block {current.id}"
                
            recalc_hash = self._generate_hash(
                current.event_id, 
                current.action_type, 
                current.operator_id, 
                current.previous_hash, 
                current.timestamp
            )
            
            if recalc_hash != current.hash_value:
                return False, f"Data tampering detected at block {current.id}"
                
        return True, "Chain is valid and secure"

audit_service = AuditChainService()
