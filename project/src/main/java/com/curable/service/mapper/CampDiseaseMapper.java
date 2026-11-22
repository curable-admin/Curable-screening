package com.curable.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.curable.domain.CampDisease;
import com.curable.service.dto.CampDiseasesDTO;

@Mapper(componentModel = "spring", uses = {CampMapper.class,DiseaseTestMasterMapper.class})
public interface CampDiseaseMapper extends EntityMapper<CampDiseasesDTO, CampDisease> {
	@Mapping(source = "camp.id", target = "campId")
	@Mapping(source = "diseaseTestMaster.id", target = "diseaseTestMasterId")
	CampDiseasesDTO toDto(CampDisease campDisease);

	@Mapping(source = "campId", target = "camp")
	@Mapping(source = "diseaseTestMasterId", target = "diseaseTestMaster")
	CampDisease toEntity(CampDiseasesDTO campDiseasesDTO);

	default CampDisease fromId(Long id) {
		if (id == null) {
			return null;
		}
		CampDisease campDisease = new CampDisease();
		campDisease.setId(id);
		return campDisease;
	}
}