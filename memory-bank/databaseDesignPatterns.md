# 🗃️ Database Design Patterns

### Extensible Schema Pattern

```sql
-- Core entity tables
CREATE TABLE entities (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,     -- products, customers, orders, etc.
  data JSONB NOT NULL,           -- Flexible schema for diverse data
  metadata JSONB,                -- LLM-generated insights
  created_at TIMESTAMP DEFAULT NOW()
);

-- Entity relationships
CREATE TABLE entity_relationships (
  id SERIAL PRIMARY KEY,
  from_entity_id INTEGER REFERENCES entities(id),
  to_entity_id INTEGER REFERENCES entities(id),
  relationship_type VARCHAR(50),
  metadata JSONB
);
```

### Audit & LLM Tracking

```sql
-- Track LLM processing and decisions
CREATE TABLE llm_processing_log (
  id SERIAL PRIMARY KEY,
  entity_id INTEGER REFERENCES entities(id),
  operation_type VARCHAR(50),    -- mapping, cleaning, analysis
  llm_model VARCHAR(50),
  input_data JSONB,
  output_data JSONB,
  confidence_score DECIMAL(3,2),
  processing_time INTEGER,       -- milliseconds
  created_at TIMESTAMP DEFAULT NOW()
);
```
