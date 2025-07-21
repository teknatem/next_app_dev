-- Rename table from employees to d003_employees (following memory-bank naming convention)
ALTER TABLE employees RENAME TO d003_employees;

-- Add missing mandatory fields according to memory-bank/db rules.md
ALTER TABLE d003_employees ADD COLUMN version INTEGER NOT NULL DEFAULT 0;
ALTER TABLE d003_employees ADD COLUMN created_by UUID REFERENCES users(id);
ALTER TABLE d003_employees ADD COLUMN updated_by UUID REFERENCES users(id);
ALTER TABLE d003_employees ADD COLUMN tenant_id UUID; -- For multi-tenant support
ALTER TABLE d003_employees ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE d003_employees ADD COLUMN deleted_by UUID REFERENCES users(id);
ALTER TABLE d003_employees ADD COLUMN metadata JSONB;
ALTER TABLE d003_employees ADD COLUMN status VARCHAR(20) DEFAULT 'active';

-- Create indexes for better performance
CREATE INDEX idx_d003_employees_created_by ON d003_employees(created_by);
CREATE INDEX idx_d003_employees_updated_by ON d003_employees(updated_by);
CREATE INDEX idx_d003_employees_tenant_id ON d003_employees(tenant_id);
CREATE INDEX idx_d003_employees_status ON d003_employees(status);
CREATE INDEX idx_d003_employees_is_deleted ON d003_employees(is_deleted);
CREATE INDEX idx_d003_employees_department ON d003_employees(department);

-- Update existing records with default version
UPDATE d003_employees SET version = 1 WHERE version = 0; 