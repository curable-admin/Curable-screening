package com.curable.service.dto.custom;

import java.io.Serializable;
import java.util.List;

public class DiseaseTypeWithSubTypesDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String diseaseType;
    private List<SubDiseaseTypeDTO> subDiseaseTypes;

    public DiseaseTypeWithSubTypesDTO() {
    }

    public DiseaseTypeWithSubTypesDTO(String diseaseType, List<SubDiseaseTypeDTO> subDiseaseTypes) {
        this.diseaseType = diseaseType;
        this.subDiseaseTypes = subDiseaseTypes;
    }

    public String getDiseaseType() {
        return diseaseType;
    }

    public void setDiseaseType(String diseaseType) {
        this.diseaseType = diseaseType;
    }

    public List<SubDiseaseTypeDTO> getSubDiseaseTypes() {
        return subDiseaseTypes;
    }

    public void setSubDiseaseTypes(List<SubDiseaseTypeDTO> subDiseaseTypes) {
        this.subDiseaseTypes = subDiseaseTypes;
    }

    public static class SubDiseaseTypeDTO implements Serializable {
        private static final long serialVersionUID = 1L;

        private Long id;
        private String description;

        public SubDiseaseTypeDTO() {
        }

        public SubDiseaseTypeDTO(Long id, String description) {
            this.id = id;
            this.description = description;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }
}