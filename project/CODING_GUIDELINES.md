# Coding Guidelines (Dos and Don'ts)

## How to use / keep updated
- Whenever you state a new rule in your prompt (e.g., "don't do X, do Y instead"), ask me to append it to this file.
- I will add the rule under the relevant section (or create a new section) so future coding follows it.
- Reference this file in prompts (e.g., "follow CODING_GUIDELINES.md") to ensure consistency.

## JPA / Repository Queries

### Do
- Use explicit `left join` (or appropriate join) with an alias when accessing related entity fields in JPQL queries.
- Reference related entity columns through the joined alias (e.g., `dm.id`, `dm.name`).
- Keep filters on the joined entity using the alias (e.g., `dm is not null`).

### Don't
- Do NOT use cross-reference navigation in JPQL select clauses such as `dtm.diseaseMaster.name` or `dtm.diseaseMaster.id`.
- Do NOT rely on implicit joins for related entity attributes in projection queries.

### Example

**Bad (cross-reference):**
```java
@Query("select new com.curable.service.dto.custom.DiseaseTestMasterProjectionDTO(dtm.id, dtm.name, dtm.diseaseMaster.id, dtm.diseaseMaster.name) from DiseaseTestMaster dtm where dtm.hospital.id = :hospitalId and dtm.isRecordDeleted = false and dtm.diseaseMaster is not null")
```

**Good (left join):**
```java
@Query("select new com.curable.service.dto.custom.DiseaseTestMasterProjectionDTO(dtm.id, dtm.name, dm.id, dm.name) from DiseaseTestMaster dtm left join dtm.diseaseMaster dm where dtm.hospital.id = :hospitalId and dtm.isRecordDeleted = false and dm is not null")
```
